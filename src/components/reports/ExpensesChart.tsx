
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

  // Calcular el total para los porcentajes
  const totalAmount = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  // Preparar datos para el gráfico con colores consistentes
  const chartData = Object.entries(expensesByCategory).map(([key, value], index) => {
    const name = dataKeyMap ? (dataKeyMap[key] || key) : getCategoryLabel(key);
    const color = dataKeyMap ? 
      getChartColor(index) : 
      getCategoryColor(key);
    
    return {
      name,
      value,
      color,
      category: key,
      percentage: totalAmount > 0 ? Math.round((value / totalAmount) * 100) : 0
    };
  });

  // Componente para el tooltip personalizado optimizado para móvil
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = totalAmount > 0 ? Math.round((payload[0].value / totalAmount) * 100) : 0;
      
      return (
        <div className="custom-tooltip bg-white p-2 sm:p-3 border rounded shadow text-xs sm:text-sm max-w-[200px]">
          <p className="label font-semibold truncate">{`${payload[0].name}`}</p>
          <p className="intro text-blue-600 font-medium">{formatCurrency(payload[0].value)}</p>
          <p className="desc text-xs text-muted-foreground">
            {percentage}% del total
          </p>
        </div>
      );
    }
    return null;
  };

  // Componente personalizado para la leyenda responsiva
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-4 px-2">
        {payload.map((entry: any, index: number) => {
          // Buscar el dato correspondiente por índice en lugar de por nombre
          const correspondingData = chartData[index];
          const percentage = correspondingData ? correspondingData.percentage : 0;
          
          return (
            <div key={index} className="flex items-center gap-1 sm:gap-2 min-w-0">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                {entry.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-2 sm:p-4">
      <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-blue-600 text-center">
        Distribución de Gastos
      </h3>
      
      {chartData.length > 0 ? (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                content={<CustomLegend />} 
                verticalAlign="bottom"
                height={60}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-xs sm:text-sm text-center px-4">
            No hay datos suficientes para mostrar el gráfico
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesChart;
