# Take-Home — "Build Profile from Ticker" Feature (Full-Stack)

## Context

We're building a fundraising operating system for **publicly-traded companies**. A capability we
need: a user types a **ticker**, and we assemble a comprehensive public-company profile for them
from SEC filings + news. *Assembling* that profile is a different role's problem — **your job is
the product layer around it:** the service plumbing and the **human-in-the-loop review
experience** that turns a generated profile into the user's saved company profile.

This is intentionally more than CRUD. The interesting parts are the **slow build** and the
**varying trust** of the data — handle those well and you've shown us what we need to see.

## The goal

Build the vertical feature end-to-end:

1. A user enters a **ticker** and starts a profile build.
2. The build is **slow (~30–90s)** — handle it gracefully (progress / streaming / polling — your call, but it must not feel broken, and the user shouldn't be staring at a frozen screen).
3. When ready, show the generated profile **field-by-field with its source and confidence**, and
   let the user **edit / accept / reject** each field (plus a sensible bulk action).
4. **Save** the accepted profile and show the saved result. It must survive a reload.

## What we provide

We give you a small **stub profile-builder** service (in `stub/` — run it with two commands; see
`stub/README.md`). Build against it directly. Shape:

- `POST /build { "ticker": "XYZ" }` → `{ "job_id": "..." }`
- `GET /build/{job_id}` → `{ "status": "running|done|failed", "progress": 0–100, "profile": [ ... ] }`

…where each profile field looks like:

```json
{
  "field": "revenue_ttm",
  "label": "Revenue (TTM)",
  "value": "$48.2M",
  "source": "10-Q filed 2026-05-10",
  "source_url": "https://www.sec.gov/...",
  "confidence": 0.95
}
```

The stub returns realistic data **after a ~40s delay**, and a field can be: **normal** (above),
**news-sourced** (has a `source_date`, lower trust than a filing), **low-confidence**
(`confidence` below ~0.6), **missing** (`value: null` + a `note`), or a **conflict**
(`conflict: true` with a `candidates[]` array — two values from two sources). **Your UI must
handle all of these** — the exact shapes and the special test tickers (e.g. `FAILCO` fails
partway) are in `stub/README.md`. **You do not need to build the real data pulling.**

## Stack

We run **Next.js (App Router) + FastAPI + DynamoDB / S3.** Use our stack if you're comfortable, or
your strongest equivalent — just tell us what you chose and why.

## What we actually care about (more than CRUD)

- **Long-running-job UX** — the build takes ~a minute. Your approach (polling vs. streaming),
  progress, cancel, and partial results should show good judgment, not a spinner-of-death.
- **A trust-aware review UI** — per-field **provenance (source + confidence) is visible**; clear
  **edit / accept / reject** + bulk action; **low-confidence and conflicting fields are surfaced
  for review, not silently accepted.**
- **State & resilience** — optimistic updates, error recovery, sensible empty/loading states,
  re-run.
- **A clean, typed API contract** between front-end and back-end.
- **Persistence** — the accepted profile saves and reloads correctly.

## Hard cases we'll specifically look for

- A field comes back **low confidence** → the UI flags it for review rather than auto-accepting.
- Two sources **conflict** for one field → the user can choose.
- The build **fails partway** → the user's already-accepted fields aren't lost; retry is possible.
- A **bad / unknown ticker** → graceful error, no crash.

## What to submit

- **Code** (repo / zip) + a **README**: your architecture, the async approach you chose and why,
  how you handled the hard cases above, what you'd do with more time, and where you stopped.
- A short **screen recording or screenshots** of the flow (including a hard case or two).

## How we evaluate (in priority order)

1. **The unhappy paths** — slow build, failures, low-confidence / conflicting fields, retries.
   This is the real test.
2. **UX quality & taste** — does the review flow feel good and *trustworthy*?
3. **API / contract design** — clean, typed, sensible boundaries between FE and BE.
4. **State management** — optimistic + resilient; no lost work.
5. **Code quality** — readable, well-structured, tested where it matters.
6. **Communication** — the README shows judgment.

## What we're *not* asking for

- The actual SEC / news data pulling (that's the AI role — use our stub).
- Auth, multi-tenancy, or scaling — note your approach in the README instead.
- Pixel-perfect visual design — clean and clear is enough.
