
/**
 * Configuración de colores para gráficos y visualizaciones
 * Centraliza todos los colores para mantener consistencia visual
 */

// Colores principales de la aplicación (basados en Tailwind)
export const PRIMARY_COLORS = {
  primary: '#8b5cf6',
  secondary: '#64748b',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

/**
 * Paleta de colores para categorías de gastos
 * Cada categoría tiene un color único y consistente
 */
export const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  fuel: '#f59e0b',        // Amarillo/Naranja - Combustible
  toll: '#8b5cf6',        // Violeta - Peajes
  maintenance: '#ef4444', // Rojo - Mantenimiento
  lodging: '#3b82f6',     // Azul - Alojamiento
  food: '#10b981',        // Verde - Comida
  other: '#64748b'        // Gris - Otros
};

/**
 * Colores alternativos para cuando se necesiten más opciones
 */
export const CHART_COLORS = [
  '#8b5cf6', // Violeta
  '#10b981', // Verde
  '#f59e0b', // Amarillo
  '#ef4444', // Rojo
  '#3b82f6', // Azul
  '#64748b', // Gris
  '#06b6d4', // Cyan
  '#84cc16', // Verde lima
  '#f97316', // Naranja
  '#ec4899'  // Rosa
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
