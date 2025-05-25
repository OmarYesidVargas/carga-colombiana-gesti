
/**
 * Funciones de validación reutilizables
 */

export const validateVehicle = (vehicle: any): boolean => {
  if (!vehicle) return false;
  if (!vehicle.plate || typeof vehicle.plate !== 'string' || vehicle.plate.trim().length === 0) return false;
  if (!vehicle.brand || typeof vehicle.brand !== 'string' || vehicle.brand.trim().length === 0) return false;
  if (!vehicle.model || typeof vehicle.model !== 'string' || vehicle.model.trim().length === 0) return false;
  if (!vehicle.year || isNaN(Number(vehicle.year)) || Number(vehicle.year) < 1900 || Number(vehicle.year) > new Date().getFullYear() + 2) return false;
  
  return true;
};

export const validateTrip = (trip: any): boolean => {
  if (!trip) return false;
  if (!trip.vehicleId || typeof trip.vehicleId !== 'string') return false;
  if (!trip.origin || typeof trip.origin !== 'string' || trip.origin.trim().length === 0) return false;
  if (!trip.destination || typeof trip.destination !== 'string' || trip.destination.trim().length === 0) return false;
  if (!trip.startDate) return false;
  if (trip.distance === undefined || isNaN(Number(trip.distance)) || Number(trip.distance) < 0) return false;
  
  // Validar fechas
  const startDate = new Date(trip.startDate);
  if (isNaN(startDate.getTime())) return false;
  
  if (trip.endDate) {
    const endDate = new Date(trip.endDate);
    if (isNaN(endDate.getTime()) || endDate < startDate) return false;
  }
  
  return true;
};

export const validateToll = (toll: any): boolean => {
  if (!toll) return false;
  if (!toll.name || typeof toll.name !== 'string' || toll.name.trim().length === 0) return false;
  if (!toll.location || typeof toll.location !== 'string' || toll.location.trim().length === 0) return false;
  if (!toll.category || typeof toll.category !== 'string' || toll.category.trim().length === 0) return false;
  if (!toll.route || typeof toll.route !== 'string' || toll.route.trim().length === 0) return false;
  if (toll.price === undefined || isNaN(Number(toll.price)) || Number(toll.price) < 0) return false;
  
  return true;
};

export const validateTollRecord = (record: any): boolean => {
  if (!record) return false;
  if (!record.tripId || typeof record.tripId !== 'string') return false;
  if (!record.vehicleId || typeof record.vehicleId !== 'string') return false;
  if (!record.tollId || typeof record.tollId !== 'string') return false;
  if (!record.date) return false;
  if (record.price === undefined || isNaN(Number(record.price))) return false;
  if (!record.paymentMethod || typeof record.paymentMethod !== 'string') return false;
  
  return true;
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/\s+/g, ' ');
};
