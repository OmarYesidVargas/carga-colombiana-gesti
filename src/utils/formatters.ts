
/**
 * Utilidades de formateo para TransporegistrosPlus
 * Funciones para formatear datos de manera consistente
 */

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea montos en pesos colombianos
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
 * Formatea números con separadores de miles
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('es-CO').format(number);
};

/**
 * Formatea fechas para mostrar
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Formatea distancias
 */
export const formatDistance = (distance: number): string => {
  return `${formatNumber(distance)} km`;
};

/**
 * Formatea placas de vehículos
 */
export const formatPlate = (plate: string): string => {
  if (!plate) return '';
  
  const cleaned = plate.replace(/[-\s]/g, '').toUpperCase();
  
  // Formato ABC-123 o ABC-1234
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  
  return cleaned;
};

/**
 * Formatea tiempo relativo
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
    
    return `Hace ${Math.floor(diffInDays / 365)} años`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

/**
 * Formatea porcentajes
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Trunca texto con ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Capitaliza primera letra
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea duración en días
 */
export const formatDuration = (startDate: string, endDate?: string): string => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 1) return '1 día';
  return `${diffInDays} días`;
};
