import type { RefObject } from 'react';
import type { View } from '../types';

interface Props {
  view: View;
  favoritesCount: number;
  favoritesTabRef: RefObject<HTMLButtonElement | null>; // target of the flying heart
  favoritesGlow: number; // changes every time a favorite is added
  onChangeView: (view: View) => void;
}

// ---------- Header ----------
// Title and navigation between Gallery and Favorites.
// It doesn't own any state: it receives the current view and tells App when to change it.
export function Header({ view, favoritesCount, favoritesTabRef, favoritesGlow, onChangeView }: Props) {
  return (
    <header className="header">
      <h1 className="header__title">🐱 CatGallery</h1>
      <nav className="nav">
        {/* aria-current marks the active button for screen readers, and the CSS styles it */}
        <button
          className="nav__btn"
          aria-current={view === 'gallery' ? 'page' : undefined}
          onClick={() => onChangeView('gallery')}
        >
          Gallery
        </button>
        {/* Changing `key` makes React create a new button, which restarts the CSS glow animation.
            Glow only after the first favorite (favoritesGlow > 0), not on page load. */}
        <button
          key={`favorites-${favoritesGlow}`}
          ref={favoritesTabRef}
          className={`nav__btn${favoritesGlow > 0 ? ' nav__btn--glow' : ''}`}
          aria-current={view === 'favorites' ? 'page' : undefined}
          onClick={() => onChangeView('favorites')}
        >
          Favorites ({favoritesCount})
        </button>
      </nav>
    </header>
  );
}
