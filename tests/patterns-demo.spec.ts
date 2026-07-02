/**
 * Optimistic Updates demo smoke tests for Frontend Blueprints (Plan 02-01).
 *
 * These tests cover PATT-02: a visitor can interact with a live, real-implementation
 * optimistic-update demo embedded in a Pattern post.
 *
 * Assertions:
 *   1. /patterns/optimistic-updates responds 200 and the demo's action button is visible
 *   2. Clicking the action button flips its optimistic state immediately (before the
 *      simulated network call resolves) — the whole point of useOptimistic
 *   3. A role="status" aria-live region exists in the DOM on page load, before any
 *      interaction (RESEARCH.md Pitfall 4 — the live region must not be injected at
 *      the moment of the state change, or screen readers may miss the announcement)
 *
 * Per RESEARCH.md Validation Architecture, the manual keyboard-only pass and the
 * NVDA+Firefox screen-reader pass for announcement quality remain manual-only checks
 * (phase gate, not this spec).
 */
import { test, expect } from "@playwright/test";

const PATTERN_SLUG = "optimistic-updates";
const DEMO_BUTTON_TESTID = "optimistic-like-button";

test.describe("Optimistic Updates demo (PATT-02)", () => {
  test("post page responds 200 and the demo action button is visible", async ({
    page,
  }) => {
    const response = await page.goto(`/patterns/${PATTERN_SLUG}`);

    expect(response?.status()).toBe(200);

    const button = page.getByRole("button", { name: /like/i });
    await expect(button).toBeVisible();
  });

  test("clicking the action button applies the optimistic update immediately", async ({
    page,
  }) => {
    await page.goto(`/patterns/${PATTERN_SLUG}`);

    const button = page.getByRole("button", { name: /like/i });
    await expect(button).toBeVisible();

    const initialPressed = await button.getAttribute("aria-pressed");

    await button.click();

    // The optimistic state must flip immediately, before the simulated network
    // call resolves — mirrors the theme-toggle waitForFunction pattern in
    // smoke.spec.ts, but polling aria-pressed instead of the <html> class.
    await page.waitForFunction(
      ({ testId, initial }) => {
        const el = document.querySelector(`[data-testid="${testId}"]`);
        return el?.getAttribute("aria-pressed") !== initial;
      },
      { testId: DEMO_BUTTON_TESTID, initial: initialPressed },
      { timeout: 1000 }
    );

    const afterClickPressed = await button.getAttribute("aria-pressed");
    expect(afterClickPressed).not.toBe(initialPressed);
  });

  test("an aria-live status region is present in the DOM on load", async ({
    page,
  }) => {
    await page.goto(`/patterns/${PATTERN_SLUG}`);

    // The live region must exist before any state change (present-but-empty),
    // not be injected dynamically at the moment of a rollback/error.
    const status = page.locator('[role="status"]');
    await expect(status).toHaveCount(1);
    await expect(status).toBeAttached();
  });
});
