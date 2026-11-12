import { useState, type FormEvent } from 'react';
import { MIME_OPTIONS } from '../constants';
import type { Breed, Filters, RequestStatus } from '../types';

interface Props {
  initialFilters: Filters;
  breeds: Breed[];
  breedsStatus: RequestStatus;
  onApply: (filters: Filters) => void;
}

// ---------- FiltersForm ----------
// Form to choose breed, image type and "only with breed info".
// Changes are kept in a local draft and only sent to the gallery on "Apply filters",
// so the API isn't called on every click.
export function FiltersForm({ initialFilters, breeds, breedsStatus: status, onApply }: Props) {
  const [draft, setDraft] = useState<Filters>(initialFilters);

  // preventDefault stops the browser from reloading the page on submit
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(draft);
  }

  return (
    <form className="filters" onSubmit={handleSubmit}>
      {/* ---------- Breed ----------
          Controlled select: its value always comes from the draft state.
          Disabled until the breed list has loaded. */}
      <label className="filters__field">
        Breed
        <select
          value={draft.breedId}
          disabled={status !== 'success'}
          onChange={(e) => setDraft({ ...draft, breedId: e.target.value })}
        >
          {status === 'loading' && <option value="">Loading breeds…</option>}
          {status === 'error' && <option value="">Could not load breeds</option>}
          {status === 'success' && (
            <>
              <option value="">All</option>
              {breeds.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
            </>
          )}
        </select>
      </label>

      {/* ---------- Image type ----------
          Radio buttons styled as cards: main label on top, file formats underneath.
          The selected one gets an extra class so the CSS can color it. */}
      <fieldset className="filters__field filters__group">
        <legend>Image type</legend>
        <div className="filters__options">
          {MIME_OPTIONS.map((option) => {
            const selected = draft.mimeTypes === option.value;
            return (
              <label key={option.value} className={`mime-option${selected ? ' mime-option--selected' : ''}`}>
                <input
                  type="radio"
                  name="mime"
                  checked={selected}
                  onChange={() => setDraft({ ...draft, mimeTypes: option.value })}
                />
                <span className="mime-option__label">{option.label}</span>
                <span className="mime-option__formats">({option.formats})</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* ---------- Only with breed info ----------
          Asks the API only for images that include breed data, so the info modal has content. */}
      <label className="filters__check">
        <input
          type="checkbox"
          checked={draft.onlyWithBreeds}
          onChange={(e) => setDraft({ ...draft, onlyWithBreeds: e.target.checked })}
        />
        Only with breed info
      </label>

      <button type="submit" className="btn">
        Apply filters
      </button>
    </form>
  );
}
