
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpensesChartProps {
  expenses: Expense[];
  title?: string;
}

// Colores para las categorías
const categoryColors = {
  fuel: "#FF9F1C",        // Naranja para combustible
  toll: "#2EC4B6",        // Verde azulado para peajes
  maintenance: "#E71D36", // Rojo para mantenimiento
  lodging: "#7209B7",     // Morado para alojamiento
  food: "#4CC9F0",        // Azul claro para comida
  other: "#8E9196",       // Gris para otros
};

// Etiquetas en español para las categorías
const categoryLabels = {
  fuel: "Combustible",
  toll: "Peaje",
  maintenance: "Mantenimiento",
  lodging: "Alojamiento",
  food: "Comida",
  other: "Otros",
};

const ExpensesChart = ({ expenses, title = "Gastos por categoría" }: ExpensesChartProps) => {
  // Procesar datos para el gráfico agrupando por categoría
  const chartData = React.useMemo(() => {
    const categorySums: Record<string, number> = {};
    
    expenses.forEach((expense) => {
      const { category, amount } = expense;
      if (!categorySums[category]) {
        categorySums[category] = 0;
      }
      categorySums[category] += amount;
    });
    
    return Object.keys(categoryLabels).map(key => ({
      name: categoryLabels[key as keyof typeof categoryLabels],
      value: categorySums[key] || 0,
      fill: categoryColors[key as keyof typeof categoryColors]
    }));
  }, [expenses]);
  
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
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm currency-cop">{formatCurrency(payload[0].value)}</p>
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
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace('COP', '').trim()} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" name="Monto" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesChart;
