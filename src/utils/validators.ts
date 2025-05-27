
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
