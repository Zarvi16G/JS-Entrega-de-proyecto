import { useEffect, useState } from 'react';
import { fetchBreeds } from '../api';
import type { Breed, RequestStatus } from '../types';

// ---------- useBreeds ----------
// Loads the list of breeds once, for the breed filter and to show breed names.
export function useBreeds() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [status, setStatus] = useState<RequestStatus>('loading');

  // Empty dependency array [] = run only once, when the component mounts
  useEffect(() => {
    const controller = new AbortController();
    fetchBreeds(controller.signal)
      .then((data) => {
        setBreeds(data);
        setStatus('success');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    // Cleanup: cancel the request if the component unmounts before it finishes
    return () => controller.abort();
  }, []);

  return { breeds, status };
}
