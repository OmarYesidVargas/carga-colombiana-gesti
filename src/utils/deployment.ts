
/**
 * Utilidades para despliegue y configuración de producción de TransporegistrosPlus
 * Versión 2.0.0 - Optimizada para Vercel y otros providers
 * 
 * @author TransporegistrosPlus Team
 * @version 2.0.0
 */

import { APP_CONFIG } from '@/lib/constants'

/**
 * Verifica si la aplicación está ejecutándose en producción
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

/**
 * Verifica si estamos ejecutándose en Vercel
 */
export const isVercel = (): boolean => {
  return typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') ||
    import.meta.env.VITE_VERCEL === '1' ||
    process.env.VERCEL === '1'
  )
}

/**
 * Verifica si estamos ejecutándose en GitHub Pages
 */
export const isGitHubPages = (): boolean => {
  return typeof window !== 'undefined' && window.location.hostname.includes('github.io')
}

/**
 * Obtiene la URL base de la aplicación según el entorno
 */
export const getBaseUrl = (): string => {
  if (isVercel()) {
    return window.location.origin
  }
  
  if (isGitHubPages()) {
    return 'https://omaryesidvargas.github.io/transporegistrosplus'
  }
  
  return APP_CONFIG.urls.current
}

/**
 * Obtiene el basename para React Router según el entorno
 */
export const getRouterBasename = (): string => {
  if (import.meta.env.DEV) {
    return ""
  }
  
  if (isVercel()) {
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
 * Configuración de Service Worker para PWA (preparado para futuro)
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && isProduction()) {
    try {
      let swUrl = '/sw.js'
      
      if (isGitHubPages()) {
        swUrl = '/transporegistrosplus/sw.js'
      }
      
      await navigator.serviceWorker.register(swUrl)
      if (import.meta.env.DEV) {
        console.log('✅ Service Worker registrado correctamente')
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Error al registrar Service Worker:', error)
      }
    }
  }
}

/**
 * Configura analytics y métricas (placeholder para futuro)
 */
export const initializeAnalytics = (): void => {
  if (isProduction()) {
    // Aquí se puede integrar Google Analytics, Mixpanel, etc.
    if (import.meta.env.DEV) {
      console.log('📊 Analytics inicializado para producción')
    }
  }
}

/**
 * Manejo de errores global para producción
 */
export const setupErrorHandling = (): void => {
  if (isProduction()) {
    /**
     * Captura errores JavaScript globales
     */
    window.addEventListener('error', (event) => {
      // En producción, enviar a servicio de monitoreo
      if (import.meta.env.DEV) {
        console.error('❌ Error global capturado:', event.error)
      }
    })
    
    /**
     * Captura promises rechazadas no manejadas
     */
    window.addEventListener('unhandledrejection', (event) => {
      // En producción, enviar a servicio de monitoreo
      if (import.meta.env.DEV) {
        console.error('❌ Promise rechazada no manejada:', event.reason)
      }
    })
  }
}

/**
 * Configuración inicial optimizada para el despliegue
 */
export const initializeApp = (): void => {
  setPageTitle()
  setupErrorHandling()
  initializeAnalytics()
  
  // Logs de información solo en desarrollo
  if (import.meta.env.DEV) {
    console.log(`🚀 ${APP_CONFIG.name} v${APP_CONFIG.version} iniciado`)
    console.log('🌍 Entorno:', isProduction() ? 'PRODUCCIÓN' : 'DESARROLLO')
    console.log('📍 URL Base:', getBaseUrl())
    console.log('🔗 Router Basename:', getRouterBasename())
    console.log('🔗 Vercel:', isVercel())
    console.log('📱 GitHub Pages:', isGitHubPages())
  }
}
