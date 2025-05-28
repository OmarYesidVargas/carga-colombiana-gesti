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
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:01:54
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
   * - react: Plugin oficial de React para mejor compatibilidad con Vercel
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
     * Sourcemaps habilitados solo en desarrollo o en Vercel
     */
    sourcemap: mode === 'development' || process.env.VERCEL === '1',
    
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
      external: ['next-themes'],
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
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-tooltip'
          ],
          
          // Data management
          data: [
            '@supabase/supabase-js', 
            '@tanstack/react-query', 
            'zod',
            '@hookform/resolvers',
            'react-hook-form'
          ],
          
          // Utilities
          utils: ['date-fns', 'xlsx', 'recharts', 'sonner'],
          
          // Styling
          styles: [
            'class-variance-authority', 
            'clsx', 
            'tailwind-merge',
            'tailwindcss-animate'
          ],

          // Theme management
          theme: ['next-themes']
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
      'date-fns',
      'next-themes',
      'sonner',
      '@hookform/resolvers/zod',
      'react-hook-form'
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

  /**
   * Configuración de tipos de TypeScript
   * Asegura que TypeScript reconozca correctamente los módulos
   */
  define: {
    'process.env': {},
  }
}));
