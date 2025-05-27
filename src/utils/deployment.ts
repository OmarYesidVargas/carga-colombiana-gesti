
/**
 * Utilidades para el despliegue y configuración de producción
 */

import { APP_CONFIG } from '@/lib/constants'

/**
 * Verifica si la aplicación está ejecutándose en producción
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

/**
 * Verifica si estamos en GitHub Pages
 */
export const isGitHubPages = (): boolean => {
  return window.location.hostname.includes('github.io')
}

/**
 * Obtiene la URL base de la aplicación según el entorno
 */
export const getBaseUrl = (): string => {
  if (isGitHubPages()) {
    return 'https://omaryesidvargas.github.io/transporegistrosplus'
  }
  return APP_CONFIG.urls.current
}

/**
 * Obtiene el basename para React Router
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
 */
export const setPageTitle = (title?: string): void => {
  const appName = APP_CONFIG.name
  const environment = isProduction() ? '' : ' (Dev)'
  document.title = title ? `${title} - ${appName}${environment}` : `${appName}${environment}`
}

/**
 * Configuración de Service Worker para PWA (futuro)
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
 */
export const initializeAnalytics = (): void => {
  if (isProduction()) {
    // Aquí se puede integrar Google Analytics, Mixpanel, etc.
    console.log('📊 Analytics inicializado para producción')
  }
}

/**
 * Manejo de errores global para producción
 */
export const setupErrorHandling = (): void => {
  if (isProduction()) {
    window.addEventListener('error', (event) => {
      console.error('❌ Error global capturado:', event.error)
      // Aquí se puede enviar a un servicio de monitoreo como Sentry
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promise rechazada no manejada:', event.reason)
      // Aquí se puede enviar a un servicio de monitoreo
    })
  }
}

/**
 * Configuración inicial para el despliegue
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
  
  if (isProduction() && !isGitHubPages()) {
    // Desactivar logs de desarrollo solo en producción que no sea GitHub Pages
    console.log = () => {}
    console.warn = () => {}
  }
}
