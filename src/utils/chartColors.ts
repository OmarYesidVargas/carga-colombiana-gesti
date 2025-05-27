
/**
 * Utilidades de colores para gráficos en TransporegistrosPlus
 * Paleta de colores consistente para visualizaciones
 */

import { EXPENSE_CATEGORIES } from '@/lib/constants';

/**
 * Colores principales para gráficos
 */
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  warning: '#f97316',
  info: '#06b6d4',
  success: '#22c55e',
  purple: '#8b5cf6',
  pink: '#ec4899',
  gray: '#6b7280'
};

/**
 * Paleta de colores para categorías de gastos
 */
export const EXPENSE_COLORS = EXPENSE_CATEGORIES.reduce((acc, category) => {
  acc[category.value] = category.color;
  return acc;
}, {} as Record<string, string>);

/**
 * Obtiene el color para una categoría de gasto
 */
export const getCategoryColor = (category: string): string => {
  return EXPENSE_COLORS[category] || CHART_COLORS.gray;
};

/**
 * Obtiene el label para una categoría de gasto
 */
export const getCategoryLabel = (category: string): string => {
  const categoryData = EXPENSE_CATEGORIES.find(cat => cat.value === category);
  return categoryData?.label || category;
};

/**
 * Paleta de colores para múltiples series
 */
export const MULTI_SERIES_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.info,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.gray
];

/**
 * Obtiene colores para gráficos con múltiples series
 */
export const getSeriesColors = (count: number): string[] => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(MULTI_SERIES_COLORS[i % MULTI_SERIES_COLORS.length]);
  }
  return colors;
};

/**
 * Obtiene un color basado en el índice
 */
export const getChartColor = (index: number): string => {
  return MULTI_SERIES_COLORS[index % MULTI_SERIES_COLORS.length];
};

/**
 * Formatea un número como moneda colombiana
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
 * Colores para estados de vehículos
 */
export const VEHICLE_STATUS_COLORS = {
  active: CHART_COLORS.success,
  maintenance: CHART_COLORS.warning,
  inactive: CHART_COLORS.gray,
  expired: CHART_COLORS.danger
};

/**
 * Colores para estados de viajes
 */
export const TRIP_STATUS_COLORS = {
  active: CHART_COLORS.info,
  completed: CHART_COLORS.success,
  cancelled: CHART_COLORS.danger,
  pending: CHART_COLORS.warning
};
