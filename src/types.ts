// ---------- The Cat API responses ----------
// Only the fields we actually use. Optional (?) fields are not always sent by the API,
// so TypeScript forces us to check them before using them.

// A cat breed, as returned by /breeds and inside each image's `breeds` array
export interface Breed {
  id: string;
  name: string;
  origin?: string;
  temperament?: string;
  description?: string;
  life_span?: string;
  wikipedia_url?: string;
}

// One image from /images/search. `breeds` is empty or missing when the image has no breed info.
export interface CatImage {
  id: string;
  url: string;
  breeds?: Breed[];
}

// ---------- App state ----------

// Union type: only these three values are allowed. '' means "no filter" (all types).
export type MimeFilter = '' | 'jpg,png' | 'gif';

// Filters applied to the gallery. breedId '' means "all breeds".
export interface Filters {
  breedId: string;
  mimeTypes: MimeFilter;
  onlyWithBreeds: boolean;
}

// Adds/removes a favorite. `from` is the clicked button, used as the start point of the
// "flying heart" animation towards the Favorites tab.
export type ToggleFavorite = (image: CatImage, from?: HTMLElement) => void;

// Which page section is visible
export type View = 'gallery' | 'favorites';

// Lifecycle of any API request, used to decide what to render (spinner, error, content)
export type RequestStatus = 'loading' | 'success' | 'error';
