import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        configFile: true,
      },
    }),
    legacy({ targets: ['> 1% in CN', 'last 2 major versions', 'not dead'] }),
  ],
})
