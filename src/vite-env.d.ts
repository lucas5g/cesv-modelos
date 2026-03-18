/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
