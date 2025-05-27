
/**
 * Utilidades para despliegue y configuración de producción de TransporegistrosPlus
 * 
 * Este módulo maneja toda la lógica relacionada con el deployment:
 * - Detección de entorno (desarrollo/producción/GitHub Pages)
 * - Configuración de URLs y paths según entorno
 * - Gestión de títulos de página dinámicos
 * - Configuración de Service Workers (PWA futuro)
 * - Inicialización de analytics y monitoreo
 * - Manejo global de errores en producción
 * 
 * Características especiales:
 * - Soporte nativo para GitHub Pages
 * - Configuración automática de basename para React Router
 * - Logging inteligente según entorno
 * - Preparado para futuras funcionalidades PWA
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { APP_CONFIG } from '@/lib/constants'

/**
 * Verifica si la aplicación está ejecutándose en producción
 * Utiliza variables de entorno de Vite para determinación
 * 
 * @returns {boolean} true si está en producción, false en desarrollo
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

/**
 * Verifica si estamos ejecutándose en GitHub Pages
 * Útil para configuraciones específicas de GitHub Pages
 * 
 * @returns {boolean} true si el hostname contiene 'github.io'
 */
export const isGitHubPages = (): boolean => {
  return window.location.hostname.includes('github.io')
}

/**
 * Obtiene la URL base de la aplicación según el entorno
 * Configuración automática para diferentes tipos de deployment
 * 
 * @returns {string} URL base completa de la aplicación
 * 
 * @example
 * // En GitHub Pages: 'https://omaryesidvargas.github.io/transporegistrosplus'
 * // En desarrollo: 'http://localhost:8080'
 */
export const getBaseUrl = (): string => {
  if (isGitHubPages()) {
    return 'https://omaryesidvargas.github.io/transporegistrosplus'
  }
  return APP_CONFIG.urls.current
}

/**
 * Obtiene el basename para React Router según el entorno
 * GitHub Pages requiere basename con nombre del repositorio
 * 
 * @returns {string} Basename para BrowserRouter
 * 
 * @example
 * // En desarrollo: ""
 * // En GitHub Pages: "/transporegistrosplus"
 * // En otros deployments de producción: ""
 */
export const getRouterBasename = (): string => {
  if (import.meta.env.DEV) {
    return ""
  }
  
  if (isGitHubPages()) {
    return "/transporegistrosplus"
  }
  
  return ""
}

/**
 * Configura el título de la página según el entorno
 * Añade indicadores de entorno para facilitar desarrollo
 * 
 * @param {string} [title] - Título específico de la página (opcional)
 * 
 * @example
 * setPageTitle() // "TransporegistrosPlus"
 * setPageTitle("Dashboard") // "Dashboard - TransporegistrosPlus"
 * setPageTitle("Dashboard") // "Dashboard - TransporegistrosPlus (Dev)" en desarrollo
 */
export const setPageTitle = (title?: string): void => {
  const appName = APP_CONFIG.name
  const environment = isProduction() ? '' : ' (Dev)'
  document.title = title ? `${title} - ${appName}${environment}` : `${appName}${environment}`
}

/**
 * Configuración de Service Worker para PWA (preparado para futuro)
 * Registra SW solo en producción para evitar problemas en desarrollo
 * 
 * @returns {Promise<void>} Promise que se resuelve cuando el SW está registrado
 * 
 * @example
 * await registerServiceWorker()
 * console.log('PWA configurada')
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && isProduction()) {
    try {
      const swUrl = isGitHubPages() 
        ? '/transporegistrosplus/sw.js' 
        : '/sw.js'
      await navigator.serviceWorker.register(swUrl)
      console.log('✅ Service Worker registrado correctamente')
    } catch (error) {
      console.warn('⚠️ Error al registrar Service Worker:', error)
    }
  }
}

/**
 * Configura analytics y métricas (placeholder para futuro)
 * Punto de integración para Google Analytics, Mixpanel, etc.
 * Solo se ejecuta en producción para evitar datos de desarrollo
 */
export const initializeAnalytics = (): void => {
  if (isProduction()) {
    // Aquí se puede integrar Google Analytics, Mixpanel, etc.
    console.log('📊 Analytics inicializado para producción')
  }
}

/**
 * Manejo de errores global para producción
 * Captura errores no manejados y promise rejections
 * Preparado para integración con servicios de monitoreo
 */
export const setupErrorHandling = (): void => {
  if (isProduction()) {
    /**
     * Captura errores JavaScript globales
     * Útil para detectar bugs en producción
     */
    window.addEventListener('error', (event) => {
      console.error('❌ Error global capturado:', event.error)
      // Aquí se puede enviar a un servicio de monitoreo como Sentry
    })
    
    /**
     * Captura promises rechazadas no manejadas
     * Previene silent failures en código asíncrono
     */
    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promise rechazada no manejada:', event.reason)
      // Aquí se puede enviar a un servicio de monitoreo
    })
  }
}

/**
 * Configuración inicial para el despliegue
 * Función principal que inicializa todas las configuraciones necesarias
 * Debe llamarse al inicio de la aplicación
 * 
 * Inicializa:
 * - Título de página
 * - Manejo de errores globales
 * - Analytics (si está configurado)
 * - Logs de información del entorno
 * - Optimizaciones para producción
 * 
 * @example
 * // En App.tsx o main.tsx
 * useEffect(() => {
 *   initializeApp()
 * }, [])
 */
export const initializeApp = (): void => {
  setPageTitle()
  setupErrorHandling()
  initializeAnalytics()
  
  // Logs de información útil para debugging
  console.log(`🚀 ${APP_CONFIG.name} v${APP_CONFIG.version} iniciado`)
  console.log('🌍 Entorno:', isProduction() ? 'PRODUCCIÓN' : 'DESARROLLO')
  console.log('📍 URL Base:', getBaseUrl())
  console.log('🔗 Router Basename:', getRouterBasename())
  console.log('📱 GitHub Pages:', isGitHubPages())
  
  /**
   * Optimización para producción: Desactivar logs de desarrollo
   * Solo en producción que no sea GitHub Pages (para mantener debugging en GH Pages)
   */
  if (isProduction() && !isGitHubPages()) {
    // Desactivar logs de desarrollo solo en producción que no sea GitHub Pages
    console.log = () => {}
    console.warn = () => {}
  }
}
