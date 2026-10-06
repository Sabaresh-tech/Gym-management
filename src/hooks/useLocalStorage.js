import { useEffect, useState } from "react";

/**
 * useLocalStorage — a custom hook that behaves exactly like useState,
 * except the value is read from localStorage on first render and written
 * back to localStorage (via useEffect) every time it changes.
 *
 * Demonstrates:
 *  - useState for the actual in-memory value
 *  - useEffect with a dependency array ([key, value]) so the write only
 *    re-runs when the key or value actually changes, not on every render
 *  - wrapping both behind a single reusable "use..." function (a custom hook)
 *
 * @param {string} key - localStorage key to persist under
 * @param {*} initialValue - value (or a () => value factory) used the first
 *   time this key has never been saved before
 * @returns {[value, setValue]} same shape as useState
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    } catch (err) {
      // Corrupt or inaccessible storage — fall back to the initial value.
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Storage full or unavailable (e.g. private browsing) — ignore.
    }
  }, [key, value]);

  return [value, setValue];
}
