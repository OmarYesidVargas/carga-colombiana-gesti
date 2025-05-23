
import React from 'react';
import { Expense, Vehicle, Trip } from '@/types';
import ExpenseSummary from './ExpenseSummary';
import ExpensesChart from './ExpensesChart';
import MonthlyExpenseChart from './MonthlyExpenseChart';

interface ExpenseReportChartsProps {
  expenses: Expense[];
  vehicles: Vehicle[];
  trips: Trip[];
}

const ExpenseReportCharts: React.FC<ExpenseReportChartsProps> = ({
  expenses,
  vehicles,
  trips
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
        <ExpensesChart expenses={expenses} />
      </div>
      
      {/* Gráfico de gastos mensuales */}
      <MonthlyExpenseChart expenses={expenses} />
    </div>
  );
};

export default ExpenseReportCharts;
