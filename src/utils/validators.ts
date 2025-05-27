
/**
 * Utilidades de Validación Internacionales para TransporegistrosPlus
 * 
 * Contiene funciones para validar datos según estándares internacionales
 * Estas validaciones complementan las validaciones de Zod en los formularios
 * 
 * Características:
 * - Soporte para múltiples países y formatos
 * - Validaciones específicas por región
 * - Compatibilidad con estándares internacionales
 * - Validaciones extensibles y configurables
 * 
 * @author TransporegistrosPlus Team
 * @version 2.0.0
 */

import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';

/**
 * Configuración de validación por país
 */
const VALIDATION_CONFIG = {
  CO: {
    phoneRegex: /^(\+57|57)?[1-9]\d{9}$/,
    documentTypes: {
      cedula: /^\d{7,10}$/,
      cedula_extranjeria: /^\d{6,12}$/,
      passport: /^[A-Za-z0-9]{6,12}$/
    }
  },
  US: {
    phoneRegex: /^(\+1|1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    documentTypes: {
      ssn: /^\d{3}-?\d{2}-?\d{4}$/,
      ein: /^\d{2}-?\d{7}$/,
      passport: /^[A-Za-z0-9]{6,9}$/,
      driver_license: /^[A-Za-z0-9]{6,20}$/
    }
  },
  MX: {
    phoneRegex: /^(\+52|52)?[1-9]\d{9}$/,
    documentTypes: {
      curp: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/,
      rfc: /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/,
      passport: /^[A-Za-z0-9]{6,12}$/
    }
  },
  BR: {
    phoneRegex: /^(\+55|55)?[1-9]\d{10}$/,
    documentTypes: {
      cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
      rg: /^[\dX]{1,2}\.?\d{3}\.?\d{3}-?[\dX]$/,
      passport: /^[A-Za-z]{2}\d{6}$/
    }
  },
  AR: {
    phoneRegex: /^(\+54|54)?9?[1-9]\d{8,9}$/,
    documentTypes: {
      dni: /^\d{7,8}$/,
      cuit: /^\d{2}-?\d{8}-?\d$/,
      passport: /^[A-Za-z]{3}\d{6}$/
    }
  },
  ES: {
    phoneRegex: /^(\+34|34)?[6-9]\d{8}$/,
    documentTypes: {
      nie: /^[XYZ]\d{7}[A-Z]$/,
      nif: /^\d{8}[A-Z]$/,
      passport: /^[A-Z]{3}\d{6}$/
    }
  }
};

/**
 * Valida los datos de un vehículo antes de guardar
 * 
 * @param {Partial<Vehicle>} vehicle - Datos del vehículo a validar
 * @param {string} country - Código del país (opcional, por defecto 'CO')
 * @returns {boolean} true si los datos son válidos
 */
export const validateVehicle = (vehicle: Partial<Vehicle>, country: string = 'CO'): boolean => {
  try {
    console.log('🔍 Validando vehículo:', vehicle);
    
    // Validaciones obligatorias
    if (!vehicle.plate || vehicle.plate.trim().length === 0) {
      console.error('❌ Validación vehículo: Placa es obligatoria');
      return false;
    }
    
    if (!vehicle.brand || vehicle.brand.trim().length === 0) {
      console.error('❌ Validación vehículo: Marca es obligatoria');
      return false;
    }
    
    if (!vehicle.model || vehicle.model.trim().length === 0) {
      console.error('❌ Validación vehículo: Modelo es obligatorio');
      return false;
    }
    
    // Validar año - aceptar tanto number como string
    const year = typeof vehicle.year === 'string' ? parseInt(vehicle.year, 10) : vehicle.year;
    if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear() + 2) {
      console.error('❌ Validación vehículo: Año inválido', year);
      return false;
    }
    
    // Validar formato de placa según país
    const plateValidation = validateVehiclePlate(vehicle.plate.trim(), country);
    if (!plateValidation.isValid) {
      console.error('❌ Validación vehículo:', plateValidation.error);
      return false;
    }
    
    // Validaciones opcionales - solo validar si tienen valor
    if (vehicle.color && vehicle.color.trim().length > 0 && vehicle.color.trim().length < 2) {
      console.error('❌ Validación vehículo: Color debe tener al menos 2 caracteres');
      return false;
    }
    
    if (vehicle.capacity && vehicle.capacity.trim().length > 0) {
      // Permitir descripciones de capacidad como "5 Toneladas", no solo números
      if (vehicle.capacity.trim().length < 1) {
        console.error('❌ Validación vehículo: Capacidad debe tener al menos 1 caracter');
        return false;
      }
    }
    
    console.log('✅ Validación vehículo exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error en validateVehicle:', error);
    return false;
  }
};

/**
 * Valida formato de placa según el país
 * 
 * @param {string} plate - Placa del vehículo
 * @param {string} country - Código del país
 * @returns {object} Resultado de validación con isValid y error
 */
export const validateVehiclePlate = (plate: string, country: string): { isValid: boolean; error?: string } => {
  // Hacer la validación más flexible para Colombia
  const plateRegexes: Record<string, RegExp> = {
    CO: /^[A-Z]{3}[\s\-]?\d{2}[A-Z\d]$|^[A-Z]{2}[\s\-]?\d{3}[A-Z]$|^[A-Z]{3}[\s\-]?\d{3}$/,
    US: /^[A-Z0-9]{2,8}$/,
    MX: /^[A-Z]{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
    BR: /^[A-Z]{3}[\s\-]?\d{4}$|^[A-Z]{3}[\s\-]?\d[A-Z]\d{2}$/,
    AR: /^[A-Z]{2}[\s\-]?\d{3}[\s\-]?[A-Z]{2}$/,
    ES: /^\d{4}[\s\-]?[A-Z]{3}$/
  };
  
  const regex = plateRegexes[country] || /^[A-Za-z0-9\-\s]{3,15}$/;
  const normalizedPlate = plate.toUpperCase().trim();
  
  if (!regex.test(normalizedPlate)) {
    return {
      isValid: false,
      error: `Formato de placa inválido para ${country}. Placa: ${plate}`
    };
  }
  
  return { isValid: true };
};

/**
 * Valida los datos de un viaje antes de guardar
 * 
 * @param {Partial<Trip>} trip - Datos del viaje a validar
 * @param {string} country - Código del país (opcional)
 * @returns {boolean} true si los datos son válidos
 */
export const validateTrip = (trip: Partial<Trip>, country: string = 'CO'): boolean => {
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
    
    // Validaciones específicas por país
    if (trip.distance && country === 'US') {
      // Convertir millas a kilómetros si es necesario
      if (trip.distance > 10000) {
        console.error('Validación viaje: Distancia excede el máximo permitido');
        return false;
      }
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
 * @param {string} currency - Código de moneda (opcional, por defecto 'COP')
 * @returns {boolean} true si los datos son válidos
 */
export const validateExpense = (expense: Partial<Expense>, currency: string = 'COP'): boolean => {
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
    const maxAmounts: Record<string, number> = {
      COP: 100000000, // 100 millones COP
      USD: 50000,     // 50 mil USD
      EUR: 45000,     // 45 mil EUR
      MXN: 1000000,   // 1 millón MXN
      BRL: 250000,    // 250 mil BRL
      ARS: 10000000   // 10 millones ARS
    };
    
    const maxAmount = maxAmounts[currency] || maxAmounts.COP;
    
    if (expense.amount && expense.amount > maxAmount) {
      console.error(`Validación gasto: Monto excede el máximo permitido para ${currency}`);
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
 * @param {string} country - Código del país (opcional)
 * @returns {boolean} true si los datos son válidos
 */
export const validateToll = (toll: Partial<Toll>, country: string = 'CO'): boolean => {
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
    const maxPrices: Record<string, number> = {
      CO: 1000000,   // 1 millón COP
      US: 100,       // 100 USD
      MX: 2000,      // 2000 MXN
      BR: 500,       // 500 BRL
      AR: 50000,     // 50 mil ARS
      ES: 100        // 100 EUR
    };
    
    const maxPrice = maxPrices[country] || maxPrices.CO;
    
    if (toll.price && toll.price > maxPrice) {
      console.error(`Validación peaje: Precio excede el máximo permitido para ${country}`);
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
 * @param {string} country - Código del país (opcional)
 * @returns {boolean} true si los datos son válidos
 */
export const validateTollRecord = (record: Partial<TollRecord>, country: string = 'CO'): boolean => {
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
    const validPaymentMethods: Record<string, string[]> = {
      CO: ['efectivo', 'electronico', 'tag', 'tarjeta'],
      US: ['cash', 'card', 'electronic', 'mobile'],
      MX: ['efectivo', 'tarjeta', 'tag', 'transferencia'],
      BR: ['dinheiro', 'cartao', 'pix', 'tag'],
      AR: ['efectivo', 'tarjeta', 'mercadopago', 'tag'],
      ES: ['efectivo', 'tarjeta', 'via_t', 'bizum']
    };
    
    const validMethods = validPaymentMethods[country] || validPaymentMethods.CO;
    
    if (record.paymentMethod && !validMethods.includes(record.paymentMethod.toLowerCase())) {
      console.error(`Validación registro peaje: Método de pago no válido para ${country}`);
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
 * Valida formato de email internacional
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido
 */
export const validateEmail = (email: string): boolean => {
  // RFC 5322 compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de teléfono internacional
 * 
 * @param {string} phone - Teléfono a validar
 * @param {string} country - Código del país (opcional, por defecto 'CO')
 * @returns {boolean} true si el teléfono es válido
 */
export const validateInternationalPhone = (phone: string, country: string = 'CO'): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const config = VALIDATION_CONFIG[country as keyof typeof VALIDATION_CONFIG];
  
  if (config) {
    return config.phoneRegex.test(cleanPhone);
  }
  
  // Fallback para países no configurados
  const internationalRegex = /^\+?[1-9]\d{6,14}$/;
  return internationalRegex.test(cleanPhone);
};

/**
 * Valida número de documento internacional
 * 
 * @param {string} documentNumber - Número de documento
 * @param {string} documentType - Tipo de documento
 * @param {string} country - Código del país (opcional, por defecto 'CO')
 * @returns {boolean} true si el documento es válido
 */
export const validateInternationalDocument = (
  documentNumber: string, 
  documentType: string, 
  country: string = 'CO'
): boolean => {
  if (!documentNumber || !documentType) return false;
  
  const config = VALIDATION_CONFIG[country as keyof typeof VALIDATION_CONFIG];
  
  if (config && config.documentTypes[documentType as keyof typeof config.documentTypes]) {
    const regex = config.documentTypes[documentType as keyof typeof config.documentTypes];
    return regex.test(documentNumber);
  }
  
  // Validaciones genéricas para documentos internacionales
  switch (documentType.toLowerCase()) {
    case 'passport':
      return /^[A-Za-z0-9]{6,12}$/.test(documentNumber);
    case 'national_id':
      return /^[A-Za-z0-9]{6,20}$/.test(documentNumber);
    case 'driver_license':
      return /^[A-Za-z0-9]{6,20}$/.test(documentNumber);
    default:
      // Para tipos de documento no reconocidos, validación básica
      return documentNumber.length >= 6 && documentNumber.length <= 20;
  }
};

/**
 * Valida código postal internacional
 * 
 * @param {string} postalCode - Código postal
 * @param {string} country - Código del país
 * @returns {boolean} true si el código postal es válido
 */
export const validatePostalCode = (postalCode: string, country: string): boolean => {
  const postalRegexes: Record<string, RegExp> = {
    CO: /^\d{6}$/,
    US: /^\d{5}(-\d{4})?$/,
    MX: /^\d{5}$/,
    BR: /^\d{5}-?\d{3}$/,
    AR: /^[A-Z]\d{4}[A-Z]{3}$/,
    ES: /^\d{5}$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,
    GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/
  };
  
  const regex = postalRegexes[country];
  if (!regex) {
    // Validación genérica para países no configurados
    return /^[A-Za-z0-9\s\-]{3,10}$/.test(postalCode);
  }
  
  return regex.test(postalCode);
};

/**
 * Valida coordenadas geográficas
 * 
 * @param {string} coordinates - Coordenadas en formato "lat,lng"
 * @returns {boolean} true si las coordenadas son válidas
 */
export const validateCoordinates = (coordinates: string): boolean => {
  const coordRegex = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/;
  
  if (!coordRegex.test(coordinates)) {
    return false;
  }
  
  const [lat, lng] = coordinates.split(',').map(Number);
  
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Mantener compatibilidad con funciones anteriores
export const validateColombianPhone = (phone: string): boolean => 
  validateInternationalPhone(phone, 'CO');

export const validateColombianDocument = (documentNumber: string, documentType: string): boolean => 
  validateInternationalDocument(documentNumber, documentType, 'CO');
