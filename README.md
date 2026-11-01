# malmarquez.com

[![Deploy site](https://github.com/blueheaven181/malmarquez-site/actions/workflows/deploy-site.yml/badge.svg)](https://github.com/blueheaven181/malmarquez-site/actions/workflows/deploy-site.yml)
[![Deploy assistant](https://github.com/blueheaven181/malmarquez-site/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/blueheaven181/malmarquez-site/actions/workflows/deploy-worker.yml)

Source for my portfolio site, [malmarquez.com](https://malmarquez.com), and the AI assistant that answers visitors' questions about me. Every change ships through a GitHub Actions pipeline to Cloudflare.

## What's here

```
site/                      static portfolio (Cloudflare Pages)
  marc-assistant.js        chat widget: pop-in, draggable, minimises to a bubble
worker/                    AI assistant API (Cloudflare Workers + Workers AI)
  src/index.js             request handling, guardrails, rate limiting
  src/profile.js           the only facts the assistant knows about me
  test/                    unit tests with the AI model mocked
scripts/check_site.py      pre-deploy checks for the site
.github/workflows/         CI and the two deploy pipelines
```

## Pipeline

```
push / pull request ──► CI
                          ├─ site:   JS syntax, broken local links, widget wiring
                          └─ worker: unit tests (mocked model), bundle dry run

push to main
  ├─ site/** changed   ──► CI ──► wrangler pages deploy ──► smoke test malmarquez.com
  └─ worker/** changed ──► CI ──► wrangler deploy       ──► smoke test (CORS preflight)
```

- Deploys only run after CI passes, and only for the part that changed.
- `concurrency` stops two deploys of the same target running at once.
- The Worker smoke test uses a CORS preflight, so it proves the service is up without spending AI quota.
- Rollback: Cloudflare keeps every deployment. Revert the commit and push, or roll back in the Cloudflare dashboard.

## The assistant's guardrails
- Answers only from `profile.js`; anything else gets "Marc hasn't shared that" plus my email.
- Won't discuss salary, visa, references or contract terms.
- Only accepts requests from malmarquez.com (origin check), caps message length, and rate-limits each visitor.
- No API keys in the browser: the widget calls the Worker, which uses a Workers AI binding.

## Working on it

```bash
cd worker && npm test            # run the assistant's tests
python3 scripts/check_site.py    # run the site checks
```

Edit, commit, push to `main`. GitHub does the rest.

## Repository secrets
| Secret | What it is |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token limited to Pages and Workers edit |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
