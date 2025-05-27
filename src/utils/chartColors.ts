
/**
 * Configuración de colores para gráficos y visualizaciones
 * TEMA ORIGINAL: Colores vibrantes con violetas y púrpuras
 */

// Colores principales del tema original
export const PRIMARY_COLORS = {
  primary: '#8b5cf6',     // Violeta principal
  secondary: '#64748b',   // Gris slate
  accent: '#10b981',      // Verde
  warning: '#f59e0b',     // Amarillo
  danger: '#ef4444',      // Rojo
  info: '#0ea5e9'         // Azul cielo
};

/**
 * Paleta original para categorías de gastos
 */
export const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  fuel: '#f59e0b',        // Amarillo - Combustible
  toll: '#8b5cf6',        // Violeta - Peajes
  maintenance: '#ef4444', // Rojo - Mantenimiento
  lodging: '#a855f7',     // Púrpura - Alojamiento
  food: '#10b981',        // Verde - Comida
  other: '#64748b'        // Gris - Otros
};

/**
 * Colores para gráficos - Paleta vibrante original
 */
export const CHART_COLORS = [
  '#8b5cf6', // Violeta principal
  '#a855f7', // Púrpura
  '#10b981', // Verde
  '#f59e0b', // Amarillo
  '#ef4444', // Rojo
  '#3b82f6', // Azul
  '#06b6d4', // Cyan
  '#84cc16', // Verde lima
  '#ec4899', // Rosa
  '#14b8a6'  // Teal
];

/**
 * Obtiene el color para una categoría específica
 */
export const getCategoryColor = (category: string): string => {
  return EXPENSE_CATEGORY_COLORS[category] || EXPENSE_CATEGORY_COLORS.other;
};

/**
 * Obtiene un color del array de colores por índice
 */
export const getChartColor = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

/**
 * Genera datos de color para gráficos de categorías
 */
export const generateCategoryColorData = (categories: string[]) => {
  return categories.map(category => ({
    category,
    color: getCategoryColor(category)
  }));
};

// Re-exportar formatCurrency desde formatters para mantener compatibilidad
export { formatCurrency, getCategoryLabel } from './formatters';
