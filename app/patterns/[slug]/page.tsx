import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPatterns, getPatternBySlug } from "@/lib/content";
import { getMDXComponents } from "@/lib/mdx-components";

// generateStaticParams enumerates all pattern slugs so Next.js can
// statically generate each pattern route at build time.
export async function generateStaticParams() {
  const patterns = getAllPatterns();
  return patterns.map((p) => ({ slug: p.slug }));
}

// generateMetadata provides per-route SEO metadata.
// Plan 02 will extend this with full OG image, JSON-LD, and canonical URL;
// the structure here is intentionally left open for that extension.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPatternBySlug(slug);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${siteUrl}/patterns/${post.slug}`,
    },
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPatternBySlug(slug);

  // Return 404 for unknown slugs
  if (!post) {
    notFound();
  }

  // JSON-LD Article schema — per D-09, author name is "Alejandro Arevalo"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: "Alejandro Arevalo",
    },
    datePublished: post.publishedAt,
  };

  // MDX component map — defined here and passed to MDXRemote since both live
  // in a Server Component context (no client/server boundary crossing).
  const mdxComponents = getMDXComponents();

  return (
    <>
      {/* JSON-LD is injected server-side; no user data is interpolated so
          the dangerouslySetInnerHTML risk (XSS via untrusted HTML) does not apply. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Post header */}
        <header className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {post.category}
            </span>
            <span className="text-xs text-(--muted)">{post.readingTime}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-(--foreground)">
            {post.title}
          </h1>
          <p className="mt-3 text-base text-(--muted)">{post.description}</p>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* MDX body — prose and dark:prose-invert apply @tailwindcss/typography styles.
            MDXRemote from next-mdx-remote/rsc compiles the raw MDX source server-side
            as an async Server Component, shipping zero extra client JS for the post body. */}
        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote source={post.raw} components={mdxComponents} />
        </article>

        <footer className="mt-12 border-t border-(--border) pt-8">
          <a
            href="/patterns"
            className="text-sm font-medium text-(--muted) hover:text-(--foreground) transition-colors"
          >
            ← Back to Patterns
          </a>
        </footer>
      </div>
    </>
  );
}
