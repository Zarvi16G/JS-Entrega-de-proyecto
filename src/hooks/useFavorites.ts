import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CatImage } from '../types';

// Namespaced key so it doesn't clash with other apps on the same domain (github.io)
const STORAGE_KEY = 'catgallery:favorites';

// ---------- readFavorites ----------
// Reads the saved favorites. Wrapped in try/catch because the stored JSON may be corrupted
// or localStorage may be blocked (private mode); in both cases we start with an empty list.
function readFavorites(): CatImage[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ---------- useFavorites ----------
// Custom hook that keeps the favorites list in React state and in sync with localStorage.
export function useFavorites() {
  // Passing the function (not calling it) makes React read localStorage only on the first render
  const [favorites, setFavorites] = useState<CatImage[]>(readFavorites);

  // Save to localStorage every time the list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // without localStorage, favorites only last this session
    }
  }, [favorites]);

  // A Set of ids makes "is this a favorite?" instant instead of searching the array each time.
  // useMemo only rebuilds it when the list changes.
  const favoriteIds = useMemo(() => new Set(favorites.map((fav) => fav.id)), [favorites]);

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  // Adds the image if it's not a favorite, removes it if it is.
  // Stores url and breeds so favorites can be rendered without calling the API again.
  const toggleFavorite = useCallback((image: CatImage) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === image.id)
        ? prev.filter((fav) => fav.id !== image.id)
        : [...prev, { id: image.id, url: image.url, breeds: image.breeds ?? [] }]
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
