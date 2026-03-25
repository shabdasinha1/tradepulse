import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,

    proxy: {
      "/supplier-dir-int": {
        target: "https://kproxy.tradepulsehq.co.uk",
        changeOrigin: true,
        secure: false,
      },
      "/news-int": {
        target: "https://kproxy.tradepulsehq.co.uk",
        changeOrigin: true,
        secure: false,
      }
    }
  },

  css: {
    devSourcemap: true,
  },
})