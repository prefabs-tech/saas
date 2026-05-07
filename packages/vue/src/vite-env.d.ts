/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnvironment;
}

interface ImportMetaEnvironment {
  readonly VITE_API_BASE_URL: string;
}
