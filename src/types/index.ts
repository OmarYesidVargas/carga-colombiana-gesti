
/**
 * Tipos principales para TransporegistrosPlus
 * Sistema integral de gestión de transportes
 */

export interface Vehicle {
  id: string;
  userId: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  capacity: string;
  fuelType: 'gasolina' | 'diesel' | 'gas' | 'electrico' | 'hibrido';
  soatExpiry?: string;
  soatExpiryDate?: Date;
  technicalReviewExpiry?: string;
  technoExpiryDate?: Date;
  soatInsuranceCompany?: string;
  technoCenter?: string;
  soatDocumentUrl?: string;
  technoDocumentUrl?: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate?: string;
  origin: string;
  destination: string;
  distance: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 'fuel' | 'toll' | 'maintenance' | 'lodging' | 'food' | 'other';

export interface Expense {
  id: string;
  userId: string;
  tripId: string;
  vehicleId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Toll {
  id: string;
  userId: string;
  name: string;
  location: string;
  category: string;
  price: number;
  route: string;
  coordinates?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TollRecord {
  id: string;
  userId: string;
  tollId: string;
  tripId: string;
  vehicleId: string;
  price: number;
  amount: number;
  date: string;
  paymentMethod: string;
  receipt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para formularios
export interface VehicleFormData {
  plate: string;
  brand: string;
  model: string;
  year: string;
  capacity: string;
  fuelType: string;
  color?: string;
  soatExpiry?: string;
  soatExpiryDate?: Date;
  technicalReviewExpiry?: string;
  technoExpiryDate?: Date;
  soatInsuranceCompany?: string;
  technoCenter?: string;
  soatDocumentUrl?: string;
  technoDocumentUrl?: string;
  notes?: string;
}

export interface TripFormData {
  vehicleId: string;
  startDate: Date;
  endDate?: Date;
  origin: string;
  destination: string;
  distance: string;
  notes?: string;
}

export interface ExpenseFormData {
  tripId: string;
  vehicleId: string;
  category: string;
  amount: string;
  description: string;
  date: Date;
}

// Colores para categorías de gastos - AHORA EXPORTADO CORRECTAMENTE
export const expenseCategoryColors = {
  fuel: '#ef4444',
  toll: '#f97316', 
  maintenance: '#eab308',
  lodging: '#3b82f6',
  food: '#22c55e',
  other: '#6b7280'
} as const;

// Tipos para validaciones internacionales
export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  phonePrefix: string;
  locale: string;
  timeZone: string;
}

export interface DocumentType {
  value: string;
  label: string;
  country: string;
}

export interface GenderOption {
  value: string;
  label: string;
}
