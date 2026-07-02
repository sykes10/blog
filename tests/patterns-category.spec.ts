/**
 * Category route smoke tests for Frontend Blueprints (Plan 02-02).
 *
 * Covers PATT-04: browse Pattern posts by category via statically generated,
 * SEO-indexable /patterns/category/[category] routes.
 *
 * Uses request.get() (feed.spec.ts style — no browser navigation needed for
 * pure status/body checks) for fast feedback.
 *
 * Note: the Behaviours-category post (Optimistic Updates) is produced by a
 * sibling Wave-1 plan (02-01). Until that plan merges, /patterns/category/behaviours
 * still returns 200 (the route is statically generated for all 4 enum values
 * regardless of content) but lists zero posts — so only the 200-status assertion
 * for "behaviours" is made here, not a content assertion. The primary
 * 200 + in-category-content assertion runs against "components" (Toast), which
 * is available in every wave.
 */
import { test, expect } from "@playwright/test";

const TOAST_TITLE = "Toast Notification System";

test.describe("Category routes (PATT-04)", () => {
  test("GET /patterns/category/components returns 200 and lists the Toast post", async ({
    request,
  }) => {
    const response = await request.get("/patterns/category/components");

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain(TOAST_TITLE);
  });

  test("GET /patterns/category/behaviours returns 200 (content assertion deferred to wave merge)", async ({
    request,
  }) => {
    const response = await request.get("/patterns/category/behaviours");

    expect(response.status()).toBe(200);

    // The Behaviours post ships from a sibling plan (02-01). Once merged, this
    // page will list the Optimistic Updates post and NOT the Toast title.
    const body = await response.text();
    expect(body).not.toContain(TOAST_TITLE);
  });

  test("GET /patterns/category/nonsense returns 404", async ({ request }) => {
    const response = await request.get("/patterns/category/nonsense");

    expect(response.status()).toBe(404);
  });
});
