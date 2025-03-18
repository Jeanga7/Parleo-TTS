import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:5000", // Adresse du backend dans Docker
        changeOrigin: true,
        secure: false,
      },
      "/history": {
        target: "http://backend:5000", // Adresse du backend dans Docker
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});