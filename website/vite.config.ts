import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project sites, set base to '/<repo-name>/'.
// Override at build time with: VITE_BASE=/your-repo/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
})
