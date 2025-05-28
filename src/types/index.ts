/**
 * Tipos globales para TransporegistrosPlus
 * 
 * Este archivo contiene todas las interfaces y tipos necesarios
 * para la aplicación, incluyendo entidades de negocio, DTOs,
 * y tipos de utilidad.
 * 
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:39:35
 */

// Tipos para Autenticación
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  empresa?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'supervisor' | 'operador' | 'cliente';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error?: string;
}

// Tipos para Vehículos
export interface Vehicle {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  año: number;
  tipo: VehicleType;
  capacidad: number;
  estado: VehicleStatus;
  conductor?: Driver;
  documentos: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export type VehicleType = 'camion' | 'tractomula' | 'furgon' | 'pickup' | 'van';

export type VehicleStatus = 'activo' | 'mantenimiento' | 'inactivo' | 'reparacion';

// Tipos para Conductores
export interface Driver {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: DocumentType;
  licencia: string;
  categoriaLicencia: string;
  fechaNacimiento: Date;
  telefono: string;
  email?: string;
  estado: DriverStatus;
  documentos: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export type DriverStatus = 'activo' | 'inactivo' | 'vacaciones' | 'incapacidad';

// Tipos para Documentos
export interface Document {
  id: string;
  tipo: DocumentType;
  numero: string;
  fechaExpedicion: Date;
  fechaVencimiento?: Date;
  archivo: string;
  estado: DocumentStatus;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentType = 'cedula' | 'licencia' | 'soat' | 'tecnomecanica' | 'seguro' | 'otro';

export type DocumentStatus = 'vigente' | 'por_vencer' | 'vencido';

// Tipos para Peajes
export interface Toll {
  id: string;
  nombre: string;
  ubicacion: string;
  tarifa: number;
  categoria: string;
  estado: TollStatus;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  tarifas: TollRate[];
  horario?: Schedule;
  createdAt: Date;
  updatedAt: Date;
}

export type TollStatus = 'activo' | 'inactivo' | 'mantenimiento' | 'construccion';

export interface TollRate {
  id: string;
  categoria: string;
  descripcion: string;
  tarifa: number;
  horaInicio?: string;
  horaFin?: string;
  diasAplicables?: WeekDay[];
}

// Tipos para Rutas
export interface Route {
  id: string;
  nombre: string;
  origen: Location;
  destino: Location;
  distancia: number;
  duracionEstimada: number;
  peajes: Toll[];
  restricciones?: RouteRestriction[];
  puntosPaso?: Waypoint[];
  estado: RouteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
}

export interface Waypoint extends Location {
  orden: number;
  tiempoEsperaEstimado?: number;
  instrucciones?: string;
}

export interface RouteRestriction {
  tipo: RestrictionType;
  descripcion: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  horaInicio?: string;
  horaFin?: string;
  diasAplicables?: WeekDay[];
}

export type RouteStatus = 'activa' | 'inactiva' | 'temporal' | 'obras';

export type RestrictionType = 'peso' | 'altura' | 'ancho' | 'horario' | 'tipo_vehiculo';

// Tipos para Programación
export interface Schedule {
  id: string;
  diasOperacion: WeekDay[];
  horaApertura: string;
  horaCierre: string;
  excepciones?: ScheduleException[];
}

export interface ScheduleException {
  fecha: Date;
  motivo: string;
  horaApertura?: string;
  horaCierre?: string;
  estado: 'cerrado' | 'horario_especial';
}

export type WeekDay = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

// Tipos para Métricas y Estadísticas
export interface TollMetrics {
  total: number;
  activos: number;
  tarifaPromedio: number;
  recaudacionDiaria: number;
  transitoPromedio: {
    diario: number;
    semanal: number;
    mensual: number;
  };
}

export interface VehicleMetrics {
  total: number;
  activos: number;
  enMantenimiento: number;
  porTipo: Record<VehicleType, number>;
  edad: {
    promedio: number;
    distribucion: Record<string, number>;
  };
}

// Tipos de Utilidad
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface FilterOptions {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: unknown;
}

export interface QueryParams {
  filters?: FilterOptions[];
  pagination?: PaginationParams;
  search?: string;
}
