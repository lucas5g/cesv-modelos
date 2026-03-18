import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseUrl = env.BASE_URL_API

  return {
    envPrefix: ['VITE_', 'BASE_URL_API'],
    plugins: [react()],
    server: baseUrl
      ? {
          proxy: {
            '/scsdp': {
              target: baseUrl,
              changeOrigin: true,
              secure: true,
            },
            '/candidato': {
              target: baseUrl,
              changeOrigin: true,
              secure: true,
            },
          },
        }
      : undefined,
  }
})
