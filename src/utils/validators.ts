
/**
 * Utilidades de Validación para TransporegistrosPlus
 * 
 * Contiene funciones para validar datos antes de enviarlos a la base de datos
 * Estas validaciones complementan las validaciones de Zod en los formularios
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';

/**
 * Valida los datos de un vehículo antes de guardar
 * 
 * @param {Partial<Vehicle>} vehicle - Datos del vehículo a validar
 * @returns {boolean} true si los datos son válidos
 */
export const validateVehicle = (vehicle: Partial<Vehicle>): boolean => {
  try {
    // Validaciones obligatorias
    if (!vehicle.plate || vehicle.plate.trim().length === 0) {
      console.error('Validación vehículo: Placa es obligatoria');
      return false;
    }
    
    if (!vehicle.brand || vehicle.brand.trim().length === 0) {
      console.error('Validación vehículo: Marca es obligatoria');
      return false;
    }
    
    if (!vehicle.model || vehicle.model.trim().length === 0) {
      console.error('Validación vehículo: Modelo es obligatorio');
      return false;
    }
    
    if (!vehicle.year || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
      console.error('Validación vehículo: Año inválido');
      return false;
    }
    
    // Validar formato de placa (básico - puede mejorarse según país)
    const plateRegex = /^[A-Za-z0-9\-\s]{3,10}$/;
    if (!plateRegex.test(vehicle.plate.trim())) {
      console.error('Validación vehículo: Formato de placa inválido');
      return false;
    }
    
    // Validaciones opcionales
    if (vehicle.color && vehicle.color.trim().length < 2) {
      console.error('Validación vehículo: Color debe tener al menos 2 caracteres');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error en validateVehicle:', error);
    return false;
  }
};

/**
 * Valida los datos de un viaje antes de guardar
 * 
 * @param {Partial<Trip>} trip - Datos del viaje a validar
 * @returns {boolean} true si los datos son válidos
 */
export const validateTrip = (trip: Partial<Trip>): boolean => {
  try {
    // Validaciones obligatorias
    if (!trip.vehicleId || trip.vehicleId.trim().length === 0) {
      console.error('Validación viaje: ID de vehículo es obligatorio');
      return false;
    }
    
    if (!trip.origin || trip.origin.trim().length < 2) {
      console.error('Validación viaje: Origen debe tener al menos 2 caracteres');
      return false;
    }
    
    if (!trip.destination || trip.destination.trim().length < 2) {
      console.error('Validación viaje: Destino debe tener al menos 2 caracteres');
      return false;
    }
    
    if (!trip.startDate) {
      console.error('Validación viaje: Fecha de inicio es obligatoria');
      return false;
    }
    
    if (!trip.distance || trip.distance <= 0) {
      console.error('Validación viaje: Distancia debe ser mayor a 0');
      return false;
    }
    
    // Validar que la fecha de inicio no sea futura (con margen de 1 día)
    const startDate = new Date(trip.startDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (startDate > tomorrow) {
      console.error('Validación viaje: Fecha de inicio no puede ser futura');
      return false;
    }
    
    // Validar fecha de fin si existe
    if (trip.endDate) {
      const endDate = new Date(trip.endDate);
      if (endDate < startDate) {
        console.error('Validación viaje: Fecha de fin no puede ser anterior a fecha de inicio');
        return false;
      }
    }
    
    // Validar distancia máxima razonable (10,000 km)
    if (trip.distance > 10000) {
      console.error('Validación viaje: Distancia excede el máximo permitido (10,000 km)');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error en validateTrip:', error);
    return false;
  }
};

/**
 * Valida los datos de un gasto antes de guardar
 * 
 * @param {Partial<Expense>} expense - Datos del gasto a validar
 * @returns {boolean} true si los datos son válidos
 */
export const validateExpense = (expense: Partial<Expense>): boolean => {
  try {
    // Validaciones obligatorias
    if (!expense.tripId || expense.tripId.trim().length === 0) {
      console.error('Validación gasto: ID de viaje es obligatorio');
      return false;
    }
    
    if (!expense.vehicleId || expense.vehicleId.trim().length === 0) {
      console.error('Validación gasto: ID de vehículo es obligatorio');
      return false;
    }
    
    if (!expense.category) {
      console.error('Validación gasto: Categoría es obligatoria');
      return false;
    }
    
    if (!expense.amount || expense.amount <= 0) {
      console.error('Validación gasto: Monto debe ser mayor a 0');
      return false;
    }
    
    if (!expense.date) {
      console.error('Validación gasto: Fecha es obligatoria');
      return false;
    }
    
    // Validar categorías permitidas
    const validCategories = ['fuel', 'toll', 'maintenance', 'lodging', 'food', 'other'];
    if (!validCategories.includes(expense.category)) {
      console.error('Validación gasto: Categoría no válida');
      return false;
    }
    
    // Validar monto máximo razonable (100 millones COP)
    if (expense.amount > 100000000) {
      console.error('Validación gasto: Monto excede el máximo permitido');
      return false;
    }
    
    // Validar que la fecha no sea muy futura (máximo 1 día)
    const expenseDate = new Date(expense.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (expenseDate > tomorrow) {
      console.error('Validación gasto: Fecha no puede ser futura');
      return false;
    }
    
    // Validar que la fecha no sea muy antigua (máximo 5 años)
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    
    if (expenseDate < fiveYearsAgo) {
      console.error('Validación gasto: Fecha es demasiado antigua');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error en validateExpense:', error);
    return false;
  }
};

/**
 * Valida los datos de un peaje antes de guardar
 * 
 * @param {Partial<Toll>} toll - Datos del peaje a validar
 * @returns {boolean} true si los datos son válidos
 */
export const validateToll = (toll: Partial<Toll>): boolean => {
  try {
    // Validaciones obligatorias
    if (!toll.name || toll.name.trim().length < 2) {
      console.error('Validación peaje: Nombre debe tener al menos 2 caracteres');
      return false;
    }
    
    if (!toll.location || toll.location.trim().length < 2) {
      console.error('Validación peaje: Ubicación debe tener al menos 2 caracteres');
      return false;
    }
    
    if (!toll.category || toll.category.trim().length === 0) {
      console.error('Validación peaje: Categoría es obligatoria');
      return false;
    }
    
    if (!toll.price || toll.price <= 0) {
      console.error('Validación peaje: Precio debe ser mayor a 0');
      return false;
    }
    
    if (!toll.route || toll.route.trim().length < 2) {
      console.error('Validación peaje: Ruta debe tener al menos 2 caracteres');
      return false;
    }
    
    // Validar precio máximo razonable (1 millón COP)
    if (toll.price > 1000000) {
      console.error('Validación peaje: Precio excede el máximo permitido');
      return false;
    }
    
    // Validar categoría (generalmente números del 1 al 7)
    const categoryRegex = /^[1-7]$/;
    if (!categoryRegex.test(toll.category.trim())) {
      console.error('Validación peaje: Categoría debe ser un número del 1 al 7');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error en validateToll:', error);
    return false;
  }
};

/**
 * Valida los datos de un registro de peaje antes de guardar
 * 
 * @param {Partial<TollRecord>} record - Datos del registro a validar
 * @returns {boolean} true si los datos son válidos
 */
export const validateTollRecord = (record: Partial<TollRecord>): boolean => {
  try {
    // Validaciones obligatorias
    if (!record.tripId || record.tripId.trim().length === 0) {
      console.error('Validación registro peaje: ID de viaje es obligatorio');
      return false;
    }
    
    if (!record.vehicleId || record.vehicleId.trim().length === 0) {
      console.error('Validación registro peaje: ID de vehículo es obligatorio');
      return false;
    }
    
    if (!record.tollId || record.tollId.trim().length === 0) {
      console.error('Validación registro peaje: ID de peaje es obligatorio');
      return false;
    }
    
    if (!record.date) {
      console.error('Validación registro peaje: Fecha es obligatoria');
      return false;
    }
    
    if (!record.price || record.price <= 0) {
      console.error('Validación registro peaje: Precio debe ser mayor a 0');
      return false;
    }
    
    if (!record.paymentMethod || record.paymentMethod.trim().length === 0) {
      console.error('Validación registro peaje: Método de pago es obligatorio');
      return false;
    }
    
    // Validar métodos de pago permitidos
    const validPaymentMethods = ['efectivo', 'electronico', 'tag', 'tarjeta'];
    if (!validPaymentMethods.includes(record.paymentMethod.toLowerCase())) {
      console.error('Validación registro peaje: Método de pago no válido');
      return false;
    }
    
    // Validar precio máximo razonable (1 millón COP)
    if (record.price > 1000000) {
      console.error('Validación registro peaje: Precio excede el máximo permitido');
      return false;
    }
    
    // Validar que la fecha no sea futura
    const recordDate = new Date(record.date);
    const now = new Date();
    
    if (recordDate > now) {
      console.error('Validación registro peaje: Fecha no puede ser futura');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error en validateTollRecord:', error);
    return false;
  }
};

/**
 * Valida formato de email
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de teléfono colombiano
 * 
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} true si el teléfono es válido
 */
export const validateColombianPhone = (phone: string): boolean => {
  // Acepta formatos como: 3001234567, +573001234567, (300) 123-4567
  const phoneRegex = /^(\+57|57)?[\s\-\(\)]?[1-9]\d{2}[\s\-\(\)]?\d{3}[\s\-]?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida número de documento colombiano
 * 
 * @param {string} documentNumber - Número de documento
 * @param {string} documentType - Tipo de documento (cedula, pasaporte, etc.)
 * @returns {boolean} true si el documento es válido
 */
export const validateColombianDocument = (documentNumber: string, documentType: string): boolean => {
  if (!documentNumber || !documentType) return false;
  
  switch (documentType.toLowerCase()) {
    case 'cedula':
      // Cédula: 7-10 dígitos
      return /^\d{7,10}$/.test(documentNumber);
    case 'pasaporte':
      // Pasaporte: 6-12 caracteres alfanuméricos
      return /^[A-Za-z0-9]{6,12}$/.test(documentNumber);
    case 'cedula_extranjeria':
      // Cédula de extranjería: 6-12 dígitos
      return /^\d{6,12}$/.test(documentNumber);
    default:
      return true; // Otros tipos de documento son aceptados sin validación específica
  }
};
