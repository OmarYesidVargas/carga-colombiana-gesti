
/**
 * Constantes finales del proyecto TransporegistrosPlus
 * Versión 1.0.0 - Lista para producción
 */

export const PROJECT_INFO = {
  name: 'TransporegistrosPlus',
  version: '1.0.0',
  description: 'Sistema integral de gestión de transportes para Colombia',
  author: 'TransporegistrosPlus Team',
  repository: 'https://github.com/omaryesidvargas/transporegistrosplus',
  website: 'https://omaryesidvargas.github.io/transporegistrosplus/',
  support: 'support@transporegistrosplus.com'
} as const;

export const FEATURE_FLAGS = {
  // Características habilitadas en producción
  ENABLE_ADVANCED_DEBUGGING: false,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
  ENABLE_ANALYTICS: true,
  ENABLE_PWA: false, // Para futuras versiones
  ENABLE_OFFLINE_MODE: false, // Para futuras versiones
} as const;

export const LIMITS = {
  // Límites del sistema
  MAX_VEHICLES_PER_USER: 50,
  MAX_TRIPS_PER_MONTH: 1000,
  MAX_EXPENSES_PER_TRIP: 100,
  MAX_FILE_SIZE_MB: 10,
  MAX_PROFILE_IMAGE_SIZE_MB: 5,
  
  // Límites de interfaz
  ITEMS_PER_PAGE: 10,
  SEARCH_MIN_CHARACTERS: 2,
  DEBOUNCE_DELAY_MS: 300,
} as const;

export const VALIDATION_RULES = {
  // Reglas de validación
  PASSWORD_MIN_LENGTH: 8,
  PHONE_PATTERN: /^[+]?[1-9][\d\s\-\(\)]{8,15}$/,
  PLATE_PATTERN: /^[A-Z]{3}[0-9]{3}$|^[A-Z]{3}[0-9]{2}[A-Z]$/,
  DOCUMENT_PATTERNS: {
    cedula: /^[1-9]\d{6,9}$/,
    nit: /^[1-9]\d{8}-[0-9]$/,
    pasaporte: /^[A-Z0-9]{6,12}$/
  },
} as const;

export const UI_CONSTANTS = {
  // Constantes de interfaz
  ANIMATION_DURATION_MS: 200,
  TOAST_DURATION_MS: 4000,
  LOADING_TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

export const CACHE_SETTINGS = {
  // Configuración de cache
  PROFILE_CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutos
  VEHICLES_CACHE_DURATION_MS: 2 * 60 * 1000, // 2 minutos
  TRIPS_CACHE_DURATION_MS: 1 * 60 * 1000, // 1 minuto
  EXPENSES_CACHE_DURATION_MS: 30 * 1000, // 30 segundos
} as const;

export const ROUTES = {
  // Rutas de la aplicación
  HOME: '/',
  DASHBOARD: '/dashboard',
  VEHICLES: '/vehicles',
  TRIPS: '/trips',
  EXPENSES: '/expenses',
  REPORTS: '/reports',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  NOT_FOUND: '/404',
} as const;

export const LOCAL_STORAGE_KEYS = {
  // Claves de localStorage
  USER_PREFERENCES: 'transporegistros_user_preferences',
  FORM_DRAFTS: 'transporegistros_form_drafts',
  CACHED_DATA: 'transporegistros_cached_data',
  LAST_SYNC: 'transporegistros_last_sync',
  DEBUG_LOGS: 'transporegistros_debug_logs',
} as const;

/**
 * Configuración final del proyecto lista para producción
 * Todos los valores han sido optimizados para el mejor rendimiento
 */
export const PRODUCTION_CONFIG = {
  IS_PRODUCTION: import.meta.env.PROD,
  ENABLE_LOGGING: !import.meta.env.PROD,
  ENABLE_DEV_TOOLS: !import.meta.env.PROD,
  API_TIMEOUT_MS: 10000,
  MAX_CONCURRENT_REQUESTS: 5,
  ERROR_REPORTING_ENABLED: import.meta.env.PROD,
} as const;

// Función para verificar si una característica está habilitada
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
};

// Función para obtener límites según el tipo
export const getLimit = (limitType: keyof typeof LIMITS): number => {
  return LIMITS[limitType];
};

// Función para validar según tipo de documento
export const validateDocument = (type: string, value: string): boolean => {
  const pattern = VALIDATION_RULES.DOCUMENT_PATTERNS[type as keyof typeof VALIDATION_RULES.DOCUMENT_PATTERNS];
  return pattern ? pattern.test(value) : false;
};

console.log(`🚀 ${PROJECT_INFO.name} v${PROJECT_INFO.version} - Configuración cargada`);
console.log(`🌍 Modo: ${PRODUCTION_CONFIG.IS_PRODUCTION ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
console.log(`📊 Características habilitadas:`, Object.entries(FEATURE_FLAGS).filter(([_, enabled]) => enabled).map(([key]) => key));
