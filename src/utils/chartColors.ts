
/**
 * Utilidades para colores consistentes en gráficos
 */

// Colores para categorías de gastos (coinciden con Tailwind config)
export const expenseCategoryColors: Record<string, string> = {
  fuel: '#FF9F1C',        // Naranja para combustible
  toll: '#2EC4B6',        // Verde azulado para peajes  
  maintenance: '#E71D36', // Rojo para mantenimiento
  lodging: '#7209B7',     // Morado para alojamiento
  food: '#4CC9F0',        // Azul claro para comida
  other: '#8E9196'        // Gris para otros
};

// Etiquetas en español para categorías
export const expenseCategoryLabels: Record<string, string> = {
  fuel: 'Combustible',
  toll: 'Peaje', 
  maintenance: 'Mantenimiento',
  lodging: 'Alojamiento',
  food: 'Comida',
  other: 'Otros'
};

// Colores para gráficos generales (cuando no son categorías específicas)
export const chartColors = [
  '#9b87f5', // primary
  '#0ea5e9', // sky-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899'  // pink-500
];

/**
 * Obtiene el color para una categoría de gasto
 */
export const getCategoryColor = (category: string): string => {
  return expenseCategoryColors[category] || expenseCategoryColors.other;
};

/**
 * Obtiene la etiqueta en español para una categoría
 */
export const getCategoryLabel = (category: string): string => {
  return expenseCategoryLabels[category] || category;
};

/**
 * Obtiene un color del array de colores generales
 */
export const getChartColor = (index: number): string => {
  return chartColors[index % chartColors.length];
};
