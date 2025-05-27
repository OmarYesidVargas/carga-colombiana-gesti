
/**
 * Utilidades de validación para formularios y datos
 * Centraliza todas las validaciones para mantener consistencia
 */

/**
 * Valida si un email tiene formato válido
 * @param email - Email a validar
 * @returns true si es válido, false si no
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una placa de vehículo tiene formato válido (Colombia)
 * @param plate - Placa a validar
 * @returns true si es válida, false si no
 */
export const isValidPlate = (plate: string): boolean => {
  // Formato colombiano: ABC123 o ABC12D
  const plateRegex = /^[A-Z]{3}[0-9]{2}[0-9A-Z]$/;
  return plateRegex.test(plate.toUpperCase().replace(/\s/g, ''));
};

/**
 * Valida si un número es positivo
 * @param value - Valor a validar
 * @returns true si es positivo, false si no
 */
export const isPositiveNumber = (value: number | string): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Valida si una fecha es válida y no es futura
 * @param date - Fecha a validar
 * @returns true si es válida, false si no
 */
export const isValidPastDate = (date: string | Date): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj <= now && !isNaN(dateObj.getTime());
};

/**
 * Valida si un año es válido para vehículos (entre 1900 y año actual + 1)
 * @param year - Año a validar
 * @returns true si es válido, false si no
 */
export const isValidVehicleYear = (year: number | string): boolean => {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
  const currentYear = new Date().getFullYear();
  return yearNum >= 1900 && yearNum <= currentYear + 1;
};

/**
 * Valida los datos de un vehículo
 * @param vehicle - Datos del vehículo a validar
 * @returns true si los datos son válidos, false si no
 */
export const validateVehicle = (vehicle: any): boolean => {
  if (!vehicle) return false;
  
  // Verificar campos obligatorios
  if (!vehicle.plate || typeof vehicle.plate !== 'string' || vehicle.plate.trim() === '') {
    return false;
  }
  
  if (!vehicle.brand || typeof vehicle.brand !== 'string' || vehicle.brand.trim() === '') {
    return false;
  }
  
  if (!vehicle.model || typeof vehicle.model !== 'string' || vehicle.model.trim() === '') {
    return false;
  }
  
  if (!vehicle.year || !isValidVehicleYear(vehicle.year)) {
    return false;
  }
  
  // Validar formato de placa
  if (!isValidPlate(vehicle.plate)) {
    return false;
  }
  
  return true;
};

/**
 * Valida los datos de un viaje
 * @param trip - Datos del viaje a validar
 * @returns true si los datos son válidos, false si no
 */
export const validateTrip = (trip: any): boolean => {
  if (!trip) return false;
  
  // Verificar campos obligatorios
  if (!trip.origin || typeof trip.origin !== 'string' || trip.origin.trim() === '') {
    return false;
  }
  
  if (!trip.destination || typeof trip.destination !== 'string' || trip.destination.trim() === '') {
    return false;
  }
  
  if (!trip.vehicleId || typeof trip.vehicleId !== 'string' || trip.vehicleId.trim() === '') {
    return false;
  }
  
  if (!trip.startDate || !trip.endDate) {
    return false;
  }
  
  // Validar que la fecha de inicio sea anterior a la fecha de fin
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false;
  }
  
  if (startDate >= endDate) {
    return false;
  }
  
  // Validar distancia si se proporciona
  if (trip.distance !== undefined && !isPositiveNumber(trip.distance)) {
    return false;
  }
  
  return true;
};

/**
 * Valida los datos de un peaje
 * @param toll - Datos del peaje a validar
 * @returns true si los datos son válidos, false si no
 */
export const validateToll = (toll: any): boolean => {
  if (!toll) return false;
  
  // Verificar campos obligatorios
  if (!toll.name || typeof toll.name !== 'string' || toll.name.trim() === '') {
    return false;
  }
  
  if (!toll.location || typeof toll.location !== 'string' || toll.location.trim() === '') {
    return false;
  }
  
  if (!toll.category || typeof toll.category !== 'string' || toll.category.trim() === '') {
    return false;
  }
  
  if (!toll.route || typeof toll.route !== 'string' || toll.route.trim() === '') {
    return false;
  }
  
  // Validar precio
  if (toll.price === undefined || toll.price === null || !isPositiveNumber(toll.price)) {
    return false;
  }
  
  return true;
};

/**
 * Valida los datos de un registro de peaje
 * @param record - Datos del registro a validar
 * @returns true si los datos son válidos, false si no
 */
export const validateTollRecord = (record: any): boolean => {
  if (!record) return false;
  
  // Verificar campos obligatorios
  if (!record.vehicleId || typeof record.vehicleId !== 'string' || record.vehicleId.trim() === '') {
    return false;
  }
  
  if (!record.tripId || typeof record.tripId !== 'string' || record.tripId.trim() === '') {
    return false;
  }
  
  if (!record.tollId || typeof record.tollId !== 'string' || record.tollId.trim() === '') {
    return false;
  }
  
  if (!record.date) {
    return false;
  }
  
  // Validar fecha
  const date = new Date(record.date);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // Validar precio
  if (record.price === undefined || record.price === null || !isPositiveNumber(record.price)) {
    return false;
  }
  
  return true;
};
