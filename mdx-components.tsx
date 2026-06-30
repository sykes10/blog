// Root mdx-components.tsx — required by Next.js App Router for MDX component
// injection. Re-exports the actual component map from lib/mdx-components.tsx
// so the logic lives in a testable module rather than this convention file.
import type { MDXComponents } from "mdx/types";
import { getMDXComponents } from "@/lib/mdx-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
