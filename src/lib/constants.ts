
/**
 * Constantes globales de la aplicación TransporegistrosPlus
 * 
 * Este módulo centraliza todas las constantes de configuración para:
 * - Información general de la aplicación (nombre, versión, etc.)
 * - URLs de producción y desarrollo
 * - Configuración de Supabase
 * - Configuración internacional (múltiples países)
 * - Rutas de navegación
 * - Catálogos de datos globales (categorías, tipos, etc.)
 * 
 * Beneficios de centralización:
 * - Configuración única y consistente
 * - Fácil mantenimiento y actualizaciones
 * - Type safety con TypeScript
 * - Reutilización en toda la aplicación
 * - Soporte internacional
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
  description: 'Sistema integral de gestión de transportes internacional',
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
   * Configuración regional predeterminada (Colombia)
   * Configurable según el país del usuario
   */
  settings: {
    defaultCountry: 'CO',
    defaultCurrency: 'COP',
    defaultLocale: 'es-CO',
    dateFormat: 'dd/MM/yyyy',
    timeZone: 'America/Bogota',
    supportedLocales: ['es-CO', 'es-ES', 'en-US', 'pt-BR']
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
 * Categorías de gastos disponibles internacionalmente
 * Adaptadas para múltiples mercados de transporte
 */
export const EXPENSE_CATEGORIES = [
  { value: 'fuel', label: 'Combustible', labelEn: 'Fuel' },
  { value: 'toll', label: 'Peaje', labelEn: 'Toll' },
  { value: 'maintenance', label: 'Mantenimiento', labelEn: 'Maintenance' },
  { value: 'lodging', label: 'Alojamiento', labelEn: 'Lodging' },
  { value: 'food', label: 'Comida', labelEn: 'Food' },
  { value: 'insurance', label: 'Seguros', labelEn: 'Insurance' },
  { value: 'permits', label: 'Permisos', labelEn: 'Permits' },
  { value: 'parking', label: 'Estacionamiento', labelEn: 'Parking' },
  { value: 'fines', label: 'Multas', labelEn: 'Fines' },
  { value: 'other', label: 'Otros', labelEn: 'Other' }
] as const;

/**
 * Tipos de documento de identidad internacionales
 * Incluye documentos válidos en múltiples países
 */
export const DOCUMENT_TYPES = [
  // Colombia
  { value: 'cedula', label: 'Cédula de Ciudadanía', country: 'CO' },
  { value: 'cedula_extranjeria', label: 'Cédula de Extranjería', country: 'CO' },
  
  // Internacional
  { value: 'passport', label: 'Pasaporte', country: 'INTERNATIONAL' },
  { value: 'national_id', label: 'Documento Nacional de Identidad', country: 'INTERNATIONAL' },
  { value: 'driver_license', label: 'Licencia de Conducir', country: 'INTERNATIONAL' },
  
  // Estados Unidos
  { value: 'ssn', label: 'Social Security Number', country: 'US' },
  { value: 'ein', label: 'Employer Identification Number', country: 'US' },
  
  // México
  { value: 'curp', label: 'CURP', country: 'MX' },
  { value: 'rfc', label: 'RFC', country: 'MX' },
  
  // Brasil
  { value: 'cpf', label: 'CPF', country: 'BR' },
  { value: 'rg', label: 'RG', country: 'BR' },
  
  // Argentina
  { value: 'dni', label: 'DNI', country: 'AR' },
  { value: 'cuit', label: 'CUIT', country: 'AR' },
  
  // España
  { value: 'nie', label: 'NIE', country: 'ES' },
  { value: 'nif', label: 'NIF', country: 'ES' }
] as const;

/**
 * Tipos de vehículos de carga internacionales
 * Clasificación estándar para transporte de carga global
 */
export const VEHICLE_TYPES = [
  { value: 'truck', label: 'Camión', labelEn: 'Truck' },
  { value: 'semi_truck', label: 'Tractomula', labelEn: 'Semi Truck' },
  { value: 'van', label: 'Furgón', labelEn: 'Van' },
  { value: 'pickup', label: 'Camioneta', labelEn: 'Pickup Truck' },
  { value: 'trailer', label: 'Remolque', labelEn: 'Trailer' },
  { value: 'tanker', label: 'Cisterna', labelEn: 'Tanker' },
  { value: 'refrigerated', label: 'Refrigerado', labelEn: 'Refrigerated' },
  { value: 'flatbed', label: 'Plataforma', labelEn: 'Flatbed' },
  { value: 'container', label: 'Contenedor', labelEn: 'Container' },
  { value: 'bus', label: 'Autobús', labelEn: 'Bus' },
  { value: 'motorcycle', label: 'Motocicleta', labelEn: 'Motorcycle' },
  { value: 'other', label: 'Otro', labelEn: 'Other' }
] as const;

/**
 * Países soportados por la aplicación
 * Incluye información de configuración regional
 */
export const SUPPORTED_COUNTRIES = [
  {
    code: 'CO',
    name: 'Colombia',
    currency: 'COP',
    locale: 'es-CO',
    phonePrefix: '+57',
    timeZone: 'America/Bogota'
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    locale: 'en-US',
    phonePrefix: '+1',
    timeZone: 'America/New_York'
  },
  {
    code: 'MX',
    name: 'México',
    currency: 'MXN',
    locale: 'es-MX',
    phonePrefix: '+52',
    timeZone: 'America/Mexico_City'
  },
  {
    code: 'BR',
    name: 'Brasil',
    currency: 'BRL',
    locale: 'pt-BR',
    phonePrefix: '+55',
    timeZone: 'America/Sao_Paulo'
  },
  {
    code: 'AR',
    name: 'Argentina',
    currency: 'ARS',
    locale: 'es-AR',
    phonePrefix: '+54',
    timeZone: 'America/Argentina/Buenos_Aires'
  },
  {
    code: 'ES',
    name: 'España',
    currency: 'EUR',
    locale: 'es-ES',
    phonePrefix: '+34',
    timeZone: 'Europe/Madrid'
  }
] as const;

/**
 * Métodos de pago internacionales
 */
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Efectivo', labelEn: 'Cash' },
  { value: 'card', label: 'Tarjeta', labelEn: 'Card' },
  { value: 'electronic', label: 'Electrónico', labelEn: 'Electronic' },
  { value: 'tag', label: 'Tag / Telepeaje', labelEn: 'Electronic Tag' },
  { value: 'mobile', label: 'Pago Móvil', labelEn: 'Mobile Payment' },
  { value: 'bank_transfer', label: 'Transferencia', labelEn: 'Bank Transfer' },
  { value: 'check', label: 'Cheque', labelEn: 'Check' },
  { value: 'cryptocurrency', label: 'Criptomoneda', labelEn: 'Cryptocurrency' },
  { value: 'other', label: 'Otro', labelEn: 'Other' }
] as const;

/**
 * Tipos de combustible internacionales
 */
export const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasolina', labelEn: 'Gasoline' },
  { value: 'diesel', label: 'Diésel', labelEn: 'Diesel' },
  { value: 'gas', label: 'Gas Natural', labelEn: 'Natural Gas' },
  { value: 'lpg', label: 'GLP', labelEn: 'LPG' },
  { value: 'electric', label: 'Eléctrico', labelEn: 'Electric' },
  { value: 'hybrid', label: 'Híbrido', labelEn: 'Hybrid' },
  { value: 'hydrogen', label: 'Hidrógeno', labelEn: 'Hydrogen' },
  { value: 'biodiesel', label: 'Biodiésel', labelEn: 'Biodiesel' },
  { value: 'ethanol', label: 'Etanol', labelEn: 'Ethanol' }
] as const;

/**
 * Géneros con opciones inclusivas internacionales
 */
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino', labelEn: 'Male' },
  { value: 'female', label: 'Femenino', labelEn: 'Female' },
  { value: 'non_binary', label: 'No Binario', labelEn: 'Non-Binary' },
  { value: 'other', label: 'Otro', labelEn: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefiero no decir', labelEn: 'Prefer not to say' }
] as const;
