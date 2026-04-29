import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Hook for terminal scroll behaviour with an explicit "pin to bottom" toggle.
 *
 * - `isPinned`: When true, the terminal auto-scrolls to the latest line on
 *   every content change. Defaults to `false` (user scrolls freely).
 * - `togglePin`: Flips the pin state. When turning ON, also performs an
 *   immediate scroll-to-bottom.
 * - `scrollToBottom`: Imperatively scrolls to the bottom without affecting
 *   the pin state.
 */
export function useStickyTerminalScroll(deps: readonly unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const pinnedRef = useRef(false);

  // Auto-scroll when pinned and content changes
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !pinnedRef.current) return;

    element.scrollTop = element.scrollHeight;
  }, deps);

  const scrollToBottom = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const togglePin = useCallback(() => {
    const next = !pinnedRef.current;
    pinnedRef.current = next;
    setIsPinned(next);

    // When pinning ON, immediately scroll to bottom
    if (next) {
      const element = containerRef.current;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, []);

  return {
    containerRef,
    isPinned,
    togglePin,
    scrollToBottom,
  };
}
