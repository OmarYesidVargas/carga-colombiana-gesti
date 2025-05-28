/**
 * Configuración de Vite para TransporegistrosPlus
 * 
 * Este archivo configura el bundler Vite para desarrollo y producción:
 * - Configuración específica para deployment en Vercel
 * - Optimizaciones de build para producción
 * - Aliases de rutas para imports limpios
 * - Plugins para desarrollo y calidad de código
 * - Configuración del servidor de desarrollo
 * 
 * Características especiales:
 * - Code splitting optimizado para mejor performance
 * - Sourcemaps configurables según ambiente
 * - Servidor con IPv6 y puerto personalizado
 * - Integración con herramientas de desarrollo
 * - Optimización de caching para assets
 * 
 * @author TransporegistrosPlus Team
 * @version 2.0.0
 * @lastModified 2025-05-28
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Configuración principal de Vite
 * Función que recibe el modo (development/production) y retorna la configuración
 * 
 * @param {Object} config - Objeto de configuración de Vite
 * @param {string} config.mode - Modo de ejecución ('development' | 'production')
 * @returns {Object} Configuración completa de Vite
 */
export default defineConfig(({ mode }) => ({
  /**
   * Base path para la aplicación
   * Configurado para Vercel deployment
   */
  base: '/',
  
  /**
   * Configuración del servidor de desarrollo
   * - host true permite conexiones desde cualquier IP (útil para testing en red)
   * - port 8080 para consistencia con otros proyectos
   * - Configuración de CORS para desarrollo
   */
  server: {
    host: true,
    port: 8080,
    cors: true,
    strictPort: true,
  },
  
  /**
   * Plugins de Vite para funcionalidades adicionales
   * - react-swc: Plugin oficial de React con SWC para mejor performance
   */
  plugins: [
    react(),
  ],
  
  /**
   * Configuración de resolución de módulos
   * Alias "@" apunta a "./src" para imports limpios
   * 
   * Permite imports como: import { Button } from "@/components/ui/button"
   * En lugar de: import { Button } from "../../components/ui/button"
   */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  /**
   * Configuración del build para producción
   * Optimizada especialmente para Vercel
   */
  build: {
    /** Directorio de salida del build */
    outDir: 'dist',
    
    /** Directorio para assets estáticos */
    assetsDir: 'assets',
    
    /** 
     * Sourcemaps habilitados solo en Vercel para debugging
     */
    sourcemap: process.env.VERCEL === '1',
    
    /** Optimizaciones de minificación */
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    
    /**
     * Configuración de Rollup para optimizaciones avanzadas
     * Code splitting optimizado para mejor caching y performance
     */
    rollupOptions: {
      output: {
        /**
         * Manual chunks para separar código por categorías
         * Mejora el caching del navegador y la carga inicial
         */
        manualChunks: {
          // Core libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI Components
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          
          // Data management
          data: ['@supabase/supabase-js', '@tanstack/react-query', 'zod'],
          
          // Utilities
          utils: ['date-fns', 'xlsx', 'recharts'],
          
          // Styling
          styles: ['class-variance-authority', 'clsx', 'tailwind-merge']
        },
        
        /**
         * Configuración de assets
         * - Naming consistente para mejor caching
         * - Tamaño máximo para inlining
         */
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
      },
    },
    
    /** 
     * Configuración de reportes de tamaño
     * Útil para monitorear el tamaño del bundle
     */
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  
  /**
   * Configuración de optimizaciones
   * Mejora el tiempo de build y la performance
   */
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'date-fns'
    ],
    exclude: ['@testing-library/jest-dom']
  },

  /**
   * Configuración para pruebas
   * Define globals y configuración de testing
   */
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts'],
    },
  },
}));
