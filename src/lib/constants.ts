
/**
 * Constantes globales para TransporegistrosPlus
 * Configuraciones y datos estáticos del sistema
 */

import { CountryInfo, DocumentType, GenderOption } from '@/types';

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'TransporegistrosPlus',
  version: '2.0.0',
  description: 'Sistema integral de gestión de transportes',
  author: 'TransporegistrosPlus Team',
  urls: {
    current: 'https://omaryesidvargas.github.io/transporegistrosplus',
    github: 'https://github.com/omaryesidvargas/transporegistrosplus',
    docs: 'https://docs.transporegistrosplus.com'
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://pwieabhoqzstiglmjmod.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aWVhYmhvcXpzdGlnbG1qbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTUzOTEsImV4cCI6MjA2MzM3MTM5MX0.BomWLRgOMMqGmxsIzrowSfmn8QA8Kj9Oit83rNOmh3I'
  }
};

// Categorías de gastos con colores
export const EXPENSE_CATEGORIES = [
  { value: 'fuel', label: 'Combustible', color: '#ef4444', icon: '⛽' },
  { value: 'toll', label: 'Peajes', color: '#f97316', icon: '🛣️' },
  { value: 'maintenance', label: 'Mantenimiento', color: '#eab308', icon: '🔧' },
  { value: 'lodging', label: 'Hospedaje', color: '#3b82f6', icon: '🏨' },
  { value: 'food', label: 'Alimentación', color: '#22c55e', icon: '🍽️' },
  { value: 'other', label: 'Otros', color: '#6b7280', icon: '📋' }
] as const;

// Tipos de combustible
export const FUEL_TYPES = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'diesel', label: 'Diésel' },
  { value: 'gas', label: 'Gas Natural' },
  { value: 'electrico', label: 'Eléctrico' },
  { value: 'hibrido', label: 'Híbrido' }
] as const;

// Métodos de pago para peajes
export const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'electrónico', label: 'Electrónico' },
  { value: 'tag', label: 'Tag / Telepeaje' }
] as const;

// Categorías de vehículos para peajes
export const TOLL_CATEGORIES = [
  { value: 'liviano', label: 'Liviano' },
  { value: 'pesado', label: 'Pesado' },
  { value: 'motocicleta', label: 'Motocicleta' },
  { value: 'especial', label: 'Especial' }
] as const;

// Configuración de paginación
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxVisiblePages: 5
} as const;

// Límites del sistema
export const SYSTEM_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxVehicles: 100,
  maxTripsPerVehicle: 1000,
  maxExpensesPerTrip: 100,
  maxNotesLength: 500
} as const;

// Configuración de fechas
export const DATE_CONFIG = {
  defaultFormat: 'yyyy-MM-dd',
  displayFormat: 'dd/MM/yyyy',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  minYear: 1950,
  maxFutureYears: 5
} as const;

// Datos para validaciones internacionales
export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    code: 'CO',
    name: 'Colombia',
    currency: 'COP',
    phonePrefix: '+57',
    locale: 'es-CO',
    timeZone: 'America/Bogota'
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    currency: 'USD', 
    phonePrefix: '+1',
    locale: 'en-US',
    timeZone: 'America/New_York'
  },
  {
    code: 'MX',
    name: 'México',
    currency: 'MXN',
    phonePrefix: '+52',
    locale: 'es-MX',
    timeZone: 'America/Mexico_City'
  },
  {
    code: 'ES',
    name: 'España',
    currency: 'EUR',
    phonePrefix: '+34',
    locale: 'es-ES', 
    timeZone: 'Europe/Madrid'
  },
  {
    code: 'AR',
    name: 'Argentina',
    currency: 'ARS',
    phonePrefix: '+54',
    locale: 'es-AR',
    timeZone: 'America/Argentina/Buenos_Aires'
  }
];

export const DOCUMENT_TYPES: DocumentType[] = [
  { value: 'cedula', label: 'Cédula de Ciudadanía', country: 'CO' },
  { value: 'cedula_extranjeria', label: 'Cédula de Extranjería', country: 'CO' },
  { value: 'passport', label: 'Pasaporte', country: 'INTERNATIONAL' },
  { value: 'driver_license', label: 'Licencia de Conducir', country: 'INTERNATIONAL' },
  { value: 'tax_id', label: 'ID Fiscal/Tributario', country: 'INTERNATIONAL' },
  { value: 'social_security', label: 'Seguro Social', country: 'US' },
  { value: 'curp', label: 'CURP', country: 'MX' },
  { value: 'rfc', label: 'RFC', country: 'MX' },
  { value: 'dni', label: 'DNI', country: 'ES' },
  { value: 'nie', label: 'NIE', country: 'ES' }
];

export const GENDER_OPTIONS: GenderOption[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' }
];

// Configuración regional por defecto
export const DEFAULT_REGIONAL_CONFIG = {
  country: 'CO',
  language: 'es',
  currency: 'COP',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: '24h',
  timezone: 'America/Bogota'
} as const;

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  defaultDaysBeforeExpiry: 30,
  reminderDays: [30, 15, 7, 1],
  enabledByDefault: true
} as const;

// Tipos de documentos vehiculares para Colombia
export const VEHICLE_DOCUMENT_TYPES = [
  { value: 'soat', label: 'SOAT', required: true },
  { value: 'techno', label: 'Tecnomecánica', required: true },
  { value: 'tarjeta_propiedad', label: 'Tarjeta de Propiedad', required: false }
] as const;
