import type { Breed, CatImage, Filters } from './types';

// ---------- Config ----------
// Vite replaces import.meta.env.VITE_* with the real value at build time
// (from .env locally, from the repo secret on GitHub).
const BASE_URL = 'https://api.thecatapi.com/v1';
// const API_KEY = import.meta.env.VITE_CAT_API_KEY;
const API_KEY = "live_YAUugKou1QLszj5aKm9vTNQ7dXFvQr22r9PjltrNAFHmQu310YESwQ2NUzWrVtXF"
export const PAGE_SIZE = 9;

// ---------- ApiError ----------
// Custom error that also carries the HTTP status code.
// A plain Error only has a message; this lets callers know *what* failed (e.g. 401 vs 429).
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// ---------- messageForStatus ----------
// Turns an HTTP status code into a message the user can understand,
// instead of showing raw codes like "429".
function messageForStatus(status: number): string {
  if (status === 401 || status === 403) return 'The API key is not valid.';
  if (status === 429) return 'Too many requests. Wait a moment and try again.';
  if (status >= 500) return 'The Cat API is not responding. Try again later.';
  return `Something went wrong (code ${status}).`;
}

// Query params: an object with string keys and string/number/undefined values
type Params = Record<string, string | number | undefined>;

// ---------- request ----------
// The only function that talks to the API. Every endpoint goes through here,
// so the URL building, the API key and error handling live in one place.
// <T> is a generic: the caller says what type the JSON is (e.g. request<Breed[]>).
async function request<T>(path: string, params: Params = {}, signal?: AbortSignal): Promise<T> {
  // Build the URL, skipping empty params so we don't send things like "breed_ids="
  const url = new URL(BASE_URL + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== undefined) url.searchParams.set(key, String(value));
  }

  // fetch only throws when there is no connection (or the request is aborted).
  // A 404 or 500 does NOT throw, that's checked below with response.ok.
  let response: Response;
  try {
    response = await fetch(url, { headers: { 'x-api-key': API_KEY }, signal });
  } catch (error) {
    if (signal?.aborted) throw error; // request cancelled on purpose, not a network failure
    throw new ApiError('No connection. Check your network and try again.', 0);
  }

  // response.ok is true only for status 200-299
  if (!response.ok) throw new ApiError(messageForStatus(response.status), response.status);

  // `as Promise<T>` tells TypeScript to trust the shape; it does not validate the data
  return response.json() as Promise<T>;
}

// ---------- Endpoints ----------
// Small wrappers that translate our app's names (breedId) to the API's names (breed_ids),
// so components never need to know how the API works.

// One page of cat images matching the filters
export function fetchImages(page: number, filters: Filters, signal?: AbortSignal) {
  return request<CatImage[]>(
    '/images/search',
    {
      limit: PAGE_SIZE,
      page,
      order: 'ASC', // stable order so loading more never repeats images
      breed_ids: filters.breedId,
      mime_types: filters.mimeTypes,
      has_breeds: filters.onlyWithBreeds ? 1 : undefined,
    },
    signal
  );
}

// Every breed, used to fill the breed <select>
export function fetchBreeds(signal?: AbortSignal) {
  return request<Breed[]>('/breeds', {}, signal);
}
