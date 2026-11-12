import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// Importing the SCSS here makes Vite compile it and inject it into the page
import './styles/main.scss';

// Mounts the React app inside <div id="root"> from index.html.
// The `!` tells TypeScript the element exists (getElementById could return null).
// StrictMode runs extra checks in development only (e.g. runs effects twice to catch bugs).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
