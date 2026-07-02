"use client";

import { startTransition, useOptimistic, useState } from "react";

interface LikeState {
  liked: boolean;
  count: number;
}

const INITIAL_STATE: LikeState = { liked: false, count: 128 };

// Simulated network failure rate — high enough that a reader clicking a few
// times will actually see the rollback path, which is the whole teaching
// point of this demo.
const SIMULATED_FAILURE_RATE = 0.4;
const SIMULATED_LATENCY_MS = 700;

/**
 * Simulates an async mutation against a server. Resolves with the next
 * committed state on success, rejects with a deliberately generic, authored
 * message on failure. Never leaks a real error object or stack trace here:
 * this is teaching code a reader may copy verbatim (Security Domain,
 * Information Disclosure).
 */
function simulateLikeRequest(next: LikeState): Promise<LikeState> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < SIMULATED_FAILURE_RATE) {
        reject(new Error("Update failed. Please try again."));
        return;
      }
      resolve(next);
    }, SIMULATED_LATENCY_MS);
  });
}

/**
 * OptimisticUpdatesDemo — a live "like" toggle demonstrating React 19's
 * useOptimistic + startTransition. Clicking the button updates the UI
 * immediately (the optimistic state), before the simulated network call
 * resolves. On success the optimistic state is confirmed. On failure the UI
 * reverts automatically (useOptimistic re-renders from the unchanged base
 * state) and a visible, aria-live-announced error message explains why.
 *
 * Usage in MDX:
 *   <OptimisticUpdatesDemo />
 */
export function OptimisticUpdatesDemo() {
  const [committed, setCommitted] = useState<LikeState>(INITIAL_STATE);
  const [optimistic, setOptimistic] = useOptimistic(committed);
  const [error, setError] = useState<string | null>(null);
  const isPending = optimistic !== committed;

  function handleToggle() {
    const next: LikeState = {
      liked: !committed.liked,
      count: committed.liked ? committed.count - 1 : committed.count + 1,
    };

    startTransition(async () => {
      setError(null);
      // Shows immediately, before the simulated call resolves.
      setOptimistic(next);

      try {
        const confirmed = await simulateLikeRequest(next);
        setCommitted(confirmed);
      } catch (err) {
        // No manual revert needed: the transition ends, `optimistic`
        // re-renders from `committed` (unchanged), so the UI reverts
        // automatically. We only need to surface the failure.
        setError(err instanceof Error ? err.message : "Update failed. Please try again.");
      }
    });
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-(--border) p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={optimistic.liked}
          aria-label={optimistic.liked ? "Unlike this pattern" : "Like this pattern"}
          data-testid="optimistic-like-button"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <span aria-hidden="true">{optimistic.liked ? "♥" : "♡"}</span>
          {optimistic.liked ? "Liked" : "Like"}
        </button>
        <span className="text-sm text-(--muted)">
          {optimistic.count.toLocaleString()} likes
        </span>
        {isPending && (
          <span className="text-xs text-(--muted)" aria-hidden="true">
            Saving…
          </span>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700 dark:text-red-400">{error}</p>
      )}

      {/* Persistent, always-in-DOM live region — must exist before any state
          change so screen readers register it at parse time, not mutation
          time (RESEARCH.md Pitfall 4). Empty when there is nothing to announce. */}
      <div role="status" aria-live="polite" className="sr-only">
        {error ? `Error: ${error} Reverted to previous state.` : ""}
      </div>
    </div>
  );
}
