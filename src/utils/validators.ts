
/**
 * Validadores para TransporegistrosPlus
 * Incluye validaciones locales e internacionales
 */

// Validaciones básicas existentes
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePlate = (plate: string): boolean => {
  // Formato colombiano: ABC123 o ABC12D
  const plateRegex = /^[A-Z]{3}[0-9]{2}[A-Z0-9]?$/;
  return plateRegex.test(plate.toUpperCase());
};

export const validateYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1;
};

export const validateVehicle = (vehicle: any): boolean => {
  if (!vehicle) return false;
  
  const requiredFields = ['plate', 'brand', 'model', 'year'];
  
  for (const field of requiredFields) {
    if (!vehicle[field] || (typeof vehicle[field] === 'string' && vehicle[field].trim() === '')) {
      return false;
    }
  }
  
  if (!validateYear(vehicle.year)) {
    return false;
  }
  
  if (!validatePlate(vehicle.plate)) {
    return false;
  }
  
  return true;
};

export const validateTrip = (trip: any): boolean => {
  if (!trip) return false;
  
  const requiredFields = ['vehicleId', 'origin', 'destination', 'startDate', 'distance'];
  
  for (const field of requiredFields) {
    if (!trip[field] || (typeof trip[field] === 'string' && trip[field].trim() === '')) {
      return false;
    }
  }
  
  // Validar que la distancia sea un número positivo
  const distance = typeof trip.distance === 'string' ? parseFloat(trip.distance) : trip.distance;
  if (isNaN(distance) || distance <= 0) {
    return false;
  }
  
  return true;
};

export const validateExpense = (expense: any): boolean => {
  if (!expense) return false;
  
  const requiredFields = ['category', 'amount', 'description', 'date'];
  
  for (const field of requiredFields) {
    if (!expense[field] || (typeof expense[field] === 'string' && expense[field].trim() === '')) {
      return false;
    }
  }
  
  // Validar que el monto sea un número positivo
  const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
  if (isNaN(amount) || amount <= 0) {
    return false;
  }
  
  return true;
};

// Nuevas validaciones para peajes
export const validateToll = (toll: any): boolean => {
  if (!toll) return false;
  
  const requiredFields = ['name', 'location', 'category', 'price', 'route'];
  
  for (const field of requiredFields) {
    if (!toll[field] || (typeof toll[field] === 'string' && toll[field].trim() === '')) {
      return false;
    }
  }
  
  // Validar que el precio sea un número positivo
  const price = typeof toll.price === 'string' ? parseFloat(toll.price) : toll.price;
  if (isNaN(price) || price <= 0) {
    return false;
  }
  
  return true;
};

export const validateTollRecord = (record: any): boolean => {
  if (!record) return false;
  
  const requiredFields = ['tollId', 'tripId', 'vehicleId', 'date', 'price'];
  
  for (const field of requiredFields) {
    if (!record[field] || (typeof record[field] === 'string' && record[field].trim() === '')) {
      return false;
    }
  }
  
  // Validar que el precio sea un número positivo
  const price = typeof record.price === 'string' ? parseFloat(record.price) : record.price;
  if (isNaN(price) || price <= 0) {
    return false;
  }
  
  return true;
};

// Validaciones internacionales
export const validateInternationalPhone = (phone: string, countryCode: string): boolean => {
  // Validación básica para números internacionales
  const phoneRegex = /^\+?[1-9]\d{7,14}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Validaciones específicas por país
  switch (countryCode) {
    case 'CO': // Colombia
      return /^(\+57)?[13][0-9]{9}$/.test(cleanPhone);
    case 'US': // Estados Unidos
      return /^(\+1)?[2-9][0-9]{9}$/.test(cleanPhone);
    case 'MX': // México
      return /^(\+52)?[1-9][0-9]{9}$/.test(cleanPhone);
    case 'ES': // España
      return /^(\+34)?[6-9][0-9]{8}$/.test(cleanPhone);
    default:
      return phoneRegex.test(cleanPhone);
  }
};

export const validateInternationalDocument = (documentNumber: string, documentType: string, countryCode: string): boolean => {
  const cleanDoc = documentNumber.replace(/[\s\-\.]/g, '');
  
  switch (documentType) {
    case 'cedula':
      if (countryCode === 'CO') {
        return /^[1-9][0-9]{6,9}$/.test(cleanDoc);
      }
      return /^[0-9]{6,12}$/.test(cleanDoc);
    
    case 'passport':
      return /^[A-Z0-9]{6,12}$/i.test(cleanDoc);
    
    case 'driver_license':
      return /^[A-Z0-9]{5,15}$/i.test(cleanDoc);
    
    case 'tax_id':
      if (countryCode === 'US') {
        return /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/.test(cleanDoc);
      }
      return /^[0-9A-Z]{8,15}$/i.test(cleanDoc);
    
    default:
      return cleanDoc.length >= 6 && cleanDoc.length <= 20;
  }
};

export const validateColombiaCedula = (cedula: string): boolean => {
  const cleanCedula = cedula.replace(/\D/g, '');
  return /^[1-9][0-9]{6,9}$/.test(cleanCedula);
};

export const validateColombiaPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return /^[13][0-9]{9}$/.test(cleanPhone) || /^[0-9]{7}$/.test(cleanPhone);
};
