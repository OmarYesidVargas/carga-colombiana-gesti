
/**
 * Configuración de Vite para TransporegistrosPlus
 * Optimizada para deployment en Vercel
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  /**
   * Base path para la aplicación - siempre raíz para Vercel
   */
  base: '/',
  
  /**
   * Configuración del servidor de desarrollo
   */
  server: {
    host: "::",
    port: 8080,
  },
  
  /**
   * Plugins de Vite
   */
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  
  /**
   * Configuración de resolución de módulos
   */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  /**
   * Configuración del build optimizada para Vercel
   */
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: mode === 'production' ? 'esbuild' : false,
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          query: ['@tanstack/react-query'],
          charts: ['recharts'],
        },
      },
    },
  },
  
  /**
   * Configuración de optimización de dependencias
   */
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'date-fns',
      'recharts',
    ],
  },
  
  /**
   * Variables de entorno para el build
   */
  define: {
    'process.env.VERCEL': JSON.stringify(process.env.VERCEL || ''),
  },
}));
