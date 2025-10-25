import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite-Konfiguration, die zwei HTML-Einstiegspunkte baut:
// 1. index.html  (Hauptseite)
// 2. public/overlay.html  (Overlay-Seite)
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        overlay: 'public/overlay.html',
      },
    },
  },
})
