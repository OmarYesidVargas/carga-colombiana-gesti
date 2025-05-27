
/**
 * Componente de gráfico de gastos mensuales
 * Muestra una línea de tiempo con los gastos de los últimos meses
 */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';

interface MonthlyExpenseChartProps {
  /** Lista de gastos a mostrar en el gráfico */
  expenses: Expense[];
  /** Número de meses a mostrar (por defecto 6) */
  months?: number;
  /** Título del gráfico */
  title?: string;
}

/**
 * MonthlyExpenseChart - Gráfico de líneas para gastos mensuales
 * @param expenses - Array de gastos a analizar
 * @param months - Cantidad de meses a mostrar en el gráfico
 * @param title - Título personalizado para el gráfico
 */
const MonthlyExpenseChart: React.FC<MonthlyExpenseChartProps> = ({ 
  expenses, 
  months = 6,
  title = "Gastos mensuales" 
}) => {
  // Generar datos para los últimos N meses
  const chartData = React.useMemo(() => {
    const today = new Date();
    const monthData: Record<string, { month: string, total: number }> = {};
    
    // Inicializar los meses con valores en 0
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM yyyy', { locale: es });
      monthData[monthKey] = {
        month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        total: 0,
      };
    }
    
    // Sumar los gastos por mes
    expenses.forEach((expense) => {
      try {
        const expenseDate = new Date(expense.date);
        const monthKey = format(expenseDate, 'yyyy-MM');
        
        // Solo incluir gastos de los meses que estamos mostrando
        if (monthData[monthKey]) {
          monthData[monthKey].total += expense.amount;
        }
      } catch (error) {
        console.error('Error al procesar fecha del gasto:', error, expense);
      }
    });
    
    return Object.values(monthData);
  }, [expenses, months]);
  
  /**
   * Componente personalizado para el tooltip del gráfico
   * Muestra información detallada al hacer hover
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-blue-600 font-medium">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ 
                top: 20, 
                right: 30, 
                left: 20, 
                bottom: 5 
              }}
            >
              {/* Grid de fondo */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                opacity={0.7}
              />
              
              {/* Eje X (meses) */}
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#6b7280' }}
              />
              
              {/* Eje Y (montos) */}
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#6b7280' }}
              />
              
              {/* Tooltip personalizado */}
              <Tooltip content={<CustomTooltip />} />
              
              {/* Leyenda */}
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
              />
              
              {/* Línea de gastos - AZUL */}
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Total de gastos"
                activeDot={{ 
                  r: 6, 
                  fill: "#3b82f6",
                  stroke: "#ffffff",
                  strokeWidth: 2
                }}
                dot={{ 
                  fill: "#3b82f6", 
                  strokeWidth: 2,
                  stroke: "#ffffff",
                  r: 4 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Mostrar mensaje si no hay datos */}
        {chartData.every(item => item.total === 0) && (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No hay gastos registrados en los últimos {months} meses
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenseChart;
