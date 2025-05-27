
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
  capacity: string;
  fuelType: 'gasolina' | 'diesel' | 'gas' | 'electrico' | 'hibrido';
  soatExpiry?: string;
  technicalReviewExpiry?: string;
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

export interface Expense {
  id: string;
  userId: string;
  tripId: string;
  vehicleId: string;
  category: 'combustible' | 'peajes' | 'mantenimiento' | 'alimentacion' | 'hospedaje' | 'multas' | 'otros';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Toll {
  id: string;
  userId: string;
  name: string;
  location: string;
  category: string;
  price: string;
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
  amount: number;
  date: string;
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
  soatExpiry?: string;
  technicalReviewExpiry?: string;
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
