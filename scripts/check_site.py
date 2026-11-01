#!/usr/bin/env python3
"""Pre-deploy checks for the static site in ./site.

Fails (exit 1) if index.html points at a local file that doesn't exist,
if required files are missing, or if the chat widget isn't wired up.
Uses only the Python standard library so it runs anywhere.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import sys

SITE = Path(__file__).resolve().parent.parent / "site"
REQUIRED = ["index.html", "robots.txt", "sitemap.xml", "marc-assistant.js", "script.js"]
SKIP_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}


class RefCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.title, self._in_title = [], "", False
        self.assistant_tag = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self._in_title = True
        for key in ("src", "href"):
            if a.get(key):
                self.refs.append((tag, a[key]))
        if tag == "script" and (a.get("src") or "").endswith("marc-assistant.js"):
            self.assistant_tag = a

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data


def main():
    errors = []
    for name in REQUIRED:
        if not (SITE / name).is_file():
            errors.append(f"missing required file: site/{name}")

    index = SITE / "index.html"
    if index.is_file():
        p = RefCollector()
        p.feed(index.read_text(encoding="utf-8"))

        if not p.title.strip():
            errors.append("index.html has no <title>")

        checked = 0
        for tag, ref in p.refs:
            u = urlparse(ref)
            if u.scheme in SKIP_SCHEMES or ref.startswith("#") or ref.startswith("//"):
                continue
            path = unquote(u.path).lstrip("/")
            if not path:
                continue
            checked += 1
            if not (SITE / path).is_file():
                errors.append(f"broken local link in index.html: <{tag}> -> {ref}")

        t = p.assistant_tag
        if not t:
            errors.append("chat widget script tag (marc-assistant.js) not found in index.html")
        elif not (t.get("data-api") or "").startswith("https://"):
            errors.append("chat widget script tag has no https data-api URL")
        print(f"checked {checked} local references in index.html")

    if errors:
        print("\n".join("ERROR: " + e for e in errors))
        sys.exit(1)
    print("site checks passed")


if __name__ == "__main__":
    main()
