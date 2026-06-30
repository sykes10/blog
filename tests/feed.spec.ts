/**
 * Feed and sitemap smoke tests for Frontend Blueprints (Plan 01-03).
 *
 * These tests cover SITE-02: RSS feed + sitemap working correctly.
 * Uses plain request assertions (no browser navigation) for fast feedback.
 *
 * Assertions:
 *   1. GET /rss.xml → 200, application/xml content type, contains channel title and post slug
 *   2. GET /sitemap.xml → 200, contains the pattern post URL
 *   3. GET /robots.txt → 200, references the sitemap
 */
import { test, expect } from "@playwright/test";

const PATTERN_SLUG = "toast-notification-system";

test.describe("RSS feed (SITE-02)", () => {
  test("GET /rss.xml returns 200 with XML content type and correct channel title", async ({
    request,
  }) => {
    const response = await request.get("/rss.xml");

    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/xml");

    const body = await response.text();
    expect(body).toContain("Frontend Blueprints");
  });

  test("GET /rss.xml body contains the pattern post slug/link", async ({
    request,
  }) => {
    const response = await request.get("/rss.xml");
    const body = await response.text();

    expect(body).toContain(PATTERN_SLUG);
  });
});

test.describe("Sitemap (SITE-02)", () => {
  test("GET /sitemap.xml returns 200 and contains the pattern post URL", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain(`/patterns/${PATTERN_SLUG}`);
  });
});

test.describe("Robots (SITE-02)", () => {
  test("GET /robots.txt returns 200 and references the sitemap", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body.toLowerCase()).toContain("sitemap");
  });
});
