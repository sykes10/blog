---
phase: 01-foundation-first-pattern-post
plan: "03"
subsystem: feed-discoverability
tags:
  - rss
  - sitemap
  - robots
  - playwright
  - seo
dependency_graph:
  requires:
    - 01-01 (getAllPatterns() from lib/content.ts, Velite Pattern collection, playwright config)
  provides:
    - RSS 2.0 feed at /rss.xml reading getAllPatterns() with XML escaping
    - Sitemap at /sitemap.xml listing home, /patterns, and all pattern post URLs
    - Robots file at /robots.txt referencing the sitemap
    - Playwright smoke assertions for SITE-02 (feed/sitemap/robots)
  affects:
    - Phase 2 (can rely on feed/sitemap infrastructure being in place)
tech_stack:
  added: []
  patterns:
    - Next.js Route Handler (app/rss.xml/route.ts) for dynamic XML response
    - Next.js sitemap convention file (app/sitemap.ts) for static MetadataRoute.Sitemap
    - Next.js robots convention file (app/robots.ts) for static MetadataRoute.Robots
    - escapeXml() helper for XML injection mitigation (T-01-05)
    - NEXT_PUBLIC_SITE_URL env var as single site-URL source (D-08)
    - Playwright request API for headless HTTP assertions (no browser navigation)
key_files:
  created:
    - app/rss.xml/route.ts
    - app/sitemap.ts
    - app/robots.ts
    - tests/feed.spec.ts
  modified: []
decisions:
  - "Used getAllPatterns() from lib/content.ts in all three files (not #site/content directly) — consistent with the centralized content-access boundary established in Plan 01-01"
  - "RSS feed implemented as a dynamic Route Handler (ƒ) not a static file — allows real-time data from getAllPatterns(); sitemap and robots are static (○) per Next.js convention file semantics"
  - "escapeXml() is a local helper in route.ts rather than a shared utility — the only consumer is the RSS handler; premature extraction would add indirection with no benefit at this stage"
metrics:
  duration_minutes: 5
  completed_date: "2026-06-30T18:10:12Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 4
  files_modified: 0
status: complete
---

# Phase 01 Plan 03: Feed + Crawler Discoverability (RSS, Sitemap, Robots) Summary

**One-liner:** RSS 2.0 feed Route Handler with escapeXml() injection mitigation, Next.js sitemap and robots convention files, and 4 Playwright smoke assertions — all reading getAllPatterns() with URLs from the single NEXT_PUBLIC_SITE_URL source.

## What Was Built

- **RSS feed:** `app/rss.xml/route.ts` — async `GET()` Route Handler returning `Content-Type: application/xml; charset=utf-8`. Builds an RSS 2.0 document from `getAllPatterns()`. Channel `<title>` is "Frontend Blueprints" per D-07. Each `<item>` includes `<title>`, `<link>`, `<description>`, `<pubDate>` (RFC-822 via `toUTCString()`), and `<guid>`. A local `escapeXml()` helper escapes `&`, `<`, `>` in every interpolated title/description field (T-01-05 threat mitigation). All URLs built from `NEXT_PUBLIC_SITE_URL` with `https://example.com` as the fallback default (D-08).
- **Sitemap:** `app/sitemap.ts` — Next.js convention file with a default export returning `MetadataRoute.Sitemap`. Includes home (`/`), patterns listing (`/patterns`), and a `{ url, lastModified }` entry per pattern read from `getAllPatterns()`. All URLs from `NEXT_PUBLIC_SITE_URL`. Generates as a static `/sitemap.xml` route.
- **Robots:** `app/robots.ts` — Next.js convention file with a default export returning `MetadataRoute.Robots`. Allows all user agents, `sitemap` field points at `${SITE_URL}/sitemap.xml`. Generates as a static `/robots.txt` route.
- **Smoke tests:** `tests/feed.spec.ts` — 4 Playwright assertions using the `request` API (no browser navigation, pure HTTP): (1) `/rss.xml` → 200 + `application/xml` content type + contains "Frontend Blueprints"; (2) `/rss.xml` body contains `toast-notification-system`; (3) `/sitemap.xml` → 200 + contains the post URL path; (4) `/robots.txt` → 200 + body references "sitemap". All 7 tests (3 smoke + 4 feed) green against the production build.

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria met, all files created as specified, build and tests green on first pass.

## Architecture Notes

The RSS handler is a dynamic Route Handler (`ƒ`) rather than a statically generated file. This is the correct Next.js pattern for a Route Handler returning a `Response` object — Next.js cannot statically cache this without `export const dynamic = 'force-static'`. Since the content is build-time-deterministic (Velite compiles the collection at build time), this has no practical downside: the response is always the same across requests in a given build. The sitemap and robots files, by contrast, use Next.js's convention file system and are generated as static pages (`○`) during `next build`.

The `NEXT_PUBLIC_SITE_URL` env var approach (with `https://example.com` as the fallback) means swapping to the real domain later requires a single `.env.local` change with no code edits — satisfying D-08's "trivial to swap" requirement.

## Known Stubs

None. All three endpoints return real data from the Velite-compiled content layer. The `https://example.com` placeholder is explicitly the fallback default for a missing env var, not a stub — it is intentional and documented per D-08.

## Threat Flags

None. No new trust boundaries beyond what was documented in the plan's `<threat_model>`. T-01-05 (RSS/XML injection) is fully mitigated by the `escapeXml()` helper applied to every interpolated field.

## Success Criteria Status

- [x] `/rss.xml` serves valid, XML-escaped RSS 2.0 listing the Pattern post, all URLs from single site-URL source (SITE-02) — verified by Playwright test + production build
- [x] `/sitemap.xml` lists home, /patterns, and the post URL (SITE-02) — verified by Playwright test + static route generation
- [x] `/robots.txt` references the sitemap URL (SITE-02) — verified by Playwright test + static route generation
- [x] All URLs derive from `NEXT_PUBLIC_SITE_URL` (D-08) — verified in code
- [x] XML escaping applied to title/description in RSS feed (T-01-05 mitigation) — verified in code
- [x] `npm run build` green — all 9 routes generated (including new /sitemap.xml, /robots.txt static + /rss.xml dynamic)
- [x] `npm test` green — 7/7 tests pass

## Self-Check

**Files exist:**
- FOUND: app/rss.xml/route.ts
- FOUND: app/sitemap.ts
- FOUND: app/robots.ts
- FOUND: tests/feed.spec.ts

**Commits exist:**
- ae8861a: feat(01-03): add RSS 2.0 feed Route Handler with XML escaping
- a1c4f85: feat(01-03): add sitemap and robots convention files
- f7feb51: test(01-03): add feed/sitemap/robots smoke tests for SITE-02

## Self-Check: PASSED
