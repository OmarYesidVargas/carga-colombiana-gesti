
import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subMonths } from 'date-fns';
import { Expense, ExpenseCategory } from '@/types';

/**
 * Custom hook to manage expense report filters and calculations
 */
export const useExpenseReport = (expenses: Expense[]) => {
  // Filter states
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });
  
  // Reset all filters
  const resetFilters = () => {
    setVehicleFilter('all');
    setCategoryFilter('all');
    setDateRange(undefined);
  };
  
  // Apply filters to expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Filter by vehicle
      const matchesVehicle = 
        vehicleFilter === 'all' || expense.vehicleId === vehicleFilter;
      
      // Filter by category
      const matchesCategory = 
        categoryFilter === 'all' || expense.category === categoryFilter as ExpenseCategory;
      
      // Filter by date range
      const expenseDate = new Date(expense.date);
      const matchesDateRange = 
        (!dateRange?.from || expenseDate >= dateRange.from) &&
        (!dateRange?.to || expenseDate <= dateRange.to);
      
      return matchesVehicle && matchesCategory && matchesDateRange;
    });
  }, [expenses, vehicleFilter, categoryFilter, dateRange]);
  
  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);
  
  // Calcular gastos por categoría
  const expensesByCategory = useMemo(() => {
    const result: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (!result[expense.category]) {
        result[expense.category] = 0;
      }
      result[expense.category] += expense.amount;
    });
    
    return result;
  }, [filteredExpenses]);
  
  // Calcular gastos por vehículo
  const expensesByVehicle = useMemo(() => {
    const result: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (!result[expense.vehicleId]) {
        result[expense.vehicleId] = 0;
      }
      result[expense.vehicleId] += expense.amount;
    });
    
    return result;
  }, [filteredExpenses]);
  
  return {
    // Filter states
    vehicleFilter,
    setVehicleFilter,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    resetFilters,
    
    // Filtered data
    filteredExpenses,
    totalExpenses,
    expensesByCategory,
    expensesByVehicle
  };
};
