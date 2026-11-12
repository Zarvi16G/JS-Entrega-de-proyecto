import type { Filters, MimeFilter } from './types';

// Filters used on first load. Kept here so the form and the gallery start from the same values.
export const INITIAL_FILTERS: Filters = { breedId: '', mimeTypes: '', onlyWithBreeds: true };

// Image type options. Defined once and shared by the filters form and the active filters summary,
// so a label never says one thing in one place and something else in another.
// - value:   what is sent to the API (mime_types)
// - label:   main text shown to the user
// - formats: file formats shown underneath
export const MIME_OPTIONS: { value: MimeFilter; label: string; formats: string }[] = [
  { value: '', label: 'All', formats: 'JPG, PNG, GIF' },
  { value: 'jpg,png', label: 'Static', formats: 'JPG, PNG' },
  { value: 'gif', label: 'Animated', formats: 'GIF' },
];
