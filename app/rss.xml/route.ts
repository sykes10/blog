/**
 * RSS 2.0 feed Route Handler for Frontend Blueprints.
 *
 * Builds the feed from the Velite-compiled Pattern collection via getAllPatterns().
 * All URLs are derived from NEXT_PUBLIC_SITE_URL (D-08: single configurable source).
 * Title/description fields are XML-escaped to prevent invalid XML from author
 * frontmatter containing &, <, or > (T-01-05 mitigation).
 */
import { getAllPatterns } from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

/**
 * Escapes characters that are special in XML contexts.
 * Prevents malformed XML when post titles/descriptions contain &, <, or >.
 */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET() {
  const patterns = getAllPatterns();

  const items = patterns
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/patterns/${p.slug}</link>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <guid>${SITE_URL}/patterns/${p.slug}</guid>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Frontend Blueprints</title>
    <link>${SITE_URL}</link>
    <description>Production-grade frontend engineering patterns and blueprints</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
