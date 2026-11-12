import { useState, type CSSProperties, type MouseEvent } from 'react';
import type { CatImage, ToggleFavorite } from '../types';

// Gray image shown when a cat photo fails to load. It's an inline SVG (data URI),
// so it works even offline and needs no extra file.
const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#ddd"/>' +
      '<text x="150" y="160" font-size="20" text-anchor="middle" fill="#777">Image not available</text></svg>'
  );

// Number of ✨ in the sparkle burst; each one flies out at a different angle (see _effects.scss)
const SPARKLES = 8;

interface Props {
  image: CatImage;
  favorite: boolean;
  onToggleFavorite: ToggleFavorite;
  onShowInfo: (image: CatImage) => void;
}

// ---------- CatCard ----------
// One cat photo. The 🔍 and ❤️ buttons are hidden until the user hovers the card
// (the photo blurs and the buttons appear on top). On touch screens they're always visible.
export function CatCard({ image, favorite, onToggleFavorite, onShowInfo }: Props) {
  // true once the image fails to load, to swap it for the placeholder
  const [broken, setBroken] = useState(false);
  // Bumped when the cat is added to favorites; used as `key` to replay the sparkle animation
  const [sparkleKey, setSparkleKey] = useState(0);
  const breedName = image.breeds?.[0]?.name;

  // ---------- handleFavorite ----------
  // Sparkles only when adding (not removing), and passes the button so App can
  // animate the heart flying from here to the Favorites tab.
  function handleFavorite(event: MouseEvent<HTMLButtonElement>) {
    if (!favorite) setSparkleKey((k) => k + 1);
    onToggleFavorite(image, event.currentTarget);
  }

  return (
    <article className="card">
      {/* loading="lazy": the browser only downloads the image when it's about to be seen */}
      <img
        src={broken ? PLACEHOLDER : image.url}
        alt={breedName ? `${breedName} cat` : 'Cat photo'}
        loading="lazy"
        onError={() => setBroken(true)}
      />

      {/* small heart in the corner so favorites are recognizable without hovering */}
      {favorite && (
        <span className="card__badge" aria-hidden="true">
          ❤️
        </span>
      )}

      {/* Buttons layer, shown on hover / keyboard focus (CSS) */}
      <div className="card__overlay">
        {/* aria-label gives emoji-only buttons a name for screen readers */}
        <button className="icon-btn" aria-label="Show breed info" onClick={() => onShowInfo(image)}>
          🔍
        </button>
        {/* aria-pressed tells assistive tech this is an on/off button */}
        <button
          className="icon-btn fav-btn"
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleFavorite}
        >
          {/* key change remounts the icon so its "pop" animation plays again */}
          <span key={sparkleKey} className={sparkleKey > 0 ? 'fav-btn__icon fav-btn__icon--pop' : 'fav-btn__icon'}>
            {favorite ? '❤️' : '🤍'}
          </span>

          {/* Sparkle burst: --i tells each ✨ which direction to fly (CSS custom property) */}
          {sparkleKey > 0 && (
            <span key={`sparkle-${sparkleKey}`} className="sparkle" aria-hidden="true">
              {Array.from({ length: SPARKLES }, (_, i) => (
                <span key={i} style={{ '--i': i } as CSSProperties}>
                  ✨
                </span>
              ))}
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
