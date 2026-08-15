---
title: "Evals are the product, not the model"
date: "2026-06-15"
kind: "engineering"
summary: "Why the evaluation harness — not the base model — decides whether an AI feature ships."
---

Every AI feature I have shipped lived or died on one thing: whether I could
tell, quickly and repeatably, that it was getting *better*. Not the model. The
harness.

The model is a commodity you rent by the token. Swap it and your prompts mostly
survive. What does not survive a swap — and what nobody hands you — is a set of
cases that encodes what "good" means for *your* problem, plus a way to score a
change against them in seconds.

## The cheapest eval that works

You do not need a framework to start. You need:

- **A fixed set of inputs** that covers the boring middle and the scary edges.
- **A grader** — exact match where you can get it, an LLM judge where you can't,
  a human spot-check where it matters.
- **A number** you trust enough to block a merge on.

Once that exists, prompt engineering stops being vibes and starts being a loop.

## What changes when you have one

You stop arguing about whether the new prompt is better and start *reading the
diff of the failures*. You catch the regression where fixing the German
contracts quietly broke the English ones. And when a stakeholder asks "is it
good enough to ship," you have an answer that isn't a shrug.

The uncomfortable part: the eval set is the actual intellectual work. The prompt
is downstream of it.
