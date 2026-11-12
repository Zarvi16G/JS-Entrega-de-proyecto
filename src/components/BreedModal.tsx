import { useEffect, useRef, type ReactNode } from 'react';
import type { Breed, CatImage } from '../types';

interface Props {
  image: CatImage | null; // null = modal closed
  onClose: () => void;
}

// ---------- breedRows ----------
// Builds the [label, value] rows of the details table.
// Each field is optional in the API, so a row is only added if the value exists.
function breedRows(breed: Breed): [string, ReactNode][] {
  const rows: [string, ReactNode][] = [];
  if (breed.origin) rows.push(['Origin', breed.origin]);
  if (breed.life_span) rows.push(['Life span', `${breed.life_span} years`]);
  if (breed.temperament) {
    // "Active, Energetic, Independent" → one tag per trait, easier to scan than a long sentence
    const traits = breed.temperament.split(',').map((trait) => trait.trim());
    rows.push([
      'Temperament',
      <ul className="tag-list">
        {traits.map((trait) => (
          <li key={trait}>{trait}</li>
        ))}
      </ul>,
    ]);
  }
  return rows;
}

// ---------- BreedModal ----------
// Popup with the breed details of an image (origin, temperament, life span...).
// Uses the native <dialog> element, which gives us the backdrop, focus trapping
// and closing with Esc without extra code.
export function BreedModal({ image, onClose }: Props) {
  // useRef gives direct access to the <dialog> DOM element, needed to call showModal()/close()
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Syncs React state with the <dialog>: open when there's an image, close when there isn't
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (image && !dialog.open) dialog.showModal();
    if (!image && dialog.open) dialog.close();
  }, [image]);

  // Images can list several breeds; the first one is enough for the details
  const breed = image?.breeds?.[0];

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      // fires on every way of closing (Esc, ✕, backdrop) so App can reset selectedImage
      onClose={onClose}
      // the <dialog> has no padding, so a click on the element itself is a click on the backdrop
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
    >
      {image && (
        <>
          <button className="modal__close" aria-label="Close" onClick={() => dialogRef.current?.close()}>
            ✕
          </button>
          <img className="modal__img" src={image.url} alt={breed ? `${breed.name} cat` : 'Cat photo'} />

          <div className="modal__body">
            {!breed ? (
              <p className="modal__empty">No breed information available for this image.</p>
            ) : (
              <>
                <h2 className="modal__title">{breed.name}</h2>

                {/* Minimal table: label column on the left, value on the right.
                    <th scope="row"> tells screen readers each label describes its row. */}
                <table className="breed-table">
                  <tbody>
                    {breedRows(breed).map(([label, value]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {breed.description && <p className="modal__description">{breed.description}</p>}

                {/* rel="noopener" stops the new tab from accessing this page (security) */}
                {breed.wikipedia_url && (
                  <a className="modal__link" href={breed.wikipedia_url} target="_blank" rel="noopener">
                    Read more on Wikipedia →
                  </a>
                )}
              </>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
