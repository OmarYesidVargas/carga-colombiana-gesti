
/**
 * Constantes globales para TransporegistrosPlus
 * Configuración centralizada de la aplicación
 */

export const APP_CONFIG = {
  name: 'TransporegistrosPlus',
  version: '1.0.0',
  description: 'Sistema integral de gestión de transportes',
  author: 'TransporegistrosPlus Team',
  urls: {
    current: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080',
    github: 'https://github.com/omaryesidvargas/transporegistrosplus',
    docs: 'https://docs.transporegistrosplus.com'
  }
};

export const FUEL_TYPES = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'diesel', label: 'Diésel' },
  { value: 'gas', label: 'Gas Natural' },
  { value: 'electrico', label: 'Eléctrico' },
  { value: 'hibrido', label: 'Híbrido' }
] as const;

export const EXPENSE_CATEGORIES = [
  { value: 'combustible', label: 'Combustible', color: '#ef4444' },
  { value: 'peajes', label: 'Peajes', color: '#f97316' },
  { value: 'mantenimiento', label: 'Mantenimiento', color: '#eab308' },
  { value: 'alimentacion', label: 'Alimentación', color: '#22c55e' },
  { value: 'hospedaje', label: 'Hospedaje', color: '#3b82f6' },
  { value: 'multas', label: 'Multas', color: '#8b5cf6' },
  { value: 'otros', label: 'Otros', color: '#6b7280' }
] as const;

export const VEHICLE_CAPACITIES = [
  { value: '1-3 ton', label: '1-3 Toneladas' },
  { value: '3-5 ton', label: '3-5 Toneladas' },
  { value: '5-10 ton', label: '5-10 Toneladas' },
  { value: '10+ ton', label: 'Más de 10 Toneladas' },
  { value: 'pasajeros', label: 'Pasajeros' }
] as const;

export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  displayWithTime: 'dd/MM/yyyy HH:mm',
  iso: 'yyyy-MM-dd',
  database: 'yyyy-MM-dd HH:mm:ss'
} as const;

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100]
} as const;

export const VALIDATION_RULES = {
  minYear: 1990,
  maxYear: new Date().getFullYear() + 1,
  maxDistance: 10000,
  maxAmount: 999999999,
  minPlateLength: 6,
  maxPlateLength: 7
} as const;
