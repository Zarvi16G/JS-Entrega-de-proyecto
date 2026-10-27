import { fetchImages, fetchBreeds, PAGE_SIZE } from './api.js';
import { getFavorites, isFavorite, toggleFavorite } from './favorites.js';
import {
  createCard,
  setFavoriteButton,
  showLoading,
  showMessage,
  showError,
  clearStatus,
  openBreedModal,
} from './ui.js';

const el = {
  navButtons: document.querySelectorAll('.nav__btn'),
  favCount: document.querySelector('#fav-count'),
  viewGallery: document.querySelector('#view-gallery'),
  viewFavorites: document.querySelector('#view-favorites'),
  filters: document.querySelector('#filters'),
  breedSelect: document.querySelector('#breed-select'),
  gallery: document.querySelector('#gallery'),
  galleryStatus: document.querySelector('#gallery-status'),
  loadMore: document.querySelector('#load-more'),
  favorites: document.querySelector('#favorites'),
  favoritesEmpty: document.querySelector('#favorites-empty'),
  modal: document.querySelector('#breed-modal'),
};

const state = {
  page: 0,
  filters: { breedId: '', mimeTypes: '', onlyWithBreeds: true },
  images: new Map(), // imágenes cargadas en la galería, por id
  requestId: 0, // para descartar respuestas viejas si cambian los filtros
};

// ---------- Galería ----------

async function loadImages() {
  const requestId = ++state.requestId;
  el.loadMore.disabled = true;
  showLoading(el.galleryStatus);

  try {
    const images = await fetchImages({ page: state.page, ...state.filters });
    if (requestId !== state.requestId) return;

    clearStatus(el.galleryStatus);
    for (const image of images) {
      state.images.set(image.id, image);
      el.gallery.append(createCard(image, isFavorite(image.id)));
    }
    if (state.page === 0 && images.length === 0) {
      showMessage(el.galleryStatus, 'No hay gatos con estos filtros.');
    }
    el.loadMore.hidden = images.length < PAGE_SIZE;
    state.page++;
  } catch (error) {
    if (requestId !== state.requestId) return;
    showError(el.galleryStatus, error.message, loadImages);
  } finally {
    el.loadMore.disabled = false;
  }
}

function resetGallery() {
  state.page = 0;
  state.images.clear();
  el.gallery.replaceChildren();
  el.loadMore.hidden = true;
  loadImages();
}

// ---------- Filtros ----------

async function loadBreeds() {
  try {
    const breeds = await fetchBreeds();
    el.breedSelect.replaceChildren(new Option('Todas', ''));
    for (const breed of breeds) el.breedSelect.append(new Option(breed.name, breed.id));
    el.breedSelect.disabled = false;
  } catch {
    el.breedSelect.replaceChildren(new Option('No se pudieron cargar las razas', ''));
  }
}

el.filters.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(el.filters);
  state.filters = {
    breedId: data.get('breed') ?? '',
    mimeTypes: data.get('mime'),
    onlyWithBreeds: data.has('onlyWithBreeds'),
  };
  resetGallery();
});

// ---------- Favoritos ----------

function renderFavorites() {
  const favorites = getFavorites();
  el.favCount.textContent = favorites.length;
  el.favorites.replaceChildren(...favorites.map((fav) => createCard(fav, true)));
  el.favoritesEmpty.hidden = favorites.length > 0;

  for (const card of el.gallery.querySelectorAll('.card')) {
    setFavoriteButton(card, isFavorite(card.dataset.id));
  }
}

// Delegación de eventos: un solo listener por grilla
function handleCardClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = button.closest('.card').dataset.id;
  const image = state.images.get(id) ?? getFavorites().find((fav) => fav.id === id);

  if (button.dataset.action === 'info') openBreedModal(el.modal, image);
  if (button.dataset.action === 'favorite') {
    toggleFavorite(image);
    renderFavorites();
  }
}

el.gallery.addEventListener('click', handleCardClick);
el.favorites.addEventListener('click', handleCardClick);

// ---------- Navegación ----------

for (const button of el.navButtons) {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    el.viewGallery.hidden = view !== 'gallery';
    el.viewFavorites.hidden = view !== 'favorites';
    el.navButtons.forEach((b) => b.toggleAttribute('aria-current', b === button));
    button.setAttribute('aria-current', 'page');
  });
}

// ---------- Modal ----------

el.modal.querySelector('.modal__close').addEventListener('click', () => el.modal.close());
el.modal.addEventListener('click', (event) => {
  if (event.target === el.modal) el.modal.close(); // clic fuera del contenido
});

el.loadMore.addEventListener('click', loadImages);

// ---------- Inicio ----------

renderFavorites();
loadBreeds();
loadImages();
