import { CatGrid } from './CatGrid';
import { EmptyMessage } from './Status';
import type { CatImage, ToggleFavorite } from '../types';

interface Props {
  favorites: CatImage[];
  onToggleFavorite: ToggleFavorite;
  onShowInfo: (image: CatImage) => void;
}

// ---------- FavoritesView ----------
// Shows the saved favorites (from localStorage, no API call).
// Every card here is a favorite, so isFavorite always returns true;
// clicking ❤️ removes it and the card disappears.
export function FavoritesView({ favorites, onToggleFavorite, onShowInfo }: Props) {
  return (
    <section>
      <h2>My favorites</h2>
      {favorites.length === 0 ? (
        <EmptyMessage>You have no favorites yet. Mark some with ♥ in the gallery.</EmptyMessage>
      ) : (
        <CatGrid images={favorites} isFavorite={() => true} onToggleFavorite={onToggleFavorite} onShowInfo={onShowInfo} />
      )}
    </section>
  );
}
