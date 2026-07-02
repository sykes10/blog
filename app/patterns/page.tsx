import { getAllPatterns, getAllTags } from "@/lib/content";
import { TagFilter } from "@/components/patterns/TagFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patterns",
  description:
    "Focused explorations of reusable frontend concepts: components, behaviours, and engineering techniques.",
};

export default function PatternsPage() {
  const patterns = getAllPatterns();
  const allTags = getAllTags();

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

      <TagFilter patterns={patterns} allTags={allTags} />
    </div>
  );
}
