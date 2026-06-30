import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPatterns, getPatternBySlug } from "@/lib/content";
import { getMDXComponents } from "@/lib/mdx-components";

// MDX plugin chain: remark-gfm → rehype-slug → rehype-autolink-headings → rehype-pretty-code+Shiki
// rehype-slug MUST come before rehype-autolink-headings (autolink depends on slug's id attrs).
// rehype-pretty-code runs last so it transforms <pre><code> after all other rehype passes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MDX_OPTIONS: Record<string, any> = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [
      rehypePrettyCode,
      {
        // Paired light/dark Shiki themes — respects the active Tailwind dark class.
        // globals.css targets [data-theme="light"] / [data-theme="dark"] for code blocks.
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      },
    ],
  ],
};

// generateStaticParams enumerates all pattern slugs so Next.js can
// statically generate each pattern route at build time.
export async function generateStaticParams() {
  const patterns = getAllPatterns();
  return patterns.map((p) => ({ slug: p.slug }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// generateMetadata provides per-route SEO metadata.
// D-08: domain source is NEXT_PUBLIC_SITE_URL env var, never hardcoded in multiple places.
// D-07: site name is "Frontend Blueprints".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPatternBySlug(slug);
  if (!post) return {};

  return {
    metadataBase: new URL(SITE_URL),
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/patterns/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${SITE_URL}/patterns/${post.slug}`,
      siteName: "Frontend Blueprints",
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

  // JSON-LD Article schema — per D-09, author name is "Alejandro Arevalo" (not git handle sykes10).
  // dangerouslySetInnerHTML is safe here: data is author-controlled frontmatter known at build time,
  // not user input. JSON.stringify serializes all special characters. (T-01-03 threat accepted.)
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
    url: `${SITE_URL}/patterns/${post.slug}`,
  };

  // MDX component map — defined in lib/mdx-components.tsx and passed to MDXRemote.
  // Both live in a Server Component context; no client/server boundary is crossed.
  const mdxComponents = getMDXComponents();

  return (
    <>
      {/* JSON-LD injected server-side; no user data interpolated (T-01-03 threat: accepted). */}
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
            {/* SITE-03: reading time rendered from Velite-computed readingTime field */}
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

        {/* MDX body — prose dark:prose-invert applies @tailwindcss/typography styles.
            MDXRemote from next-mdx-remote/rsc compiles raw MDX server-side as an async
            Server Component, shipping zero extra client JS for the post body.
            Plugin chain: remark-gfm → rehype-slug → rehype-autolink-headings → rehype-pretty-code */}
        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote
            source={post.raw}
            options={{ mdxOptions: MDX_OPTIONS }}
            components={mdxComponents}
          />
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
