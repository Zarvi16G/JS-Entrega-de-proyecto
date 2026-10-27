const STORAGE_KEY = 'catgallery:favorites';

export function getFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // datos corruptos o localStorage bloqueado
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
  return getFavorites().some((fav) => fav.id === id);
}

// Guardamos url y breeds para poder pintar favoritos sin volver a llamar a la API
export function toggleFavorite(image) {
  const favorites = getFavorites();
  if (favorites.some((fav) => fav.id === image.id)) {
    saveFavorites(favorites.filter((fav) => fav.id !== image.id));
    return false;
  }
  saveFavorites([...favorites, { id: image.id, url: image.url, breeds: image.breeds ?? [] }]);
  return true;
}
