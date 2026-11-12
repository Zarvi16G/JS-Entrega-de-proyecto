import { MIME_OPTIONS } from '../constants';
import type { Breed, Filters } from '../types';

interface Props {
  filters: Filters;
  breeds: Breed[];
}

// ---------- ActiveFilters ----------
// Summary of the filters currently applied to the gallery (not the unsaved form draft),
// so the user always knows what the cats on screen correspond to.
export function ActiveFilters({ filters, breeds }: Props) {
  // Translate ids/values into readable names
  const breedName = breeds.find((breed) => breed.id === filters.breedId)?.name;
  const mime = MIME_OPTIONS.find((option) => option.value === filters.mimeTypes);

  // One text chip per filter
  const chips = [
    `Breed: ${filters.breedId ? (breedName ?? filters.breedId) : 'All'}`,
    `Type: ${mime?.label} (${mime?.formats})`,
  ];
  // With a breed selected, every image already has breed info, so this chip would be redundant
  if (filters.onlyWithBreeds && !filters.breedId) chips.push('Only with breed info');

  return (
    // aria-live makes screen readers announce the change when filters are applied
    <div className="active-filters" aria-live="polite">
      <span>Showing:</span>
      {chips.map((chip) => (
        <span key={chip} className="active-filters__chip">
          {chip}
        </span>
      ))}
    </div>
  );
}
