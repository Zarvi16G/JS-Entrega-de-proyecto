import { CatCard } from './CatCard';
import type { CatImage, ToggleFavorite } from '../types';

interface Props {
  images: CatImage[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: ToggleFavorite;
  onShowInfo: (image: CatImage) => void;
}

// ---------- CatGrid ----------
// Renders a list of images as cards. Reused by the gallery and the favorites view.
export function CatGrid({ images, isFavorite, onToggleFavorite, onShowInfo }: Props) {
  return (
    <div className="grid">
      {/* key lets React know which card is which, so it only updates the ones that changed */}
      {images.map((image) => (
        <CatCard
          key={image.id}
          image={image}
          favorite={isFavorite(image.id)}
          onToggleFavorite={onToggleFavorite}
          onShowInfo={onShowInfo}
        />
      ))}
    </div>
  );
}
