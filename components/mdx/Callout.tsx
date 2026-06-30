import type { ReactNode } from "react";

type CalloutType = "note" | "tip" | "warning" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutStyles: Record<
  CalloutType,
  { wrapper: string; icon: string; title: string }
> = {
  note: {
    wrapper:
      "border-l-4 border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30",
    icon: "ℹ",
    title: "text-blue-800 dark:text-blue-300",
  },
  tip: {
    wrapper:
      "border-l-4 border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-950/30",
    icon: "✓",
    title: "text-green-800 dark:text-green-300",
  },
  warning: {
    wrapper:
      "border-l-4 border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30",
    icon: "⚠",
    title: "text-amber-800 dark:text-amber-300",
  },
  danger: {
    wrapper:
      "border-l-4 border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/30",
    icon: "✕",
    title: "text-red-800 dark:text-red-300",
  },
};

/**
 * Callout — a presentational aside/note box for use in MDX content.
 * Renders a styled block with an optional title and icon based on the type.
 *
 * Usage in MDX:
 *   <Callout type="warning" title="Heads up">Content here</Callout>
 *   <Callout>A plain note without a title</Callout>
 */
export function Callout({ type = "note", title, children }: CalloutProps) {
  const styles = calloutStyles[type];

  return (
    <aside className={`not-prose my-6 rounded-r-lg p-4 ${styles.wrapper}`}>
      {title ? (
        <p className={`mb-1 flex items-center gap-2 text-sm font-semibold ${styles.title}`}>
          <span aria-hidden="true">{styles.icon}</span>
          {title}
        </p>
      ) : null}
      <div className="text-sm text-(--foreground) [&>p]:m-0">{children}</div>
    </aside>
  );
}
