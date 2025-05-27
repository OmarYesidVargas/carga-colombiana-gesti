
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
    amount: Number(expense.amount),
    date: expense.date,
    description: expense.description || '',
    receiptUrl: expense.receipt_url || undefined,
    createdAt: expense.created_at,
    updatedAt: expense.updated_at
  };
};

/**
 * Mapeador para convertir datos de la aplicación al formato de la DB
 */
export const mapExpenseToDB = (expense: Partial<Expense>): any => {
  const mappedExpense: Record<string, any> = {};
  
  if (expense.id !== undefined) mappedExpense.id = expense.id;
  if (expense.userId !== undefined) mappedExpense.user_id = expense.userId;
  if (expense.vehicleId !== undefined) mappedExpense.vehicle_id = expense.vehicleId;
  if (expense.tripId !== undefined) mappedExpense.trip_id = expense.tripId;
  if (expense.category !== undefined) mappedExpense.category = expense.category;
  if (expense.amount !== undefined) mappedExpense.amount = Number(expense.amount);
  if (expense.date !== undefined) mappedExpense.date = expense.date;
  if (expense.description !== undefined) mappedExpense.description = expense.description || '';
  if (expense.receiptUrl !== undefined) mappedExpense.receipt_url = expense.receiptUrl;
  
  console.log('🔄 [ExpenseMapper] Mapeando expense:', { original: expense, mapped: mappedExpense });
  
  return mappedExpense;
};

/**
 * Validador de datos de gasto con validaciones completas
 */
export const validateExpenseData = (expense: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!expense.category) errors.push('Categoría es requerida');
  if (!expense.amount || isNaN(Number(expense.amount)) || Number(expense.amount) <= 0) {
    errors.push('Monto debe ser un número mayor a 0');
  }
  if (!expense.date) errors.push('Fecha es requerida');
  if (!expense.tripId) errors.push('ID de viaje es requerido');
  if (!expense.vehicleId) errors.push('ID de vehículo es requerido');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
