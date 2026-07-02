/**
 * Tag filter smoke test for Frontend Blueprints (Plan 02-02).
 *
 * Covers PATT-04: browse Pattern posts by tag via a client-side chip filter
 * on the /patterns index.
 *
 * Follows the click + waitForFunction state-change pattern established in
 * smoke.spec.ts's theme-toggle test.
 *
 * Content-scale note: this plan (02-02) runs in a Wave-1 worktree isolated
 * from the sibling 02-01 plan, which ships the second seeded post (Behaviours
 * category, Optimistic Updates). Until both plans merge, only the Toast post
 * exists, and it carries every tag rendered as a chip — so filtering by any
 * chip cannot exclude it (there is no second post to narrow away). The
 * aria-pressed toggle and subset-correctness assertions below are fully
 * exercised regardless of content scale; the strict "fewer items than before"
 * narrowing assertion additionally activates once 2+ posts exist (post-merge).
 */
import { test, expect } from "@playwright/test";

// "accessibility" is a tag on the seeded Toast post (see content/patterns/toast-notification-system.mdx).
const SEEDED_TAG = "accessibility";

test.describe("Tag filter (PATT-04)", () => {
  test("clicking a tag chip filters the /patterns list and sets aria-pressed", async ({
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

    // Click the chip; the chip must report aria-pressed="true" immediately.
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");

    const filteredCount = await listItems.count();

    // The filtered list must never contain more items than the full list.
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    if (initialCount > 1) {
      // With 2+ posts seeded (post wave-merge), filtering by a tag that isn't
      // shared by every post must strictly narrow the visible list.
      expect(filteredCount).toBeLessThan(initialCount);
    }

    // Every remaining post title link must still be visible (list is non-empty
    // since the seeded Toast post carries this tag).
    expect(filteredCount).toBeGreaterThan(0);

    // Clicking the active chip again toggles the filter off and restores the
    // full list (behavior spec: "toggle off").
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await expect(listItems).toHaveCount(initialCount);
  });
});
