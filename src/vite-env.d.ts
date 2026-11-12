/// <reference types="vite/client" />

// Declares the env variables we use, so import.meta.env.VITE_CAT_API_KEY
// is typed as a string instead of "any". Only VITE_* variables reach the browser.
interface ImportMetaEnv {
  readonly VITE_CAT_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
