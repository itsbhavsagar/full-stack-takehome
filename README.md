# Build Profile from Ticker

Take-home for IEC — the flow where you enter a ticker, wait while a profile builds, review each field (source, confidence, accept/edit/reject), then save it.

## Run it locally

You need two terminals.

**Terminal 1 — stub (port 9000)**

```bash
BUILD_SECONDS=8 ./stub/run.sh
```

The script creates `stub/.venv` on first run (and rebuilds it if it's ever broken — e.g. after moving the project folder). `BUILD_SECONDS=8` speeds up local dev; leave it out if you want the full ~40s build.

<details>
<summary>Manual setup, if you prefer</summary>

```bash
cd stub
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
BUILD_SECONDS=8 uvicorn profile_builder_stub:app --reload --port 9000
```

</details>

**Terminal 2 — app**

```bash
npm install
npm run db:push
npm run dev
```

Create a `.env` in the repo root if you don't have one:

```
DATABASE_URL="file:./dev.db"
STUB_BUILDER_URL="http://localhost:9000"
```

Open http://localhost:3000

## What I built

The assignment's vertical slice, end to end:

1. Enter a ticker → starts a build against the stub
2. Build runs in the background with polling, progress bar, and stage labels
3. When done, review fields one by one — source, confidence, accept / edit / reject, plus bulk accept for high-confidence fields
4. Save when every field has a decision → saved profile page
5. Refresh the saved profile page — data comes back from SQLite

Field types from the stub are all handled: normal, news-sourced (`source_date`), low confidence, missing (`value: null`), and conflicts (`candidates[]`).

## Stack

I used **Next.js (App Router)** for the UI and API route handlers, **TanStack Query** for server state, **Zustand** for review UI state (filters, which field is being edited), **Prisma + SQLite** for persistence, and **Zod** for request validation.

I didn't use FastAPI or DynamoDB here — SQLite is enough for a take-home and keeps setup to one `npm run db:push`. The route handlers sit where a FastAPI service would in production, and the README below covers how I'd swap SQLite for DynamoDB later.

UI is mostly **shadcn/ui** + Tailwind.

## Architecture

```
Browser
  └── Next.js App Router
        ├── pages: /, /build/[id], /profiles/[id]
        ├── API routes: /api/builds, /api/builds/[id]/draft, save, retry, etc.
        ├── TanStack Query  — build session, draft review, saved profile
        ├── Zustand         — review filters + inline edit state
        ├── Prisma/SQLite   — BuildSession, DraftReview, SavedProfile
        └── stub-client     — talks to profile_builder_stub on :9000
```

Code is split by feature: `features/build`, `features/review`, `features/profile`. Shared types live in `src/types`, API client wrappers in `src/lib/api`, server-only logic in `src/lib/server`.

## Async approach

The stub is poll-based (`GET /build/{job_id}`), so I polled every 2 seconds while `status === "running"`.

On the build page you get a progress bar, percentage, estimated time remaining, and a stage checklist (SEC filings → 10-K → etc.). The current stage shows a spinner; completed stages get a checkmark.

I didn't add cancel or streaming — the stub doesn't support either. In production I'd put a real job queue behind this and probably use SSE or WebSockets for live progress and partial field delivery.

## Hard cases

**Low confidence (< 0.6)** — flagged in the UI, excluded from bulk accept. User has to explicitly accept or edit.

**Conflicts** — radio list of candidates. Can't accept until one is picked.

**Missing values** — shown with the stub's note. User can type a value or reject.

**FAILCO** — build fails around 50%. Error panel with retry. Toast on failure.

**Empty ticker** — validated on client and server (trimmed, must be non-empty).

**Don't lose review work** — every accept/edit/reject writes to `DraftReview` in SQLite. Refresh mid-review and your decisions are still there.

**Stub down / network error** — friendly error on start build instead of a raw fetch message.

## Known limitations

The stub only returns `profile` when the build hits 100%. So there's no way to review fields _during_ a build, and FAILCO can't demo "user accepted 5 fields, then build failed, those 5 are still there" — there are no fields to accept before failure. I documented this honestly because the UI logic for draft persistence is there; the stub just doesn't expose partial profiles.

I also skipped automated tests. I manually ran through the happy path, FAILCO, conflicts, low-confidence fields, bulk accept, save, and reload.

No auth, no multi-tenancy, no cancel button during build.

## If I had more time

- Incremental field streaming during build (needs stub or backend support)
- Real job queue + SSE instead of polling
- DynamoDB for profiles, S3 for raw filings
- Auth and workspace scoping
- Automated tests around review rules (`canBulkAccept`, save gating, conflict resolution)
- Optimistic UI on field actions (right now the cache updates on success)

## Test tickers

| Ticker               | What to try                         |
| -------------------- | ----------------------------------- |
| `ACME` (or anything) | Full flow — all field types show up |
| `FAILCO`             | Fails mid-build, hit retry          |
| empty string         | Validation error                    |

## Where I stopped

Feature-complete for the assignment scope. Polish pass on folder structure (removed a few single-file micro-folders), error handling on draft load and save failures, and README. Didn't go further into infra, tests, or partial-build UX because the stub doesn't support it.
