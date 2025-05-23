
import { Expense } from '@/types';

/**
 * Mapeador para convertir datos de la DB al formato de la aplicación
 */
export const mapExpenseFromDB = (expense: any): Expense => {
  return {
    id: expense.id,
    userId: expense.user_id,
    vehicleId: expense.vehicle_id,
    tripId: expense.trip_id,
    category: expense.category,
    amount: expense.amount,
    date: expense.date,
    description: expense.description || null,
    receiptUrl: expense.receipt_url || null,
    createdAt: expense.created_at,
    updatedAt: expense.updated_at
  };
};

/**
 * Mapeador para convertir datos de la aplicación al formato de la DB
 */
export const mapExpenseToDB = (expense: Partial<Expense>): any => {
  const mappedExpense: Record<string, any> = {};
  
  if (expense.category !== undefined) mappedExpense.category = expense.category;
  if (expense.amount !== undefined) mappedExpense.amount = expense.amount;
  if (expense.date !== undefined) mappedExpense.date = expense.date;
  if (expense.description !== undefined) mappedExpense.description = expense.description;
  if (expense.receiptUrl !== undefined) mappedExpense.receipt_url = expense.receiptUrl;
  if (expense.tripId !== undefined) mappedExpense.trip_id = expense.tripId;
  if (expense.vehicleId !== undefined) mappedExpense.vehicle_id = expense.vehicleId;
  if (expense.userId !== undefined) mappedExpense.user_id = expense.userId;
  
  return mappedExpense;
};
