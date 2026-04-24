import { useEffect, useRef, useState } from "react";

const BOTTOM_THRESHOLD = 24;

function isNearBottom(element: HTMLDivElement): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= BOTTOM_THRESHOLD;
}

export function useStickyTerminalScroll(deps: readonly unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);
  const pinnedRef = useRef(true);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frameId = 0;

    const syncPinnedState = () => {
      const nextPinned = isNearBottom(element);
      if (nextPinned !== pinnedRef.current) {
        pinnedRef.current = nextPinned;
        setIsPinnedToBottom(nextPinned);
      }
    };

    syncPinnedState();

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncPinnedState();
      });
    };

    element.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      element.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !pinnedRef.current) return;

    element.scrollTop = element.scrollHeight;
  }, deps);

  const scrollToBottom = () => {
    const element = containerRef.current;
    if (!element) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
    pinnedRef.current = true;
    setIsPinnedToBottom(true);
  };

  return {
    containerRef,
    isPinnedToBottom,
    scrollToBottom,
  };
}
