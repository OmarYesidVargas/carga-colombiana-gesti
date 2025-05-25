import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Configuración para GitHub Pages - URL: https://omaryesidvargas.github.io/transporegistrosplus/
  base: mode === 'production' ? '/transporegistrosplus/' : '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Configuración del build para GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Genera sourcemaps para debugging en producción si es necesario
    sourcemap: false,
    // Optimización para GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
}));
