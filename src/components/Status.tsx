import type { ReactNode } from 'react';

// Small components for the request states, reused across views.

// ---------- Loading ----------
// Spinner + text while a request is in progress.
// aria-live="polite" makes screen readers announce it without interrupting the user.
export function Loading() {
  return (
    <div className="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Loading cats…</p>
    </div>
  );
}

// ---------- ErrorMessage ----------
// Error text with a Retry button. role="alert" makes screen readers read it immediately.
export function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="status" role="alert">
      <p className="status__error">{message}</p>
      <button className="btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

// ---------- EmptyMessage ----------
// Neutral message for "nothing to show". ReactNode accepts text or any JSX as children.
export function EmptyMessage({ children }: { children: ReactNode }) {
  return <p className="status">{children}</p>;
}
