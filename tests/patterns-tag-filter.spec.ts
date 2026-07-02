/**
 * Tag filter smoke test for Frontend Blueprints (Plan 02-02).
 *
 * Covers PATT-04: browse Pattern posts by tag via a client-side chip filter
 * on the /patterns index.
 *
 * Follows the click + waitForFunction state-change pattern established in
 * smoke.spec.ts's theme-toggle test.
 */
import { test, expect } from "@playwright/test";

// "accessibility" is a tag on the seeded Toast post (see content/patterns/toast-notification-system.mdx).
const SEEDED_TAG = "accessibility";

test.describe("Tag filter (PATT-04)", () => {
  test("clicking a tag chip narrows the /patterns list and sets aria-pressed", async ({
    page,
  }) => {
    await page.goto("/patterns");

    // Record the full list length before filtering.
    const listItems = page.locator("ul li");
    const initialCount = await listItems.count();
    expect(initialCount).toBeGreaterThan(0);

    // Locate the tag chip button by accessible name.
    const chip = page.getByRole("button", { name: SEEDED_TAG, exact: true });
    await expect(chip).toBeVisible();
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    // Click the chip and wait for the list to narrow.
    await chip.click();
    await page.waitForFunction(
      (count) => document.querySelectorAll("ul li").length !== count,
      initialCount,
      { timeout: 3000 }
    );

    const filteredCount = await listItems.count();
    expect(filteredCount).toBeLessThan(initialCount);

    await expect(chip).toHaveAttribute("aria-pressed", "true");
  });
});
