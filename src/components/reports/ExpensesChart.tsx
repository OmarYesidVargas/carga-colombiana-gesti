
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '@/types';

// Mapeador de categorías a etiquetas en español
const categoryLabels: Record<string, string> = {
  fuel: 'Combustible',
  toll: 'Peaje',
  maintenance: 'Mantenimiento',
  lodging: 'Alojamiento', 
  food: 'Comida',
  other: 'Otros'
};

// Colores para las diferentes categorías
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ExpensesChartProps {
  expenses: Expense[];
  data?: Record<string, number>;
  dataKeyMap?: Record<string, string>;
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ 
  expenses, 
  data,
  dataKeyMap
}) => {
  // Si se proporciona data, usarla; de lo contrario, calcular desde los gastos
  const expensesByCategory = data || expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Preparar datos para el gráfico
  const chartData = Object.entries(expensesByCategory).map(([key, value], index) => ({
    name: dataKeyMap ? (dataKeyMap[key] || key) : (categoryLabels[key] || key),
    value,
    color: COLORS[index % COLORS.length]
  }));

  // Formatear moneda colombiana para las etiquetas
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  // Componente para el tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow">
          <p className="label font-semibold">{`${payload[0].name}`}</p>
          <p className="intro">{formatCurrency(payload[0].value)}</p>
          <p className="desc text-xs text-muted-foreground">
            {Math.round((payload[0].value / expenses.reduce((a, b) => a + b.amount, 0)) * 100)}% del total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Distribución de Gastos</h3>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No hay datos suficientes para mostrar el gráfico</p>
        </div>
      )}
    </div>
  );
};

export default ExpensesChart;
