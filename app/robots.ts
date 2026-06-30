/**
 * Next.js robots convention file.
 *
 * Allows all crawlers and points them at the sitemap URL derived from
 * NEXT_PUBLIC_SITE_URL (D-08: single configurable site-URL source).
 */
import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
