import { API_KEY } from './config.js';

const BASE_URL = 'https://api.thecatapi.com/v1';
export const PAGE_SIZE = 9;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function messageForStatus(status) {
  if (status === 401 || status === 403) return 'La API key no es válida.';
  if (status === 429) return 'Demasiadas peticiones. Espera un momento e inténtalo de nuevo.';
  if (status >= 500) return 'The Cat API no está respondiendo. Inténtalo más tarde.';
  return `Algo salió mal (código ${status}).`;
}

async function request(path, params = {}) {
  const url = new URL(BASE_URL + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value != null) url.searchParams.set(key, value);
  }

  let response;
  try {
    response = await fetch(url, { headers: { 'x-api-key': API_KEY } });
  } catch {
    // fetch solo lanza error si no hay conexión (o CORS)
    throw new ApiError('No hay conexión. Revisa tu red e inténtalo de nuevo.', 0);
  }

  if (!response.ok) throw new ApiError(messageForStatus(response.status), response.status);
  return response.json();
}

export function fetchImages({ page, breedId, mimeTypes, onlyWithBreeds }) {
  return request('/images/search', {
    limit: PAGE_SIZE,
    page,
    order: 'ASC', // orden estable para que "Ver más" no repita imágenes
    breed_ids: breedId,
    mime_types: mimeTypes,
    has_breeds: onlyWithBreeds ? 1 : '',
  });
}

export function fetchBreeds() {
  return request('/breeds');
}
