import { getAllPatterns } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patterns",
  description:
    "Focused explorations of reusable frontend concepts: components, behaviours, and engineering techniques.",
};

export default function PatternsPage() {
  const patterns = getAllPatterns();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-(--foreground)">
          Patterns
        </h1>
        <p className="mt-3 text-base text-(--muted)">
          Focused explorations of a single reusable concept: component,
          behaviour, or engineering technique.
        </p>
      </header>

      <ul className="divide-y divide-(--border)">
        {patterns.map((pattern) => (
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
    </div>
  );
}
