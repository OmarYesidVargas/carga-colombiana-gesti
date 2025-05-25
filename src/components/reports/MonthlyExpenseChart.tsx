
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addMonths, format, isSameMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { chartColors } from '@/utils/chartColors';

interface MonthlyExpenseChartProps {
  expenses: Expense[];
  months?: number;
  title?: string;
}

const MonthlyExpenseChart = ({ 
  expenses, 
  months = 6,
  title = "Gastos mensuales" 
}: MonthlyExpenseChartProps) => {
  // Generar datos para los últimos N meses
  const chartData = React.useMemo(() => {
    const today = new Date();
    const monthData: Record<string, { month: string, total: number }> = {};
    
    // Inicializar los meses
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
      const expenseDate = new Date(expense.date);
      const monthKey = format(expenseDate, 'yyyy-MM');
      
      if (monthData[monthKey]) {
        monthData[monthKey].total += expense.amount;
      }
    });
    
    return Object.values(monthData);
  }, [expenses, months]);
  
  // Formatear moneda colombiana para el tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace('COP', '').trim()} 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke={chartColors[0]}
                strokeWidth={3}
                name="Total de gastos"
                activeDot={{ r: 6, fill: chartColors[1] }}
                dot={{ fill: chartColors[0], r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenseChart;
