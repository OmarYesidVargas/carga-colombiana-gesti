
import React from 'react';
import { Expense, Vehicle, Trip } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getCategoryColor, 
  getCategoryLabel, 
  formatCurrency 
} from '@/utils/chartColors';

interface ExpenseSummaryProps {
  expenses: Expense[];
  vehicles?: Vehicle[];
  trips?: Trip[];
  title?: string;
}

/**
 * Componente que muestra un resumen detallado de gastos
 * Incluye totales por categoría, vehículo y viaje
 */
const ExpenseSummary = ({ expenses, vehicles, trips, title = "Resumen de gastos" }: ExpenseSummaryProps) => {
  // Calcular el total de gastos
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular gastos por vehículo
  const expensesByVehicle = React.useMemo(() => {
    if (!vehicles) return [];
    
    const vehicleExpenses: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (!vehicleExpenses[expense.vehicleId]) {
        vehicleExpenses[expense.vehicleId] = 0;
      }
      vehicleExpenses[expense.vehicleId] += expense.amount;
    });
    
    return vehicles
      .map((vehicle) => ({
        ...vehicle,
        totalExpenses: vehicleExpenses[vehicle.id] || 0,
      }))
      .sort((a, b) => b.totalExpenses - a.totalExpenses);
  }, [expenses, vehicles]);
  
  // Calcular gastos por viaje
  const expensesByTrip = React.useMemo(() => {
    if (!trips) return [];
    
    const tripExpenses: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (!tripExpenses[expense.tripId]) {
        tripExpenses[expense.tripId] = 0;
      }
      tripExpenses[expense.tripId] += expense.amount;
    });
    
    return trips
      .map((trip) => {
        const vehicle = vehicles?.find((v) => v.id === trip.vehicleId);
        return {
          ...trip,
          vehicle,
          totalExpenses: tripExpenses[trip.id] || 0,
        };
      })
      .sort((a, b) => b.totalExpenses - a.totalExpenses);
  }, [expenses, trips, vehicles]);
  
  // Calcular gastos por categoría usando los colores consistentes
  const expensesByCategory = React.useMemo(() => {
    const categories: Record<string, { label: string; amount: number; color: string }> = {};
    
    // Inicializar todas las categorías con 0
    const allCategories = ['fuel', 'toll', 'maintenance', 'lodging', 'food', 'other'];
    allCategories.forEach(category => {
      categories[category] = {
        label: getCategoryLabel(category),
        amount: 0,
        color: getCategoryColor(category)
      };
    });
    
    // Sumar los gastos por categoría
    expenses.forEach((expense) => {
      if (categories[expense.category]) {
        categories[expense.category].amount += expense.amount;
      }
    });
    
    // Filtrar solo las categorías que tienen gastos y ordenar
    return Object.values(categories)
      .filter(category => category.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total de gastos */}
          <div className="text-center">
            <h3 className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </h3>
            <p className="text-sm text-muted-foreground">
              Total de gastos ({expenses.length} registros)
            </p>
          </div>
          
          {/* Gastos por categoría */}
          <div className="space-y-2">
            <h4 className="font-medium">Gastos por categoría:</h4>
            <div className="space-y-1">
              {expensesByCategory.map((category) => (
                <div key={category.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.label}</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gastos por vehículo (si hay datos) */}
          {expensesByVehicle.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Gastos por vehículo:</h4>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {expensesByVehicle
                  .filter((v) => v.totalExpenses > 0)
                  .slice(0, 5)
                  .map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between">
                      <span className="vehicle-plate">{vehicle.plate}</span>
                      <span className="font-medium">
                        {formatCurrency(vehicle.totalExpenses)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Gastos por viaje (si hay datos) */}
          {expensesByTrip.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Gastos por viaje:</h4>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {expensesByTrip
                  .filter((t) => t.totalExpenses > 0)
                  .slice(0, 5)
                  .map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between">
                      <span className="truncate max-w-[150px]">
                        {trip.origin} → {trip.destination}
                        {trip.vehicle && <span className="text-xs ml-1">({trip.vehicle.plate})</span>}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(trip.totalExpenses)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;
