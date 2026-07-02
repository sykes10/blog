// Centralized content-access layer over the Velite-compiled collection.
// Route files must import from here rather than #site/content directly,
// so the data-access surface is centralized and testable.
import { patterns } from "#site/content";

export type { Pattern } from "#site/content";

/**
 * Returns all patterns sorted by publishedAt descending (newest first).
 */
export function getAllPatterns() {
  return patterns.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Returns the pattern matching the given slug, or undefined if not found.
 */
export function getPatternBySlug(slug: string) {
  return patterns.find((p) => p.slug === slug);
}

/**
 * Returns all patterns whose category matches the given category.
 */
export function getPatternsByCategory(category: string) {
  return patterns.filter((p) => p.category === category);
}

/**
 * Returns all patterns whose tags include the given tag.
 */
export function getPatternsByTag(tag: string) {
  return patterns.filter((p) => p.tags.includes(tag));
}

/**
 * Returns the de-duplicated, sorted set of every tag across all patterns.
 */
export function getAllTags() {
  return Array.from(new Set(patterns.flatMap((p) => p.tags))).sort();
}
