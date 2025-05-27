
/**
 * Utilidades de validación para TransporegistrosPlus
 * Funciones reutilizables para validar datos de entrada
 */

import { VALIDATION_RULES } from '@/lib/constants';

/**
 * Valida que un objeto tiene todas las propiedades requeridas
 */
export const validateRequiredFields = (obj: any, requiredFields: string[]): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  
  return requiredFields.every(field => {
    const value = obj[field];
    return value !== null && value !== undefined && value !== '';
  });
};

/**
 * Valida formato de placa colombiana
 */
export const validatePlate = (plate: string): boolean => {
  if (!plate || typeof plate !== 'string') return false;
  
  const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();
  
  // Formato colombiano: ABC123 o ABC1234
  const plateRegex = /^[A-Z]{3}\d{3,4}$/;
  return plateRegex.test(cleanPlate);
};

/**
 * Valida año de vehículo
 */
export const validateYear = (year: number): boolean => {
  return year >= VALIDATION_RULES.minYear && year <= VALIDATION_RULES.maxYear;
};

/**
 * Valida distancia de viaje
 */
export const validateDistance = (distance: number): boolean => {
  return distance > 0 && distance <= VALIDATION_RULES.maxDistance;
};

/**
 * Valida monto de gasto
 */
export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= VALIDATION_RULES.maxAmount;
};

/**
 * Valida fecha de vencimiento
 */
export const validateExpiryDate = (date: string): boolean => {
  if (!date) return true; // Opcional
  
  const expiryDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return expiryDate >= today;
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida datos de vehículo
 */
export const validateVehicle = (vehicle: any): boolean => {
  const requiredFields = ['plate', 'brand', 'model', 'year', 'capacity', 'fuelType'];
  
  if (!validateRequiredFields(vehicle, requiredFields)) return false;
  if (!validatePlate(vehicle.plate)) return false;
  if (!validateYear(parseInt(vehicle.year))) return false;
  
  return true;
};

/**
 * Valida datos de viaje
 */
export const validateTrip = (trip: any): boolean => {
  const requiredFields = ['vehicleId', 'startDate', 'origin', 'destination', 'distance'];
  
  if (!validateRequiredFields(trip, requiredFields)) return false;
  if (!validateDistance(parseFloat(trip.distance))) return false;
  
  // Validar fechas
  const startDate = new Date(trip.startDate);
  if (isNaN(startDate.getTime())) return false;
  
  if (trip.endDate) {
    const endDate = new Date(trip.endDate);
    if (isNaN(endDate.getTime()) || endDate < startDate) return false;
  }
  
  return true;
};

/**
 * Valida datos de gasto
 */
export const validateExpense = (expense: any): boolean => {
  const requiredFields = ['tripId', 'vehicleId', 'category', 'amount', 'description', 'date'];
  
  if (!validateRequiredFields(expense, requiredFields)) return false;
  if (!validateAmount(parseFloat(expense.amount))) return false;
  
  // Validar fecha
  const expenseDate = new Date(expense.date);
  if (isNaN(expenseDate.getTime())) return false;
  
  return true;
};

/**
 * Valida datos de peaje
 */
export const validateToll = (toll: any): boolean => {
  const requiredFields = ['name', 'location', 'category', 'price', 'route'];
  
  if (!validateRequiredFields(toll, requiredFields)) return false;
  if (!validateAmount(parseFloat(toll.price))) return false;
  
  return true;
};

/**
 * Valida datos de registro de peaje
 */
export const validateTollRecord = (record: any): boolean => {
  const requiredFields = ['tollId', 'tripId', 'vehicleId', 'amount', 'date'];
  
  if (!validateRequiredFields(record, requiredFields)) return false;
  if (!validateAmount(parseFloat(record.amount))) return false;
  
  // Validar fecha
  const recordDate = new Date(record.date);
  if (isNaN(recordDate.getTime())) return false;
  
  return true;
};
