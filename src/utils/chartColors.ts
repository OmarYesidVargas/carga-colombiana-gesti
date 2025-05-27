
/**
 * Configuración de colores para gráficos y visualizaciones
 * Centraliza todos los colores para mantener consistencia visual
 * TEMA: AZUL PRINCIPAL - SIN AMARILLO
 */

// Colores principales de la aplicación (basados en Tailwind - AZUL)
export const PRIMARY_COLORS = {
  primary: '#3b82f6',     // Azul principal
  secondary: '#64748b',   // Gris
  accent: '#10b981',      // Verde
  warning: '#f97316',     // Naranja (NO amarillo)
  danger: '#ef4444',      // Rojo
  info: '#3b82f6'         // Azul
};

/**
 * Paleta de colores para categorías de gastos
 * Cada categoría tiene un color único y consistente - SIN AMARILLO
 */
export const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  fuel: '#f97316',        // Naranja - Combustible (NO amarillo)
  toll: '#3b82f6',        // Azul - Peajes
  maintenance: '#ef4444', // Rojo - Mantenimiento
  lodging: '#8b5cf6',     // Violeta - Alojamiento
  food: '#10b981',        // Verde - Comida
  other: '#64748b'        // Gris - Otros
};

/**
 * Colores alternativos para cuando se necesiten más opciones - SIN AMARILLO
 */
export const CHART_COLORS = [
  '#3b82f6', // Azul principal
  '#10b981', // Verde
  '#f97316', // Naranja (NO amarillo)
  '#ef4444', // Rojo
  '#8b5cf6', // Violeta
  '#64748b', // Gris
  '#06b6d4', // Cyan
  '#84cc16', // Verde lima
  '#ec4899', // Rosa
  '#14b8a6'  // Teal
];

/**
 * Obtiene el color para una categoría específica
 * @param category - Categoría de gasto
 * @returns Color hexadecimal
 */
export const getCategoryColor = (category: string): string => {
  return EXPENSE_CATEGORY_COLORS[category] || EXPENSE_CATEGORY_COLORS.other;
};

/**
 * Obtiene un color del array de colores por índice
 * @param index - Índice del color
 * @returns Color hexadecimal
 */
export const getChartColor = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

/**
 * Genera datos de color para gráficos de categorías
 * @param categories - Array de categorías
 * @returns Array de objetos con categoría y color
 */
export const generateCategoryColorData = (categories: string[]) => {
  return categories.map(category => ({
    category,
    color: getCategoryColor(category)
  }));
};

// Re-exportar formatCurrency desde formatters para mantener compatibilidad
export { formatCurrency, getCategoryLabel } from './formatters';
