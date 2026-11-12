import { useCallback, useEffect, useState } from 'react';
import { fetchImages, PAGE_SIZE } from '../api';
import type { CatImage, Filters, RequestStatus } from '../types';

// What the gallery is asking the API for: which filters and which page
interface Query {
  filters: Filters;
  page: number;
}

// ---------- useCatImages ----------
// Custom hook that owns the gallery data: images, loading/error state and pagination.
// Components just call loadMore / applyFilters / retry and render what it returns.
export function useCatImages(initialFilters: Filters) {
  // ---------- State ----------
  // filters and page live together so changing filters resets the page to 0 in the same render
  const [query, setQuery] = useState<Query>({ filters: initialFilters, page: 0 });
  const [attempt, setAttempt] = useState(0); // bumped by "Retry" to re-run the effect
  const [images, setImages] = useState<CatImage[]>([]);
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);

  // ---------- Fetch effect ----------
  // Runs every time the query (filters/page) changes or the user retries.
  useEffect(() => {
    const controller = new AbortController(); // lets us cancel this request later
    const { filters, page } = query;

    // Page 0 means a fresh search: clear the previous results
    setStatus('loading');
    if (page === 0) {
      setImages([]);
      setHasMore(false);
    }

    fetchImages(page, filters, controller.signal)
      .then((newImages) => {
        // Page 0 replaces the list, later pages are appended ("load more")
        setImages((prev) => (page === 0 ? newImages : [...prev, ...newImages]));
        // A full page means there may be more; fewer than PAGE_SIZE means we reached the end
        setHasMore(newImages.length === PAGE_SIZE);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return; // cancelled on purpose, not a real error
        setError(err instanceof Error ? err.message : 'Unexpected error.');
        setStatus('error');
      });

    // Cleanup: if the filters change before the response arrives, the previous request is
    // cancelled so old results never mix with new ones
    return () => controller.abort();
  }, [query, attempt]);

  // ---------- Actions ----------
  // useCallback keeps the same function between renders, so effects that depend on them
  // (like infinite scroll) don't re-run for no reason.
  const applyFilters = useCallback((filters: Filters) => setQuery({ filters, page: 0 }), []);
  const loadMore = useCallback(() => setQuery((q) => ({ ...q, page: q.page + 1 })), []);
  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { images, status, error, hasMore, filters: query.filters, applyFilters, loadMore, retry };
}
