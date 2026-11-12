import { useRef, useState } from 'react';
import { Header } from './components/Header';
import { GalleryView } from './components/GalleryView';
import { FavoritesView } from './components/FavoritesView';
import { BreedModal } from './components/BreedModal';
import { useFavorites } from './hooks/useFavorites';
import { flyToTarget } from './utils/flyToTarget';
import type { CatImage, ToggleFavorite, View } from './types';

// ---------- App ----------
// Root component. Holds the state shared by several sections:
// the visible view, the image open in the modal and the favorites list.
export function App() {
  const [view, setView] = useState<View>('gallery');
  const [selectedImage, setSelectedImage] = useState<CatImage | null>(null); // null = modal closed
  // Favorites live here (not inside a view) because the header, gallery and favorites all need them
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Ref to the Favorites tab, the target of the flying heart
  const favoritesTabRef = useRef<HTMLButtonElement>(null);
  // Bumped each time a favorite is added; Header uses it to replay the tab's glow
  const [favoritesGlow, setFavoritesGlow] = useState(0);

  // ---------- handleToggleFavorite ----------
  // Wraps toggleFavorite to add the visual feedback when *adding* a favorite:
  // a heart flies from the card to the Favorites tab, then the tab glows.
  const handleToggleFavorite: ToggleFavorite = (image, from) => {
    const adding = !isFavorite(image.id);
    toggleFavorite(image);
    if (!adding) return;

    const tab = favoritesTabRef.current;
    if (from && tab) flyToTarget(from, tab).then(() => setFavoritesGlow((n) => n + 1));
    else setFavoritesGlow((n) => n + 1);
  };

  return (
    <>
      <Header
        view={view}
        favoritesCount={favorites.length}
        favoritesTabRef={favoritesTabRef}
        favoritesGlow={favoritesGlow}
        onChangeView={setView}
      />

      <main className="main">
        {/* the gallery is hidden instead of unmounted so loaded images and scroll progress are kept */}
        <div hidden={view !== 'gallery'}>
          <GalleryView isFavorite={isFavorite} onToggleFavorite={handleToggleFavorite} onShowInfo={setSelectedImage} />
        </div>
        {/* favorites are cheap to render (no API call), so they mount only when shown */}
        {view === 'favorites' && (
          <FavoritesView favorites={favorites} onToggleFavorite={handleToggleFavorite} onShowInfo={setSelectedImage} />
        )}
      </main>

      {/* single modal for the whole app, opened by setting selectedImage */}
      <BreedModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}
