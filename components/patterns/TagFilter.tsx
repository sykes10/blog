"use client";

import { useState } from "react";
import type { Pattern } from "@/lib/content";

interface TagFilterProps {
  patterns: Pattern[];
  allTags: string[];
}

/**
 * TagFilter — client island rendering a tag chip group above the Patterns
 * list. Clicking a chip narrows the (server-fetched) pattern list to posts
 * carrying that tag; clicking the active chip again clears the filter.
 * Tags are author-controlled MDX frontmatter, not user input (T-02-04).
 */
export function TagFilter({ patterns, allTags }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? patterns.filter((p) => p.tags.includes(activeTag))
    : patterns;

  return (
    <>
      <div role="group" aria-label="Filter by tag" className="mb-8 flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const pressed = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={pressed}
              onClick={() => setActiveTag(pressed ? null : tag)}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                pressed
                  ? "bg-accent text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <ul className="divide-y divide-(--border)">
        {filtered.map((pattern) => (
          <li key={pattern.slug} className="py-6">
            <a href={`/patterns/${pattern.slug}`} className="group block">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-(--foreground) group-hover:text-accent transition-colors">
                    {pattern.title}
                  </h2>
                  <p className="mt-1 text-sm text-(--muted) line-clamp-2">
                    {pattern.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pattern.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-(--muted)">
                  {pattern.readingTime}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
