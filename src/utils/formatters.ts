
/**
 * Utilidades para formateo de datos
 * Centraliza todas las funciones de formateo para mantener consistencia
 */

/**
 * Formatea un número como moneda colombiana (COP)
 * @param amount - Cantidad a formatear
 * @returns String formateado como moneda colombiana
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount);
};

/**
 * Formatea un número como moneda sin el símbolo COP
 * @param amount - Cantidad a formatear
 * @returns String formateado sin símbolo de moneda
 */
export const formatCurrencyCompact = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Obtiene la etiqueta en español para una categoría de gasto
 * @param category - Categoría de gasto en inglés
 * @returns Etiqueta en español
 */
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    fuel: 'Combustible',
    toll: 'Peaje',
    maintenance: 'Mantenimiento',
    lodging: 'Alojamiento',
    food: 'Comida',
    other: 'Otros'
  };
  
  return labels[category] || category;
};

/**
 * Obtiene la etiqueta en español para un método de pago
 * @param method - Método de pago
 * @returns Etiqueta en español
 */
export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    efectivo: 'Efectivo',
    electrónico: 'Electrónico',
    tag: 'Tag / Telepeaje',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia'
  };
  
  return labels[method] || 'Otro';
};

/**
 * Obtiene la etiqueta en español para un tipo de combustible
 * @param fuelType - Tipo de combustible
 * @returns Etiqueta en español
 */
export const getFuelTypeLabel = (fuelType: string): string => {
  const labels: Record<string, string> = {
    diesel: 'Diésel',
    gasoline: 'Gasolina',
    gas: 'Gas Natural',
    hybrid: 'Híbrido',
    electric: 'Eléctrico'
  };
  
  return labels[fuelType] || fuelType;
};
