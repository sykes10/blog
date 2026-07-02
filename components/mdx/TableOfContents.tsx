"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/toc";

interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * TableOfContents — renders a jump-link nav for a Pattern post's section
 * headings, with the currently-visible heading marked aria-current="location"
 * as the reader scrolls (IntersectionObserver-driven scroll-spy).
 *
 * Usage:
 *   const headings = extractHeadings(post.raw);
 *   <TableOfContents headings={headings} />
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Observe each heading element and track which one is currently intersecting
  // the "reading zone" of the viewport. Cleanup on unmount avoids leaking the
  // observer across client navigations (mirrors ThemeToggle's useEffect discipline).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-110px 0px -60% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--muted)">
        On this page
      </p>
      <ul className="space-y-1 border-l border-(--border) text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: `${(heading.depth - 2) * 12}px` }}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? "location" : undefined}
              className={`block border-l-2 py-1 pl-3 -ml-px transition-colors ${
                activeId === heading.id
                  ? "border-(--foreground) text-(--foreground) font-medium"
                  : "border-transparent text-(--muted) hover:text-(--foreground)"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
