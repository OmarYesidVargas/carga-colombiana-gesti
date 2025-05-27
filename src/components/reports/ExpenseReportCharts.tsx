
import React from 'react';
import { Expense, Vehicle, Trip } from '@/types';
import ExpenseSummary from './ExpenseSummary';
import ExpensesChart from './ExpensesChart';
import MonthlyExpenseChart from './MonthlyExpenseChart';

interface ExpenseReportChartsProps {
  expenses: Expense[];
  vehicles: Vehicle[];
  trips: Trip[];
  expensesByCategory: Record<string, number>;
  expensesByVehicle: Record<string, number>;
}

/**
 * Componente responsivo que organiza todos los gráficos y resúmenes de gastos
 * Se adapta automáticamente a diferentes tamaños de pantalla
 */
const ExpenseReportCharts: React.FC<ExpenseReportChartsProps> = ({
  expenses,
  vehicles,
  trips,
  expensesByCategory,
  expensesByVehicle
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Resumen y gráfico de categorías - Stack en móvil, lado a lado en desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="order-2 xl:order-1">
          <ExpenseSummary 
            expenses={expenses} 
            vehicles={vehicles} 
            trips={trips} 
          />
        </div>
        <div className="order-1 xl:order-2">
          <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm">
            <ExpensesChart 
              expenses={expenses}
              data={expensesByCategory}
            />
          </div>
        </div>
      </div>
      
      {/* Gráfico de gastos mensuales - Ocupa todo el ancho */}
      <MonthlyExpenseChart expenses={expenses} />
      
      {/* Gastos por vehículo si hay más de un vehículo */}
      {vehicles.length > 1 && Object.keys(expensesByVehicle).length > 1 && (
        <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Gastos por Vehículo</h3>
          <div className="h-64 sm:h-80">
            <ExpensesChart 
              expenses={expenses}
              data={expensesByVehicle} 
              dataKeyMap={vehicles.reduce((acc, vehicle) => {
                acc[vehicle.id] = vehicle.plate;
                return acc;
              }, {} as Record<string, string>)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseReportCharts;
