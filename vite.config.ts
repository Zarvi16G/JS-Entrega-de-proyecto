import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config. defineConfig only adds autocompletion/type checking for the options.
export default defineConfig({
  // Adds JSX/TSX support and fast refresh (edits show up without reloading the page)
  plugins: [react()],
  // GitHub Pages serves the site at https://<user>.github.io/<repo>/,
  // so every asset path must start with the repo name
  base: '/JS-Entrega-de-proyecto/',
});
