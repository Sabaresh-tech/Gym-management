import { useEffect, useState } from "react";

/**
 * useDebounce — returns a version of `value` that only updates after the
 * user has stopped changing it for `delay` milliseconds.
 *
 * Demonstrates:
 *  - useEffect's cleanup function: every time `value` changes, the effect
 *    re-runs, and React calls the previous run's cleanup (clearTimeout)
 *    first — this is what cancels the *stale* pending timer, so only the
 *    very last keystroke's timeout actually fires.
 *  - a dependency array of [value, delay] so the effect only re-fires when
 *    one of those actually changes.
 *
 * @param {*} value - the fast-changing value (e.g. a search input string)
 * @param {number} delay - debounce delay in ms
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup: cancels the stale timer
  }, [value, delay]);

  return debounced;
}
