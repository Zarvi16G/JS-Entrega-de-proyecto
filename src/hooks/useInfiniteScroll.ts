import { useEffect, useRef } from 'react';

// ---------- useInfiniteScroll ----------
// Calls onReach when an invisible "sentinel" element at the bottom of the list scrolls into view.
// Returns a ref to attach to that element. <T> is the element type (e.g. HTMLDivElement).
export function useInfiniteScroll<T extends HTMLElement>(onReach: () => void, enabled: boolean) {
  const sentinelRef = useRef<T>(null);

  // IntersectionObserver tells us when the sentinel enters the viewport, without listening
  // to every scroll event. The observer is recreated after every load, so if the sentinel
  // is still visible (e.g. on a tall screen) it keeps loading until the page is filled.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onReach();
      },
      { rootMargin: '300px' } // start loading a bit before reaching the bottom
    );
    observer.observe(sentinel);

    // Cleanup: stop observing before the effect runs again or the component unmounts
    return () => observer.disconnect();
  }, [onReach, enabled]);

  return sentinelRef;
}
