/**
 * Table of contents tests for Pattern posts (SITE-04, Phase 2 Plan 03).
 *
 * Covers:
 *   1. A nav[aria-label="Table of contents"] is visible with a link per section
 *      heading on a long Pattern post.
 *   2. Clicking a TOC link updates the URL hash to the matching heading id.
 *
 * Per RESEARCH.md, the active-heading scroll-spy highlight (IntersectionObserver-
 * driven) is manual-only — headless timing for IntersectionObserver is flaky, so
 * this spec does not assert aria-current state changes on scroll.
 */
import { test, expect } from "@playwright/test";

const PATTERN_SLUG = "toast-notification-system";

test.describe("Table of contents", () => {
  test("renders a nav with a link per section heading", async ({ page }) => {
    await page.goto(`/patterns/${PATTERN_SLUG}`);

    const toc = page.getByRole("navigation", { name: "Table of contents" });
    await expect(toc).toBeVisible();

    // The Toast post has 8 top-level "##" sections — expect more than one link.
    const links = toc.getByRole("link");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(1);

    // Assert a real section heading from the Toast post appears as TOC link text.
    await expect(toc.getByRole("link", { name: "When to Use (and When Not To)" })).toBeVisible();
  });

  test("clicking a TOC link updates the URL hash to the matching heading id", async ({
    page,
  }) => {
    await page.goto(`/patterns/${PATTERN_SLUG}`);

    const toc = page.getByRole("navigation", { name: "Table of contents" });
    const link = toc.getByRole("link", { name: "Common Mistakes" });
    await expect(link).toBeVisible();

    // github-slugger produces "common-mistakes" for this heading text (lowercase,
    // hyphenated, no punctuation) — the same algorithm rehype-slug uses to id the
    // rendered <h2>.
    await link.click();
    await expect(page).toHaveURL(/#common-mistakes$/);

    // The anchor must resolve to a real element in the document (no silent
    // 404-scroll per RESEARCH.md Pitfall 2).
    const heading = page.locator("#common-mistakes");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Common Mistakes");
  });
});
