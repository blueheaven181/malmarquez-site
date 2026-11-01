// Unit tests for the chat Worker. The AI model is mocked, so these run offline
// and never use the Workers AI free allowance.  Run: npm test  (inside worker/)
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

let lastSystemPrompt = "";
const env = {
  AI: {
    run: async (_model, input) => {
      lastSystemPrompt = input.messages[0].content;
      return { response: "Marc enjoys basketball and running." };
    },
  },
};

let ipCounter = 0;
function chat(body, { origin = "https://malmarquez.com", path = "/chat", ip } = {}) {
  return new Request("https://worker.test" + path, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "CF-Connecting-IP": ip || `10.0.0.${++ipCounter}`,
    },
    body: JSON.stringify(body),
  });
}
const ask = (q) => ({ messages: [{ role: "user", content: q }] });

test("answers a normal question from the site", async () => {
  const res = await worker.fetch(chat(ask("What are Marc's hobbies?")), env);
  assert.equal(res.status, 200);
  assert.match((await res.json()).reply, /basketball/);
});

test("works behind a /api/chat route too", async () => {
  const res = await worker.fetch(chat(ask("hi"), { path: "/api/chat" }), env);
  assert.equal(res.status, 200);
});

test("blocks other websites (CORS origin check)", async () => {
  const res = await worker.fetch(chat(ask("hi"), { origin: "https://evil.example" }), env);
  assert.equal(res.status, 403);
});

test("rejects empty and over-long messages", async () => {
  assert.equal((await worker.fetch(chat({ messages: [] }), env)).status, 400);
  assert.equal((await worker.fetch(chat(ask("x".repeat(600))), env)).status, 400);
});

test("answers CORS preflight without calling the model", async () => {
  const req = new Request("https://worker.test/chat", { method: "OPTIONS", headers: { Origin: "https://malmarquez.com" } });
  const res = await worker.fetch(req, env);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), "https://malmarquez.com");
});

test("rate-limits a single visitor", async () => {
  let res;
  for (let i = 0; i < 22; i++) res = await worker.fetch(chat(ask("hi"), { ip: "10.9.9.9" }), env);
  assert.equal(res.status, 429);
});

test("system prompt has the profile, the privacy rules, and no unfinished lines", async () => {
  await worker.fetch(chat(ask("hi")), env);
  assert.ok(lastSystemPrompt.includes("Marc Anthony Marquez"));
  assert.ok(/salary/i.test(lastSystemPrompt), "salary rule missing");
  assert.ok(!lastSystemPrompt.includes("[FILL IN"), "unfinished [FILL IN] line leaked");
});

test("returns a friendly error when the model fails", async () => {
  const broken = { AI: { run: async () => { throw new Error("quota"); } } };
  const res = await worker.fetch(chat(ask("hi")), broken);
  assert.equal(res.status, 503);
  assert.match((await res.json()).error, /marc@malmarquez\.com/);
});
