/*
 * Marc's AI assistant: chat widget for malmarquez.com
 *
 * Add ONE line before </body> on your site:
 *   (see README.md: one script tag with src="/marc-assistant.js" and data-api="https://YOUR-WORKER-URL/chat")
 *
 * Optional attributes:
 *   data-delay="4000"   ms before it pops in (default 4000)
 *   data-demo="true"    fake answers, no Worker needed (for trying the look)
 */
(() => {
  "use strict";
  if (window.__marcAssistant) return;
  window.__marcAssistant = true;

  const script = document.currentScript;
  const API = script?.dataset.api || "";
  const DEMO = script?.dataset.demo === "true" || !API;
  const DELAY = Number(script?.dataset.delay || 4000);
  const SEEN_KEY = "marcAssistantSeen";
  const POS_KEY = "marcAssistantPos";
  const MAX_CHARS = 500;

  const GREETING = "Hi! 👋 I'm Marc's AI assistant. Ask me anything about him: his work, projects, hobbies or goals.";
  const SUGGESTIONS = ["Tell me about Marc", "What are his hobbies?", "What's his goal in life?", "Is he open to work?"];

  // Safe storage (can throw in private mode)
  const store = {
    get(s, k) { try { return window[s].getItem(k); } catch { return null; } },
    set(s, k, v) { try { window[s].setItem(k, v); } catch {} },
  };

  // ---------------------------------------------------------------- styles
  const css = `
  .ma-root{--ma-bg:#0f1115;--ma-panel:#171a21;--ma-line:#2a2f3a;--ma-text:#e9ecf2;--ma-muted:#9aa3b2;
    --ma-accent:#d4a84b;--ma-accent-ink:#17130a;--ma-user:#2a3242;--ma-shadow:0 24px 60px rgba(0,0,0,.45);
    font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ma-text)}
  @media (prefers-color-scheme: light){.ma-root{--ma-bg:#ffffff;--ma-panel:#f6f7f9;--ma-line:#e2e5ea;--ma-text:#161a22;
    --ma-muted:#5d6676;--ma-accent:#b8872a;--ma-accent-ink:#ffffff;--ma-user:#e9edf4;--ma-shadow:0 24px 60px rgba(20,25,35,.18)}}
  .ma-root *{box-sizing:border-box}
  :where(.ma-root) :where(div,form,b,small){margin:0;max-width:none;letter-spacing:normal;text-transform:none}
  .ma-root .ma-win{padding:0;margin:0}
  .ma-win{position:fixed;z-index:2147483000;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100vh - 32px));
    display:flex;flex-direction:column;background:var(--ma-bg);border:1px solid var(--ma-line);border-radius:16px;
    box-shadow:var(--ma-shadow);overflow:hidden;opacity:0;transform:scale(.9);pointer-events:none;
    transition:opacity .25s ease,transform .25s cubic-bezier(.2,.9,.3,1.3)}
  .ma-win.ma-open{opacity:1;transform:scale(1);pointer-events:auto}
  .ma-win.ma-flash{animation:ma-flash 1.2s ease-out 1}
  @keyframes ma-flash{0%{box-shadow:0 0 0 0 rgba(212,168,75,.7),var(--ma-shadow)}100%{box-shadow:0 0 0 22px rgba(212,168,75,0),var(--ma-shadow)}}
  .ma-head{display:flex;align-items:center;gap:10px;padding:12px 12px 12px 14px;background:var(--ma-panel);
    border-bottom:1px solid var(--ma-line);cursor:grab;user-select:none;touch-action:none}
  .ma-head:active{cursor:grabbing}
  .ma-avatar{width:34px;height:34px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;
    font-size:13px;letter-spacing:.5px;background:var(--ma-accent);color:var(--ma-accent-ink)}
  .ma-title{flex:1;min-width:0}
  .ma-title b{display:block;font-size:14px}
  .ma-title small{display:block;color:var(--ma-muted);font-size:12px}
  .ma-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#3ccf7a;margin-right:5px;vertical-align:1px}
  .ma-btn{width:30px;height:30px;border:0;border-radius:8px;background:transparent;color:var(--ma-muted);
    font-size:18px;line-height:1;cursor:pointer;display:grid;place-items:center}
  .ma-btn:hover,.ma-btn:focus-visible{background:var(--ma-line);color:var(--ma-text);outline:none}
  .ma-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}
  .ma-msg{flex:none;max-width:85%;padding:9px 12px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}
  .ma-bot{align-self:flex-start;background:var(--ma-panel);border:1px solid var(--ma-line);border-bottom-left-radius:4px}
  .ma-user{align-self:flex-end;background:var(--ma-user);border-bottom-right-radius:4px}
  .ma-err{border-color:#a8473f}
  .ma-link{color:var(--ma-accent);text-decoration:underline;text-underline-offset:2px;word-break:break-all}
  .ma-link:hover{text-decoration-thickness:2px}
  .ma-typing span{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:var(--ma-muted);
    animation:ma-bounce 1s infinite}
  .ma-typing span:nth-child(2){animation-delay:.15s}.ma-typing span:nth-child(3){animation-delay:.3s}
  @keyframes ma-bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}
  .ma-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
  .ma-chip{border:1px solid var(--ma-line);background:transparent;color:var(--ma-text);border-radius:999px;
    padding:5px 11px;font:inherit;font-size:13px;cursor:pointer}
  .ma-chip:hover,.ma-chip:focus-visible{border-color:var(--ma-accent);color:var(--ma-accent);outline:none}
  .ma-form{display:flex;gap:8px;padding:10px;border-top:1px solid var(--ma-line);background:var(--ma-panel)}
  .ma-input{flex:1;min-width:0;border:1px solid var(--ma-line);border-radius:10px;padding:9px 11px;
    background:var(--ma-bg);color:var(--ma-text);font:inherit;font-size:16px}
  .ma-input:focus{outline:2px solid var(--ma-accent);outline-offset:-1px}
  .ma-send{border:0;border-radius:10px;padding:0 14px;background:var(--ma-accent);color:var(--ma-accent-ink);
    font:inherit;font-weight:600;cursor:pointer}
  .ma-send:disabled{opacity:.5;cursor:default}
  .ma-note{padding:0 12px 8px;background:var(--ma-panel);color:var(--ma-muted);font-size:11px;text-align:center}
  .ma-bubble{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:8px;
    border:0;border-radius:999px;padding:10px 16px 10px 10px;background:var(--ma-accent);color:var(--ma-accent-ink);
    font:inherit;font-weight:600;cursor:pointer;box-shadow:var(--ma-shadow);transform:translateY(120px);
    transition:transform .3s cubic-bezier(.2,.9,.3,1.2)}
  .ma-bubble.ma-show{transform:translateY(0)}
  .ma-bubble .ma-avatar{width:30px;height:30px;background:var(--ma-accent-ink);color:var(--ma-accent)}
  @media (max-width:600px){
    .ma-win{left:0!important;right:0;top:auto!important;bottom:0;width:100vw;height:min(78vh,600px);
      border-radius:16px 16px 0 0;transform:translateY(100%)}
    .ma-win.ma-open{transform:translateY(0)}
    .ma-head{cursor:default}
    .ma-bubble{right:14px;bottom:14px}
  }
  @media (prefers-reduced-motion: reduce){.ma-win,.ma-bubble{transition:none}.ma-win.ma-flash{animation:none}}
  `;

  // ---------------------------------------------------------------- DOM
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const root = el("div", "ma-root");
  const style = el("style");
  style.textContent = css;

  const win = el("div", "ma-win");
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", "Chat with Marc's AI assistant");

  const head = el("div", "ma-head");
  const avatar = el("div", "ma-avatar", "MM");
  const title = el("div", "ma-title");
  title.append(el("b", null, "Marc's AI assistant"));
  const sub = el("small");
  sub.append(el("span", "ma-dot"), document.createTextNode(DEMO ? "Demo mode" : "AI · answers about Marc"));
  title.append(sub);
  const minBtn = el("button", "ma-btn", "–");
  minBtn.type = "button";
  minBtn.setAttribute("aria-label", "Minimise chat");
  const closeBtn = el("button", "ma-btn", "×");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close chat");
  head.append(avatar, title, minBtn, closeBtn);

  const log = el("div", "ma-log");
  log.setAttribute("aria-live", "polite");
  const chips = el("div", "ma-chips");
  const form = el("form", "ma-form");
  const input = el("input", "ma-input");
  input.type = "text";
  input.maxLength = MAX_CHARS;
  input.placeholder = "Ask about Marc…";
  input.setAttribute("aria-label", "Your question");
  const send = el("button", "ma-send", "Send");
  send.type = "submit";
  form.append(input, send);
  const note = el("div", "ma-note", "AI assistant · may make mistakes · for anything important, email Marc");

  win.append(head, log, chips, form, note);

  const bubble = el("button", "ma-bubble");
  bubble.type = "button";
  bubble.setAttribute("aria-label", "Open chat with Marc's AI assistant");
  bubble.append(el("span", "ma-avatar", "MM"), document.createTextNode("Ask about Marc"));

  root.append(style, win, bubble);

  // ---------------------------------------------------------------- chat
  const history = []; // {role, content}
  let busy = false;

  // Turn https:// links and email addresses in bot replies into safe, clickable links
  const LINK_RE = /(https:\/\/[^\s<>"')\]]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  function fillWithLinks(node, text) {
    let last = 0;
    text.replace(LINK_RE, (match, _g, idx) => {
      let url = match.replace(/[.,;:!?]+$/, "");
      node.append(document.createTextNode(text.slice(last, idx)));
      const a = el("a", "ma-link", url);
      a.href = url.startsWith("https://") ? url : "mailto:" + url;
      if (url.startsWith("https://")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      node.append(a);
      last = idx + url.length;
      return match;
    });
    node.append(document.createTextNode(text.slice(last)));
  }

  function addMsg(role, text, extra) {
    const m = el("div", "ma-msg " + (role === "user" ? "ma-user" : "ma-bot") + (extra ? " " + extra : ""));
    if (role === "user") m.textContent = text;
    else fillWithLinks(m, text || "");
    log.append(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  function renderChips() {
    chips.replaceChildren();
    if (history.length) return;
    SUGGESTIONS.forEach((q) => {
      const c = el("button", "ma-chip", q);
      c.type = "button";
      c.addEventListener("click", () => ask(q));
      chips.append(c);
    });
  }

  async function ask(text) {
    text = text.trim().slice(0, MAX_CHARS);
    if (!text || busy) return;
    busy = true;
    send.disabled = true;
    input.value = "";
    addMsg("user", text);
    history.push({ role: "user", content: text });
    renderChips();

    const typing = addMsg("bot", "", "ma-typing");
    typing.append(el("span"), el("span"), el("span"));

    let reply, isErr = false;
    try {
      reply = DEMO ? await demoReply(text) : await callApi();
    } catch (e) {
      reply = (e && e.message) || "Sorry, something went wrong. Please try again, or email marc@malmarquez.com.";
      isErr = true;
    }
    typing.remove();
    addMsg("bot", reply, isErr ? "ma-err" : "");
    if (!isErr) history.push({ role: "assistant", content: reply });
    else history.pop(); // let them retry the same question
    busy = false;
    send.disabled = false;
    input.focus();
  }

  async function callApi() {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) }),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || "Sorry, I couldn't answer that right now.");
      return data.reply;
    } catch (e) {
      if (e.name === "AbortError") throw new Error("That took too long. Please try again.");
      throw e;
    } finally {
      clearTimeout(t);
    }
  }

  function demoReply(q) {
    const s = q.toLowerCase();
    const r = /hobb|free time|fun/.test(s) ? "(Demo) Once Marc fills in his profile, I'll share his hobbies here."
      : /goal|life|future/.test(s) ? "(Demo) Marc is moving toward SRE, DevOps and AI automation work. His bigger life goals will appear here once he adds them."
      : /open|hire|work|job/.test(s) ? "(Demo) Yes! Marc is open to cloud, DevOps and AI automation roles in the UAE and remote, and is available immediately. Email: marc@malmarquez.com"
      : "(Demo) Marc is an IT infrastructure and operations engineer in Abu Dhabi with 18 years of experience, now focused on SRE/DevOps. Ask me about his projects, hobbies or goals!";
    return new Promise((res) => setTimeout(() => res(r), 700));
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });

  // ---------------------------------------------------------------- open / close
  const isMobile = () => window.matchMedia("(max-width:600px)").matches;

  function centre() {
    const w = win.offsetWidth, h = win.offsetHeight;
    place((window.innerWidth - w) / 2, (window.innerHeight - h) / 2);
  }

  function place(x, y) {
    const maxX = window.innerWidth - win.offsetWidth - 8;
    const maxY = window.innerHeight - win.offsetHeight - 8;
    win.style.left = Math.max(8, Math.min(x, maxX)) + "px";
    win.style.top = Math.max(8, Math.min(y, maxY)) + "px";
  }

  function open({ flash = false, fresh = false } = {}) {
    if (!isMobile()) {
      const saved = !fresh && JSON.parse(store.get("sessionStorage", POS_KEY) || "null");
      saved ? place(saved.x, saved.y) : centre();
    }
    bubble.classList.remove("ma-show");
    win.classList.add("ma-open");
    if (flash) {
      win.classList.remove("ma-flash");
      void win.offsetWidth;
      win.classList.add("ma-flash");
    }
    if (!log.childElementCount) { addMsg("bot", GREETING); renderChips(); }
    if (!isMobile()) setTimeout(() => input.focus({ preventScroll: true }), 260);
  }

  function minimise() {
    win.classList.remove("ma-open");
    bubble.classList.add("ma-show");
    store.set("localStorage", SEEN_KEY, "1");
  }

  minBtn.addEventListener("click", minimise);
  closeBtn.addEventListener("click", minimise);
  bubble.addEventListener("click", () => open());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && win.classList.contains("ma-open")) minimise();
  });

  // ---------------------------------------------------------------- drag
  let drag = null;
  head.addEventListener("pointerdown", (e) => {
    if (isMobile() || e.target.closest(".ma-btn")) return;
    const r = win.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    win.style.transition = "none";
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener("pointermove", (e) => {
    if (drag) place(e.clientX - drag.dx, e.clientY - drag.dy);
  });
  const endDrag = () => {
    if (!drag) return;
    drag = null;
    win.style.transition = "";
    store.set("sessionStorage", POS_KEY, JSON.stringify({ x: parseFloat(win.style.left), y: parseFloat(win.style.top) }));
  };
  head.addEventListener("pointerup", endDrag);
  head.addEventListener("pointercancel", endDrag);
  window.addEventListener("resize", () => {
    if (win.classList.contains("ma-open") && !isMobile()) place(parseFloat(win.style.left) || 0, parseFloat(win.style.top) || 0);
  });

  // ---------------------------------------------------------------- start
  function start() {
    document.body.append(root);
    const seen = store.get("localStorage", SEEN_KEY);
    setTimeout(() => {
      // First visit on desktop: pop in at the centre. Otherwise: just the bubble.
      if (!seen && !isMobile()) open({ flash: true, fresh: true });
      else bubble.classList.add("ma-show");
    }, seen ? 800 : DELAY);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
