import { defineCollection, defineConfig, s } from "velite";
import readingTime from "reading-time";

// Pattern collection: focused explorations of a single reusable concept
// (component, behaviour, or engineering technique).
// No demoComponents field — live demo registry is Phase 2 scope (D-06/PATT-03).
const patterns = defineCollection({
  name: "Pattern",
  pattern: "patterns/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("patterns"),
      description: s.string().max(160), // doubles as meta description
      category: s.enum(["components", "behaviours", "engineering", "ux"]),
      tags: s.array(s.string()).default([]),
      publishedAt: s.isodate(),
      body: s.mdx(), // compiled MDX body
      raw: s.raw(), // raw text for reading-time computation
    })
    .transform((data) => ({
      ...data,
      readingTime: readingTime(data.raw).text,
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8][ext]",
    clean: true,
  },
  collections: { patterns },
});
