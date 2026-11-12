import { useCatImages } from '../hooks/useCatImages';
import { useBreeds } from '../hooks/useBreeds';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { INITIAL_FILTERS } from '../constants';
import { FiltersForm } from './FiltersForm';
import { ActiveFilters } from './ActiveFilters';
import { CatGrid } from './CatGrid';
import { EmptyMessage, ErrorMessage, Loading } from './Status';
import type { Breed, CatImage, ToggleFavorite, Filters } from '../types';

// ---------- emptyMessage ----------
// Picks the message shown when a search returns no cats.
// If only the breed is filtered (image type "All"), what's missing is data for that breed;
// with more filters combined, it may just be the combination that has no results.
function emptyMessage(filters: Filters, breeds: Breed[]): string {
  if (filters.breedId && filters.mimeTypes === '') {
    const breedName = breeds.find((breed) => breed.id === filters.breedId)?.name ?? 'this breed';
    return `No data available for the ${breedName} breed.`;
  }
  return 'No cats match these filters.';
}

interface Props {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: ToggleFavorite;
  onShowInfo: (image: CatImage) => void;
}

// ---------- GalleryView ----------
// Main page: filters, the grid of cats and the loading/error/empty states.
// The data logic lives in the hooks; this component only decides what to show.
export function GalleryView({ isFavorite, onToggleFavorite, onShowInfo }: Props) {
  const { images, status, error, hasMore, filters, applyFilters, loadMore, retry } = useCatImages(INITIAL_FILTERS);
  // Breeds are loaded here (not in the form) because both the form and the messages need them
  const { breeds, status: breedsStatus } = useBreeds();

  // Infinite scroll: paused while loading or after an error, so a failed page isn't skipped
  const sentinelRef = useInfiniteScroll<HTMLDivElement>(loadMore, hasMore && status === 'success');

  return (
    <section>
      <FiltersForm
        initialFilters={INITIAL_FILTERS}
        breeds={breeds}
        breedsStatus={breedsStatus}
        onApply={applyFilters}
      />
      <ActiveFilters filters={filters} breeds={breeds} />

      <CatGrid images={images} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} onShowInfo={onShowInfo} />

      {/* Only one of these states is visible at a time, depending on the request status */}
      {status === 'loading' && <Loading />}
      {status === 'error' && <ErrorMessage message={error} onRetry={retry} />}
      {status === 'success' && images.length === 0 && <EmptyMessage>{emptyMessage(filters, breeds)}</EmptyMessage>}

      {/* invisible element at the end of the list; reaching it triggers the next page */}
      <div ref={sentinelRef} />

      {/* manual fallback for infinite scroll; hidden on error so recovery goes through "Retry" */}
      {hasMore && status !== 'error' && (
        <div className="center">
          <button className="btn" onClick={loadMore} disabled={status === 'loading'}>
            Load more
          </button>
        </div>
      )}
    </section>
  );
}
