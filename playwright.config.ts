/**
 * Playwright smoke test configuration.
 *
 * Full-stack local run commands:
 *   Development: npm run dev          (starts Turbopack dev server)
 *   Production:  npm run build && npm run start  (builds then serves the static output)
 *
 * The smoke suite runs against the production build (more representative of the
 * actual deployed site than the dev server — static generation is exercised).
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // Fail the suite on the first failure for fast feedback
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Build the app and start the production server before running tests.
  // This exercises the full static generation pipeline, not just dev-mode rendering.
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes — build can take a while
    stdout: "pipe",
    stderr: "pipe",
  },
});
