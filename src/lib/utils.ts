
/**
 * Utilidades principales para TransporegistrosPlus
 * 
 * Este módulo contiene funciones utilitarias esenciales para toda la aplicación:
 * - Combinación y gestión de clases CSS con Tailwind
 * - Optimización de bundle size con tree-shaking
 * - Compatibilidad con shadcn/ui y componentes customizados
 * 
 * Dependencias:
 * - clsx: Para combinación condicional de clases
 * - tailwind-merge: Para resolver conflictos de clases Tailwind
 * 
 * Uso típico:
 * ```typescript
 * // Combinar clases base con variantes condicionales
 * const buttonClasses = cn(
 *   "px-4 py-2 rounded",
 *   variant === "primary" && "bg-blue-500 text-white",
 *   disabled && "opacity-50 cursor-not-allowed"
 * )
 * ```
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina y optimiza clases CSS con soporte completo para Tailwind CSS
 * 
 * Esta función resuelve automáticamente:
 * - Conflictos entre clases Tailwind (ej: "px-2 px-4" → "px-4")
 * - Clases condicionales (ej: condition && "class")
 * - Arrays y objetos de clases
 * - Strings con múltiples clases
 * 
 * Beneficios:
 * - Evita estilos conflictivos en Tailwind
 * - Mejora la consistencia visual
 * - Reduce el tamaño del CSS final
 * - Compatible con todas las utilidades de Tailwind
 * 
 * @param {...ClassValue} inputs - Clases CSS a combinar (strings, arrays, objetos, condicionales)
 * @returns {string} String final con clases optimizadas y sin conflictos
 * 
 * @example
 * ```typescript
 * // Clases básicas
 * cn("flex items-center", "text-lg font-bold")
 * // → "flex items-center text-lg font-bold"
 * 
 * // Con condicionales
 * cn("btn", isActive && "bg-blue-500", isDisabled && "opacity-50")
 * // → "btn bg-blue-500" (si isActive=true, isDisabled=false)
 * 
 * // Resuelve conflictos Tailwind
 * cn("px-2 py-4", "px-4") 
 * // → "py-4 px-4" (px-2 es removido por conflicto)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
