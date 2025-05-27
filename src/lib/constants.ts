
/**
 * Constantes globales de la aplicación TransporegistrosPlus
 * 
 * Este módulo centraliza todas las constantes de configuración para:
 * - Información general de la aplicación (nombre, versión, etc.)
 * - URLs de producción y desarrollo
 * - Configuración de Supabase
 * - Configuración regional (Colombia)
 * - Rutas de navegación
 * - Catálogos de datos (categorías, tipos, etc.)
 * 
 * Beneficios de centralización:
 * - Configuración única y consistente
 * - Fácil mantenimiento y actualizaciones
 * - Type safety con TypeScript
 * - Reutilización en toda la aplicación
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

/**
 * Configuración principal de la aplicación
 * Incluye metadatos, URLs y configuración de servicios externos
 */
export const APP_CONFIG = {
  /** Información básica de la aplicación */
  name: 'TransporegistrosPlus',
  version: '1.0.0',
  description: 'Sistema integral de gestión de transportes para Colombia',
  author: 'TransporegistrosPlus Team',
  
  /** 
   * URLs de la aplicación según entorno
   * - production: URL de GitHub Pages
   * - development: URL local de desarrollo
   * - current: URL actual según NODE_ENV
   */
  urls: {
    production: 'https://omaryesidvargas.github.io/transporegistrosplus',
    development: 'http://localhost:8080',
    current: import.meta.env.PROD 
      ? 'https://omaryesidvargas.github.io/transporegistrosplus'
      : 'http://localhost:8080'
  },
  
  /** 
   * Configuración de Supabase
   * Lee de variables de entorno con fallbacks para desarrollo
   */
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://pwieabhoqzstiglmjmod.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aWVhYmhvcXpzdGlnbG1qbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTUzOTEsImV4cCI6MjA2MzM3MTM5MX0.BomWLRgOMMqGmxsIzrowSfmn8QA8Kj9Oit83rNOmh3I"
  },
  
  /** 
   * Configuración regional para Colombia
   * Formatos de fecha, moneda y zona horaria
   */
  settings: {
    defaultCurrency: 'COP',
    defaultLocale: 'es-CO',
    dateFormat: 'dd/MM/yyyy',
    timeZone: 'America/Bogota'
  }
} as const;

/**
 * Rutas de navegación de la aplicación
 * Centraliza todas las rutas para consistencia y fácil mantenimiento
 */
export const ROUTES = {
  /** Páginas públicas */
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  /** Páginas protegidas - Require autenticación */
  DASHBOARD: '/dashboard',
  VEHICLES: '/vehicles',
  TRIPS: '/trips',
  EXPENSES: '/expenses',
  TOLLS: '/tolls',
  TOLL_RECORDS: '/toll-records',
  REPORTS: '/reports'
} as const;

/**
 * Categorías de gastos disponibles en el sistema
 * Adaptadas para el mercado colombiano de transporte
 */
export const EXPENSE_CATEGORIES = [
  { value: 'fuel', label: 'Combustible' },
  { value: 'toll', label: 'Peaje' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'lodging', label: 'Alojamiento' },
  { value: 'food', label: 'Comida' },
  { value: 'other', label: 'Otros' }
] as const;

/**
 * Tipos de documento de identidad válidos en Colombia
 * Según normativa colombiana vigente
 */
export const DOCUMENT_TYPES = [
  { value: 'cedula', label: 'Cédula de Ciudadanía' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' }
] as const;

/**
 * Tipos de vehículos de carga colombianos
 * Clasificación estándar para transporte de carga
 */
export const VEHICLE_TYPES = [
  { value: 'camion', label: 'Camión' },
  { value: 'tractomula', label: 'Tractomula' },
  { value: 'furgon', label: 'Furgón' },
  { value: 'pickup', label: 'Camioneta' },
  { value: 'otro', label: 'Otro' }
] as const;
