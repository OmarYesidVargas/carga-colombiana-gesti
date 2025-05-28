/**
 * Utilidades generales para la aplicación TransporegistrosPlus
 * 
 * Este archivo contiene funciones de utilidad compartidas en toda la aplicación,
 * incluyendo formateo de datos, manipulación de strings y helpers de UI.
 * 
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:26:15
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases CSS con soporte para Tailwind y clsx
 * @param inputs - Clases CSS a combinar
 * @returns String con las clases combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número como moneda en pesos colombianos
 * @param amount - Cantidad a formatear
 * @returns String con el formato de moneda colombiana
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formatea una fecha a string en formato local
 * @param date - Fecha a formatear
 * @returns String con la fecha formateada
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Trunca un texto a una longitud máxima
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima (default: 50)
 * @returns Texto truncado con ellipsis si excede maxLength
 */
export function truncateText(text: string, maxLength: number = 50): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Genera un ID único
 * @returns String con ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Pausa la ejecución por un tiempo determinado
 * @param ms - Milisegundos a esperar
 * @returns Promise que se resuelve después del tiempo especificado
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formatea un número con separadores de miles
 * @param number - Número a formatear
 * @returns String con el número formateado
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat('es-CO').format(number);
}

/**
 * Capitaliza la primera letra de un string
 * @param str - String a capitalizar
 * @returns String con la primera letra en mayúscula
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Verifica si un valor es un objeto válido
 * @param item - Valor a verificar
 * @returns Boolean indicando si es un objeto válido
 */
export function isValidObject(item: unknown): boolean {
  return Boolean(
    item &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    Object.keys(item as object).length > 0
  );
}

/**
 * Formatea bytes a una unidad legible
 * @param bytes - Número de bytes
 * @returns String con el tamaño formateado
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Obtiene la extensión de un nombre de archivo
 * @param filename - Nombre del archivo
 * @returns String con la extensión del archivo
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Retrasa la ejecución de una función (debounce)
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en ms
 * @returns Función con debounce aplicado
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Limita la ejecución de una función (throttle)
 * @param func - Función a ejecutar
 * @param limit - Límite de tiempo en ms
 * @returns Función con throttle aplicado
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
