---
phase: quick-260702-os6
plan: 01
subsystem: infra
tags: [nextjs, redirects, dns, seo]

# Dependency graph
requires: []
provides:
  - "Host-based www-to-apex 308 redirect defined in next.config.ts (redirects() function)"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Domain canonicalization handled in-app via next.config.ts redirects(), not via hosting-provider dashboard config"

key-files:
  created: []
  modified:
    - next.config.ts

key-decisions:
  - "Implemented the www->apex redirect as an in-code Next.js redirects() rule rather than relying on the Vercel dashboard domain-redirect toggle, per the plan's stated purpose (toggle was not discoverable in the user's account UI)."

patterns-established:
  - "Host-based has matcher pattern: use has: [{ type: 'host', value: '<subdomain>' }] on a catch-all source (/:path*) to scope a redirect to one hostname and avoid self-redirect loops on the apex/canonical host."

requirements-completed: [QUICK-OS6]

coverage:
  - id: D1
    description: "www.frontendspec.dev requests are 308-redirected to https://frontendspec.dev preserving path and query string"
    requirement: QUICK-OS6
    verification:
      - kind: manual_procedural
        ref: "curl -sI -H 'Host: www.frontendspec.dev' http://localhost:3457/patterns/toast-notification-system?ref=x  ->  HTTP/1.1 308 Permanent Redirect, location: https://frontendspec.dev/patterns/toast-notification-system?ref=x"
        status: pass
    human_judgment: false
  - id: D2
    description: "Apex host (frontendspec.dev) requests are not redirected (no self-redirect loop)"
    requirement: QUICK-OS6
    verification:
      - kind: manual_procedural
        ref: "curl -sI -H 'Host: frontendspec.dev' http://localhost:3457/patterns/toast-notification-system  ->  HTTP/1.1 200 OK (no location header)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Existing Velite build IIFE and reactCompiler/turbopack config remain unchanged and functional"
    verification:
      - kind: other
        ref: "npm run build against a locally-linked node_modules copy: VELITE build finished, TypeScript check passed, all 14 static pages generated successfully"
        status: pass
    human_judgment: false

# Metrics
duration: 25min
completed: 2026-07-02
status: complete
---

# Quick Task 260702-os6: Host-based www-to-apex redirect Summary

**Added an async `redirects()` function to `next.config.ts` that 308-redirects `www.frontendspec.dev` to `frontendspec.dev` via a host `has` matcher, preserving path and query string, verified end-to-end with a local production build and curl.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-07-02T16:52:00Z
- **Completed:** 2026-07-02T17:17:00Z
- **Tasks:** 1 auto task + 1 checkpoint (self-verified, see below)
- **Files modified:** 1

## Accomplishments
- `next.config.ts` now exports an async `redirects()` returning a single rule: source `/:path*`, `has: [{ type: "host", value: "www.frontendspec.dev" }]`, destination `https://frontendspec.dev/:path*`, `permanent: true`.
- Verified via a real production build (`next build`) and local server (`next start -p 3457`) that:
  - `Host: www.frontendspec.dev` requests return `308 Permanent Redirect` with `location: https://frontendspec.dev/...` preserving both path and query string.
  - `Host: frontendspec.dev` (apex) requests are unaffected — normal `200 OK`, no redirect loop.
- Confirmed the pre-existing Velite build IIFE, `reactCompiler: true`, and `turbopack.root` config are untouched — the production build completed the Velite step, TypeScript check, and static generation for all 14 routes without error.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add host-based www-to-apex redirect to nextConfig** - `94cfaf9` (feat)

_The plan's second task was `type="checkpoint:human-verify"`. No human was available mid-execution in this run; per the orchestrator's constraint, verification was performed directly (see "Checkpoint Verification" below) rather than blocking._

## Files Created/Modified
- `next.config.ts` - Added `async redirects()` to the exported `nextConfig`, returning the www->apex host-matched 308 redirect. Velite IIFE, `reactCompiler`, and `turbopack.root` keys left unchanged.

## Decisions Made
- Followed the plan exactly: single redirect rule using a `host` `has` matcher rather than middleware or a hosting-provider-level redirect, so canonicalization ships version-controlled with the app.

## Deviations from Plan

None - plan executed exactly as written. The `type()` check and manual verification were both completed without needing to alter the planned redirect rule shape.

## Checkpoint Verification (performed by executor, no human available)

The plan's checkpoint task asked for local build + curl verification. Steps performed:

1. `npx tsc --noEmit -p .` — 0 errors attributable to `next.config.ts` (pre-existing unrelated `#site/content` / implicit-`any` errors in other files are out of scope for this task and were left untouched, per scope boundary rules).
2. This worktree had no `node_modules` (worktrees don't carry installed dependencies). To run a real build/server for verification without touching git-tracked state, a temporary local `node_modules` was populated from the main repo's `node_modules` (gitignored, untracked, independent copy — confirmed via a marker-file write/read test that the two directories are NOT the same underlying storage) and removed again immediately after verification completed. No package installs were performed; this was purely local dependency resolution for a test build.
3. `npm run build` — succeeded: Velite build finished, Next.js/Turbopack compiled successfully, TypeScript check passed, all 14 static routes generated.
4. `npx next start -p 3457` — started local production server.
5. `curl -sI -H "Host: www.frontendspec.dev" "http://localhost:3457/patterns/toast-notification-system?ref=x"` → `HTTP/1.1 308 Permanent Redirect`, `location: https://frontendspec.dev/patterns/toast-notification-system?ref=x` — path and query both preserved, matching the plan's `must_haves.truths`.
6. `curl -sI -H "Host: frontendspec.dev" "http://localhost:3457/patterns/toast-notification-system"` → `HTTP/1.1 200 OK`, no `location` header — apex host is not redirected, confirming no loop.
7. Cleanup: killed the local server process, removed the temporary `node_modules` and `.next` build directory (both gitignored/untracked), confirmed `git status --short` shows no unexpected changes and the main repo's `node_modules` was unaffected.

All three `must_haves.truths` from the plan frontmatter are confirmed:
- www requests 308-redirect to apex, preserving path/query — CONFIRMED.
- Apex-host requests are not redirected (no loop) — CONFIRMED.
- Velite IIFE and reactCompiler/turbopack config remain unchanged and functional — CONFIRMED (build succeeded).

## Issues Encountered
- The default port 3000 was already in use by another process in this environment; the local verification server was started on port 3457 instead. This does not affect the validity of the host-header-based redirect test, since Next.js redirect matching operates on the `Host` header value, not the listening port.
- This worktree lacked `node_modules`, which is normal (dependencies aren't installed per-worktree). Verification required a temporary, non-committed local dependency copy as described above; no `package.json` or lockfile changes were made or needed.

## User Setup Required

None - no external service configuration required. This redirect now ships in-code; the user does not need to configure anything in the Vercel dashboard for this behavior going forward. (If a dashboard-level www->apex redirect toggle was previously enabled, it can be safely left as-is or disabled — this in-code rule handles it regardless of dashboard state, and Next.js resolves the redirect before it would ever reach a dashboard-level rule when self-hosted; if using Vercel's own redirect feature simultaneously, the two won't conflict since they'd produce the same destination.)

## Next Phase Readiness
- No blockers. This was a standalone infra fix independent of the active Phase 02 work (live-demos-patterns-track).

---
*Phase: quick-260702-os6*
*Completed: 2026-07-02*

## Self-Check: PASSED

- FOUND: next.config.ts (contains `async redirects()` at line 25)
- FOUND: commit 94cfaf9 in git log
