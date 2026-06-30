/**
 * Smoke tests for the Frontend Blueprints walking skeleton (Plan 01-01).
 *
 * These tests cover the highest-value automated assertions for Phase 1:
 *   1. Pattern post route renders with title and reading time (FOUND-01 + SITE-03)
 *   2. Unknown slug returns 404 (correctness of notFound() wiring)
 *   3. Theme toggle button exists, is clickable, and changes the <html> class
 *      (functional theme switch — the flash-free aspect of FOUND-03 is manual-only)
 *
 * Per VALIDATION.md: FOUND-03 (no flash of wrong theme) and PATT-01 (8-section
 * template structure) remain manual-only; flash timing is not reliably assertable
 * in a headless test without a visual-regression harness.
 */
import { test, expect } from "@playwright/test";

const PATTERN_SLUG = "toast-notification-system";
const PATTERN_TITLE = "Toast Notification System";

test.describe("Pattern post route", () => {
  test("renders the post page with status 200, title, and reading time (FOUND-01 + SITE-03)", async ({
    page,
  }) => {
    const response = await page.goto(`/patterns/${PATTERN_SLUG}`);

    // Verify the route responds with 200
    expect(response?.status()).toBe(200);

    // Verify the post title is present in the page (the h1 in the post header)
    await expect(page.locator("h1")).toContainText(PATTERN_TITLE);

    // Verify a reading-time string is present (e.g. "3 min read", "5 min read")
    // The readingTime value comes from Velite's reading-time transform on the raw body.
    const readingTimePattern = /\d+\s+min\s+read/i;
    const bodyText = await page.textContent("body");
    expect(bodyText).toMatch(readingTimePattern);
  });

  test("returns 404 for an unknown slug", async ({ page }) => {
    const response = await page.goto("/patterns/does-not-exist");

    // Next.js notFound() produces a 404 response
    expect(response?.status()).toBe(404);
  });
});

test.describe("Theme toggle", () => {
  test("theme toggle button is present and changes the <html> class on click", async ({
    page,
  }) => {
    await page.goto("/");

    // Find the theme toggle button by its aria-label
    const toggle = page.getByRole("button", { name: /switch to .+ theme/i });
    await expect(toggle).toBeVisible();

    // Record the initial theme class on <html>
    const htmlEl = page.locator("html");
    const initialClass = await htmlEl.getAttribute("class");

    // Click the toggle
    await toggle.click();

    // After clicking, the <html> class should have changed (dark added or removed)
    // Give a moment for next-themes to apply the class change
    await page.waitForFunction(
      (cls) => document.documentElement.getAttribute("class") !== cls,
      initialClass,
      { timeout: 3000 }
    );

    const afterClass = await htmlEl.getAttribute("class");
    expect(afterClass).not.toBe(initialClass);

    // Specifically verify that the presence/absence of "dark" class changed
    const hadDark = initialClass?.includes("dark") ?? false;
    const hasDark = afterClass?.includes("dark") ?? false;
    expect(hasDark).not.toBe(hadDark);
  });
});
