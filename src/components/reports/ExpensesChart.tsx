
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '@/types';
import { 
  getCategoryColor,
  getCategoryLabel,
  formatCurrency,
  getChartColor
} from '@/utils/chartColors';

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

  // Preparar datos para el gráfico con colores consistentes (SIN AMARILLO)
  const chartData = Object.entries(expensesByCategory).map(([key, value], index) => {
    const name = dataKeyMap ? (dataKeyMap[key] || key) : getCategoryLabel(key);
    const color = dataKeyMap ? 
      getChartColor(index) : 
      getCategoryColor(key);
    
    return {
      name,
      value,
      color,
      category: key // Mantener la categoría original para referencia
    };
  });

  // Componente para el tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalAmount = data ? 
        Object.values(expensesByCategory).reduce((a, b) => a + b, 0) :
        expenses.reduce((a, b) => a + b.amount, 0);
      const percentage = totalAmount > 0 ? Math.round((payload[0].value / totalAmount) * 100) : 0;
      
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow">
          <p className="label font-semibold">{`${payload[0].name}`}</p>
          <p className="intro text-blue-600 font-medium">{formatCurrency(payload[0].value)}</p>
          <p className="desc text-xs text-muted-foreground">
            {percentage}% del total
          </p>
        </div>
      );
    }
    return null;
  };

  // Componente personalizado para la leyenda
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-blue-600">Distribución de Gastos</h3>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
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
            <Legend content={<CustomLegend />} />
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
