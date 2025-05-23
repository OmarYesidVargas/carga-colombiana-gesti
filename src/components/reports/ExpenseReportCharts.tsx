
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

const ExpenseReportCharts: React.FC<ExpenseReportChartsProps> = ({
  expenses,
  vehicles,
  trips,
  expensesByCategory,
  expensesByVehicle
}) => {
  return (
    <div className="space-y-6">
      {/* Resumen y gráfico de categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseSummary 
          expenses={expenses} 
          vehicles={vehicles} 
          trips={trips} 
        />
        <ExpensesChart 
          expenses={expenses}
          data={expensesByCategory}
        />
      </div>
      
      {/* Gráfico de gastos mensuales */}
      <MonthlyExpenseChart expenses={expenses} />
      
      {/* Gastos por vehículo si hay más de un vehículo */}
      {vehicles.length > 1 && Object.keys(expensesByVehicle).length > 1 && (
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Gastos por Vehículo</h3>
          <div className="h-64">
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
