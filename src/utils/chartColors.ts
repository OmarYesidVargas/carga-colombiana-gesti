
/**
 * Configuración de colores para gráficos y visualizaciones
 * TEMA UNIX: Colores sobrios y profesionales - Solo grises y azules
 */

// Colores principales Unix - Sin amarillo
export const PRIMARY_COLORS = {
  primary: '#3b82f6',     // Azul Unix
  secondary: '#64748b',   // Gris slate
  accent: '#10b981',      // Verde sobrio
  warning: '#f97316',     // Naranja (reemplaza amarillo)
  danger: '#ef4444',      // Rojo
  info: '#0ea5e9'         // Azul cielo
};

/**
 * Paleta Unix para categorías de gastos - Sin amarillo
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
 * Colores Unix para gráficos - Paleta profesional sin amarillo
 */
export const CHART_COLORS = [
  '#3b82f6', // Azul principal
  '#64748b', // Gris slate
  '#10b981', // Verde
  '#f97316', // Naranja (NO amarillo)
  '#ef4444', // Rojo
  '#8b5cf6', // Violeta
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
