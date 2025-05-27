
/**
 * Utilidades para formateo de datos internacionales
 * Centraliza todas las funciones de formateo para mantener consistencia
 * con soporte para múltiples países y monedas
 * 
 * @author TransporegistrosPlus Team
 * @version 2.0.0
 */

import { SUPPORTED_COUNTRIES } from '@/lib/constants';

/**
 * Formatea un número como moneda según el país/moneda especificada
 * 
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (COP, USD, EUR, etc.)
 * @param {string} locale - Locale para formateo (es-CO, en-US, etc.)
 * @returns {string} String formateado como moneda
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'COP', 
  locale: string = 'es-CO'
): string => {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'COP' ? 0 : 2
  }).format(amount);
};

/**
 * Formatea un número como moneda sin el símbolo
 * 
 * @param {number} amount - Cantidad a formatear
 * @param {string} locale - Locale para formateo
 * @returns {string} String formateado sin símbolo de moneda
 */
export const formatCurrencyCompact = (amount: number, locale: string = 'es-CO'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formatea una fecha según el locale especificado
 * 
 * @param {Date | string} date - Fecha a formatear
 * @param {string} locale - Locale para formateo
 * @param {object} options - Opciones de formateo de Intl.DateTimeFormat
 * @returns {string} Fecha formateada
 */
export const formatDate = (
  date: Date | string, 
  locale: string = 'es-CO',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Formatea una fecha y hora según el locale especificado
 * 
 * @param {Date | string} datetime - Fecha y hora a formatear
 * @param {string} locale - Locale para formateo
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (datetime: Date | string, locale: string = 'es-CO'): string => {
  return formatDate(datetime, locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea un número de teléfono según el país
 * 
 * @param {string} phone - Número de teléfono
 * @param {string} country - Código del país
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone: string, country: string = 'CO'): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  const formatters: Record<string, (phone: string) => string> = {
    CO: (p) => p.replace(/(\d{3})(\d{3})(\d{4})/, '+57 $1 $2 $3'),
    US: (p) => p.replace(/(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3'),
    MX: (p) => p.replace(/(\d{2})(\d{4})(\d{4})/, '+52 $1 $2 $3'),
    BR: (p) => p.replace(/(\d{2})(\d{5})(\d{4})/, '+55 ($1) $2-$3'),
    AR: (p) => p.replace(/(\d{2})(\d{4})(\d{4})/, '+54 $1 $2-$3'),
    ES: (p) => p.replace(/(\d{3})(\d{3})(\d{3})/, '+34 $1 $2 $3')
  };
  
  const formatter = formatters[country];
  return formatter ? formatter(cleanPhone) : phone;
};

/**
 * Obtiene la etiqueta en el idioma apropiado para una categoría de gasto
 * 
 * @param {string} category - Categoría de gasto en inglés
 * @param {string} locale - Locale para el idioma
 * @returns {string} Etiqueta en el idioma correspondiente
 */
export const getCategoryLabel = (category: string, locale: string = 'es-CO'): string => {
  const isEnglish = locale.startsWith('en');
  
  const labels: Record<string, { es: string; en: string }> = {
    fuel: { es: 'Combustible', en: 'Fuel' },
    toll: { es: 'Peaje', en: 'Toll' },
    maintenance: { es: 'Mantenimiento', en: 'Maintenance' },
    lodging: { es: 'Alojamiento', en: 'Lodging' },
    food: { es: 'Comida', en: 'Food' },
    insurance: { es: 'Seguros', en: 'Insurance' },
    permits: { es: 'Permisos', en: 'Permits' },
    parking: { es: 'Estacionamiento', en: 'Parking' },
    fines: { es: 'Multas', en: 'Fines' },
    other: { es: 'Otros', en: 'Other' }
  };
  
  const categoryData = labels[category];
  if (!categoryData) return category;
  
  return isEnglish ? categoryData.en : categoryData.es;
};

/**
 * Obtiene la etiqueta en el idioma apropiado para un método de pago
 * 
 * @param {string} method - Método de pago
 * @param {string} locale - Locale para el idioma
 * @returns {string} Etiqueta en el idioma correspondiente
 */
export const getPaymentMethodLabel = (method: string, locale: string = 'es-CO'): string => {
  const isEnglish = locale.startsWith('en');
  
  const labels: Record<string, { es: string; en: string }> = {
    cash: { es: 'Efectivo', en: 'Cash' },
    efectivo: { es: 'Efectivo', en: 'Cash' },
    card: { es: 'Tarjeta', en: 'Card' },
    tarjeta: { es: 'Tarjeta', en: 'Card' },
    electronic: { es: 'Electrónico', en: 'Electronic' },
    electronico: { es: 'Electrónico', en: 'Electronic' },
    tag: { es: 'Tag / Telepeaje', en: 'Electronic Tag' },
    mobile: { es: 'Pago Móvil', en: 'Mobile Payment' },
    bank_transfer: { es: 'Transferencia', en: 'Bank Transfer' },
    transferencia: { es: 'Transferencia', en: 'Bank Transfer' },
    check: { es: 'Cheque', en: 'Check' },
    cryptocurrency: { es: 'Criptomoneda', en: 'Cryptocurrency' },
    other: { es: 'Otro', en: 'Other' }
  };
  
  const methodData = labels[method.toLowerCase()];
  if (!methodData) return method;
  
  return isEnglish ? methodData.en : methodData.es;
};

/**
 * Obtiene la etiqueta en el idioma apropiado para un tipo de combustible
 * 
 * @param {string} fuelType - Tipo de combustible
 * @param {string} locale - Locale para el idioma
 * @returns {string} Etiqueta en el idioma correspondiente
 */
export const getFuelTypeLabel = (fuelType: string, locale: string = 'es-CO'): string => {
  const isEnglish = locale.startsWith('en');
  
  const labels: Record<string, { es: string; en: string }> = {
    gasoline: { es: 'Gasolina', en: 'Gasoline' },
    diesel: { es: 'Diésel', en: 'Diesel' },
    gas: { es: 'Gas Natural', en: 'Natural Gas' },
    lpg: { es: 'GLP', en: 'LPG' },
    electric: { es: 'Eléctrico', en: 'Electric' },
    hybrid: { es: 'Híbrido', en: 'Hybrid' },
    hydrogen: { es: 'Hidrógeno', en: 'Hydrogen' },
    biodiesel: { es: 'Biodiésel', en: 'Biodiesel' },
    ethanol: { es: 'Etanol', en: 'Ethanol' }
  };
  
  const fuelData = labels[fuelType.toLowerCase()];
  if (!fuelData) return fuelType;
  
  return isEnglish ? fuelData.en : fuelData.es;
};

/**
 * Obtiene la etiqueta en el idioma apropiado para un tipo de vehículo
 * 
 * @param {string} vehicleType - Tipo de vehículo
 * @param {string} locale - Locale para el idioma
 * @returns {string} Etiqueta en el idioma correspondiente
 */
export const getVehicleTypeLabel = (vehicleType: string, locale: string = 'es-CO'): string => {
  const isEnglish = locale.startsWith('en');
  
  const labels: Record<string, { es: string; en: string }> = {
    truck: { es: 'Camión', en: 'Truck' },
    semi_truck: { es: 'Tractomula', en: 'Semi Truck' },
    van: { es: 'Furgón', en: 'Van' },
    pickup: { es: 'Camioneta', en: 'Pickup Truck' },
    trailer: { es: 'Remolque', en: 'Trailer' },
    tanker: { es: 'Cisterna', en: 'Tanker' },
    refrigerated: { es: 'Refrigerado', en: 'Refrigerated' },
    flatbed: { es: 'Plataforma', en: 'Flatbed' },
    container: { es: 'Contenedor', en: 'Container' },
    bus: { es: 'Autobús', en: 'Bus' },
    motorcycle: { es: 'Motocicleta', en: 'Motorcycle' },
    other: { es: 'Otro', en: 'Other' }
  };
  
  const vehicleData = labels[vehicleType.toLowerCase()];
  if (!vehicleData) return vehicleType;
  
  return isEnglish ? vehicleData.en : vehicleData.es;
};

/**
 * Obtiene información del país por código
 * 
 * @param {string} countryCode - Código del país
 * @returns {object | null} Información del país o null si no se encuentra
 */
export const getCountryInfo = (countryCode: string) => {
  return SUPPORTED_COUNTRIES.find(country => country.code === countryCode) || null;
};

/**
 * Formatea una distancia según el sistema de medidas del país
 * 
 * @param {number} distance - Distancia en kilómetros
 * @param {string} country - Código del país
 * @param {string} locale - Locale para formateo
 * @returns {string} Distancia formateada
 */
export const formatDistance = (distance: number, country: string = 'CO', locale: string = 'es-CO'): string => {
  const useImperial = ['US'].includes(country);
  
  if (useImperial) {
    const miles = distance * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  
  return `${distance.toFixed(1)} km`;
};

/**
 * Formatea un peso según el sistema de medidas del país
 * 
 * @param {number} weight - Peso en kilogramos
 * @param {string} country - Código del país
 * @returns {string} Peso formateado
 */
export const formatWeight = (weight: number, country: string = 'CO'): string => {
  const useImperial = ['US'].includes(country);
  
  if (useImperial) {
    const pounds = weight * 2.20462;
    return `${pounds.toFixed(0)} lbs`;
  }
  
  return `${weight.toFixed(0)} kg`;
};

/**
 * Detecta el locale del navegador
 * 
 * @returns {string} Locale detectado o fallback
 */
export const detectBrowserLocale = (): string => {
  const browserLang = navigator.language || navigator.languages[0] || 'es-CO';
  
  // Mapear algunos locales comunes
  const localeMap: Record<string, string> = {
    'es': 'es-CO',
    'en': 'en-US',
    'pt': 'pt-BR',
    'es-ES': 'es-ES',
    'es-MX': 'es-MX',
    'es-AR': 'es-AR'
  };
  
  return localeMap[browserLang] || browserLang;
};

/**
 * Obtiene el símbolo de moneda para un código de moneda
 * 
 * @param {string} currency - Código de moneda
 * @returns {string} Símbolo de moneda
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    COP: '$',
    USD: '$',
    EUR: '€',
    MXN: '$',
    BRL: 'R$',
    ARS: '$',
    GBP: '£',
    JPY: '¥',
    CNY: '¥'
  };
  
  return symbols[currency] || currency;
};
