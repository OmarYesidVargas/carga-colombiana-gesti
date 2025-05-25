
/**
 * Utilidades para colores consistentes en gráficos
 * Estos colores coinciden exactamente con los definidos en tailwind.config.ts
 */

// Colores para categorías de gastos (coinciden exactamente con Tailwind config)
export const expenseCategoryColors: Record<string, string> = {
  fuel: '#FF9F1C',        // expense-fuel - Naranja para combustible
  toll: '#2EC4B6',        // expense-toll - Verde azulado para peajes  
  maintenance: '#E71D36', // expense-maintenance - Rojo para mantenimiento
  lodging: '#7209B7',     // expense-lodging - Morado para alojamiento
  food: '#4CC9F0',        // expense-food - Azul claro para comida
  other: '#8E9196'        // expense-other - Gris para otros
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
// Usando colores del tema principal de la aplicación
export const chartColors = [
  '#9b87f5', // primary (violeta suave)
  '#0ea5e9', // sky-500 (azul cielo)
  '#22c55e', // green-500 (verde)
  '#f59e0b', // amber-500 (amarillo/naranja)
  '#ef4444', // red-500 (rojo)
  '#8b5cf6', // violet-500 (violeta)
  '#06b6d4', // cyan-500 (cian)
  '#84cc16', // lime-500 (lima)
  '#f97316', // orange-500 (naranja)
  '#ec4899'  // pink-500 (rosa)
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

/**
 * Formatea moneda colombiana de manera consistente
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount);
};
