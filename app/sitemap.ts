/**
 * Next.js sitemap convention file.
 *
 * Returns a MetadataRoute.Sitemap listing the home page, the patterns listing,
 * and all individual Pattern post URLs — all derived from NEXT_PUBLIC_SITE_URL
 * (D-08: single configurable site-URL source).
 *
 * Pattern data is read via getAllPatterns() from lib/content.ts (not #site/content
 * directly) to respect the centralized content-access boundary.
 */
import type { MetadataRoute } from "next";
import { getAllPatterns } from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const patterns = getAllPatterns();

  const patternEntries: MetadataRoute.Sitemap = patterns.map((p) => ({
    url: `${SITE_URL}/patterns/${p.slug}`,
    lastModified: p.publishedAt,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${SITE_URL}/patterns`,
      lastModified: new Date().toISOString(),
    },
    ...patternEntries,
  ];
}
