
/**
 * Configuración de Vite para TransporegistrosPlus
 * 
 * Este archivo configura el bundler Vite para desarrollo y producción:
 * - Configuración específica para deployment en GitHub Pages
 * - Optimizaciones de build para producción
 * - Aliases de rutas para imports limpios
 * - Plugins para desarrollo y calidad de código
 * - Configuración del servidor de desarrollo
 * 
 * Características especiales:
 * - Base path dinámico según entorno (GitHub Pages vs local)
 * - Code splitting optimizado para mejor performance
 * - Sourcemaps deshabilitados para producción
 * - Servidor con IPv6 y puerto personalizado
 * - Integración con herramientas de desarrollo
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
   * - Producción: '/transporegistrosplus/' para GitHub Pages
   * - Desarrollo: '/' para servidor local
   * 
   * GitHub Pages requiere el nombre del repositorio como base path
   */
  base: mode === 'production' ? '/transporegistrosplus/' : '/',
  
  /**
   * Configuración del servidor de desarrollo
   * - host "::" permite conexiones desde cualquier IP (útil para testing en red)
   * - port 8080 para consistencia con otros proyectos
   */
  server: {
    host: "::",
    port: 8080,
  },
  
  /**
   * Plugins de Vite para funcionalidades adicionales
   * - react(): Plugin oficial de React con SWC para mejor performance
   * - componentTagger(): Solo en desarrollo, para debugging de componentes
   */
  plugins: [
    react(),
    // Component tagger solo en desarrollo para evitar overhead en producción
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean), // Filtra plugins undefined/false
  
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
   * Optimizada especialmente para GitHub Pages
   */
  build: {
    /** Directorio de salida del build */
    outDir: 'dist',
    /** Directorio para assets estáticos */
    assetsDir: 'assets',
    /** 
     * Sourcemaps deshabilitados para reducir tamaño del bundle
     * Cambiar a true si se necesita debugging en producción
     */
    sourcemap: false,
    
    /**
     * Configuración de Rollup para optimizaciones avanzadas
     * Code splitting manual para mejor cache y performance
     */
    rollupOptions: {
      output: {
        /**
         * Manual chunks para separar vendor code del código de la app
         * Mejora el caching del navegador ya que vendor code cambia menos
         */
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
}));
