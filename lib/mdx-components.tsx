import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { OptimisticUpdatesDemo } from "@/components/demos/OptimisticUpdatesDemo";

// Component map for MDX rendering.
// - Typography overrides: headings, inline code, external links
// - Presentational MDX components: Callout
// - Demo-component registry: OptimisticUpdatesDemo (Phase 2, D-04/D-05/PATT-02)
// This module contains the actual component map logic;
// the root mdx-components.tsx re-exports useMDXComponents from here.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    // Custom heading anchors rendered with readable sizing and scroll offset
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        className="mt-8 scroll-mt-20 text-2xl font-semibold tracking-tight"
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        className="mt-6 scroll-mt-20 text-xl font-semibold tracking-tight"
      >
        {children}
      </h3>
    ),
    // Inline code: styled to differentiate from prose text.
    // Note: rehype-pretty-code wraps fenced code blocks in a data-[rehype-pretty-code-figure]
    // element and applies its own <code> styling; this override only applies to
    // inline `code` not inside a <pre> block.
    code: ({ children, ...props }) => {
      // If the parent is a pre (block code), don't apply inline styling
      if (props["data-language"] !== undefined) {
        return <code {...props}>{children}</code>;
      }
      return (
        <code
          {...props}
          className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        >
          {children}
        </code>
      );
    },
    // External links open in new tab
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          {...props}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="font-medium underline underline-offset-4 transition-colors hover:text-accent"
        >
          {children}
        </a>
      );
    },
    // Presentational MDX component — registered as <Callout> in MDX content
    Callout,
    // Live demo island — registered as <OptimisticUpdatesDemo /> in MDX content
    OptimisticUpdatesDemo,
    // Override the default components with any passed overrides
    ...components,
  };
}

// Named export for use in route files
export const mdxComponents = getMDXComponents();
