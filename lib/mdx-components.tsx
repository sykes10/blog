import type { MDXComponents } from "mdx/types";

// Typography-only component map for Phase 1.
// No demo-component registry entries — deferred to Phase 2.
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
    // Inline code: styled to differentiate from prose text
    code: ({ children, ...props }) => (
      <code
        {...props}
        className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
      >
        {children}
      </code>
    ),
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
    // Override the default components with any passed overrides
    ...components,
  };
}

// Named export for use in route files
export const mdxComponents = getMDXComponents();
