
import { useState } from 'react';
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
  const filteredExpenses = expenses.filter(expense => {
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
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
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
    totalExpenses
  };
};
