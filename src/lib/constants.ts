
/**
 * Constantes de la aplicación TransporegistrosPlus
 */

export const APP_CONFIG = {
  name: 'TransporegistrosPlus',
  version: '1.0.0',
  description: 'Sistema integral de gestión de transportes para Colombia',
  author: 'TransporegistrosPlus Team',
  
  // URLs de la aplicación
  urls: {
    production: 'https://omaryesidvargas.github.io/transporegistrosplus',
    development: 'http://localhost:8080',
    current: import.meta.env.PROD 
      ? 'https://omaryesidvargas.github.io/transporegistrosplus'
      : 'http://localhost:8080'
  },
  
  // Configuración de Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://pwieabhoqzstiglmjmod.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aWVhYmhvcXpzdGlnbG1qbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTUzOTEsImV4cCI6MjA2MzM3MTM5MX0.BomWLRgOMMqGmxsIzrowSfmn8QA8Kj9Oit83rNOmh3I"
  },
  
  // Configuración de la aplicación
  settings: {
    defaultCurrency: 'COP',
    defaultLocale: 'es-CO',
    dateFormat: 'dd/MM/yyyy',
    timeZone: 'America/Bogota'
  }
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  VEHICLES: '/vehicles',
  TRIPS: '/trips',
  EXPENSES: '/expenses',
  TOLLS: '/tolls',
  TOLL_RECORDS: '/toll-records',
  REPORTS: '/reports',
  LOGIN: '/login',
  REGISTER: '/register'
} as const;

export const EXPENSE_CATEGORIES = [
  { value: 'fuel', label: 'Combustible' },
  { value: 'toll', label: 'Peaje' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'lodging', label: 'Alojamiento' },
  { value: 'food', label: 'Comida' },
  { value: 'other', label: 'Otros' }
] as const;

export const DOCUMENT_TYPES = [
  { value: 'cedula', label: 'Cédula de Ciudadanía' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' }
] as const;

export const VEHICLE_TYPES = [
  { value: 'camion', label: 'Camión' },
  { value: 'tractomula', label: 'Tractomula' },
  { value: 'furgon', label: 'Furgón' },
  { value: 'pickup', label: 'Camioneta' },
  { value: 'otro', label: 'Otro' }
] as const;
