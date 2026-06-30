import { getAllPatterns } from "@/lib/content";

export default function HomePage() {
  const recentPatterns = getAllPatterns().slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-(--foreground) sm:text-5xl">
          Frontend Blueprints
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-(--muted)">
          Production-grade mental models for frontend engineers — covering
          the why and the trade-offs as much as the how.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/patterns"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Browse Patterns
          </a>
        </div>
      </section>

      {/* Recent Patterns */}
      {recentPatterns.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-(--foreground)">
            Latest Patterns
          </h2>
          <ul className="divide-y divide-(--border)">
            {recentPatterns.map((pattern) => (
              <li key={pattern.slug} className="py-5">
                <a href={`/patterns/${pattern.slug}`} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-(--foreground) group-hover:text-accent transition-colors">
                        {pattern.title}
                      </h3>
                      <p className="mt-1 text-sm text-(--muted) line-clamp-2">
                        {pattern.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-xs text-(--muted)">
                      {pattern.readingTime}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <a
              href="/patterns"
              className="text-sm font-medium text-(--muted) hover:text-(--foreground) transition-colors"
            >
              View all patterns →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
