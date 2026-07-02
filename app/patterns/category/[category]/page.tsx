import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPatternsByCategory } from "@/lib/content";

// Fixed category enum — must match the `category` enum in velite.config.ts.
const CATEGORIES = ["components", "behaviours", "engineering", "ux"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  components: "Components",
  behaviours: "Behaviours",
  engineering: "Engineering",
  ux: "UX",
};

// generateStaticParams enumerates the 4 fixed category values so Next.js can
// statically generate one page per category at build time.
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

// generateMetadata provides per-category SEO metadata.
// D-08: domain source is NEXT_PUBLIC_SITE_URL env var, never hardcoded in multiple places.
// D-07: site name is "Frontend Blueprints".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};

  const label = CATEGORY_LABELS[category];

  return {
    metadataBase: new URL(SITE_URL),
    title: `${label} Patterns`,
    description: `Pattern posts in the ${label} category on Frontend Blueprints.`,
    alternates: {
      canonical: `/patterns/category/${category}`,
    },
    openGraph: {
      title: `${label} Patterns`,
      description: `Pattern posts in the ${label} category on Frontend Blueprints.`,
      type: "website",
      url: `${SITE_URL}/patterns/category/${category}`,
      siteName: "Frontend Blueprints",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  // Validate the category param against the fixed enum BEFORE any lookup
  // (Pitfall 3 / Security V5 — T-02-03).
  if (!isCategory(category)) {
    notFound();
  }

  const patterns = getPatternsByCategory(category);
  const label = CATEGORY_LABELS[category];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-(--foreground)">
          {label} Patterns
        </h1>
        <p className="mt-3 text-base text-(--muted)">
          Pattern posts in the {label} category.
        </p>
        <a
          href="/patterns"
          className="mt-4 inline-block text-sm font-medium text-(--muted) hover:text-(--foreground) transition-colors"
        >
          ← All Patterns
        </a>
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
