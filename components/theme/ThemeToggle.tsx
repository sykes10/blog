"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Client island for the theme toggle button.
// Guards against hydration mismatch by only rendering the resolved-theme icon
// after the component has mounted (when localStorage is available).
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mount to avoid hydration mismatch between server
  // (no localStorage) and client (has localStorage / system preference).
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    // Render a placeholder with the same dimensions to avoid layout shift.
    return (
      <button
        aria-label="Toggle theme"
        className="size-9 rounded-md border border-transparent p-2 opacity-0"
        disabled
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={
        resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className="size-9 rounded-md border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
    >
      {resolvedTheme === "dark" ? (
        // Sun icon for dark mode (click to go light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon icon for light mode (click to go dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
