
import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/types';
import { User } from '@supabase/supabase-js';
import { validateExpense } from '@/utils/validators';
import { useAuditLogger } from './useAuditLogger';
import { 
  loadExpenses, 
  addExpense as addExpenseService, 
  updateExpense as updateExpenseService, 
  deleteExpense as deleteExpenseService 
} from '@/services/expensesService';

export const useExpenses = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { logRead, logCreate, logUpdate, logDelete } = useAuditLogger(user);
  
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) {
        setExpenses([]);
        setError(null);
        return;
      }

      try {
        setGlobalLoading(true);
        setLoading(true);
        setError(null);
        
        console.log('🔄 [useExpenses] Cargando gastos para el usuario:', user.id);
        
        const loadedExpenses = await loadExpenses(user);
        
        await logRead('expenses', undefined, { 
          count: loadedExpenses.length,
          action: 'load_all_expenses'
        });
        
        console.log('✅ [useExpenses] Gastos cargados exitosamente:', loadedExpenses.length);
        setExpenses(loadedExpenses);
      } catch (error) {
        const errorMessage = 'Error al cargar los gastos';
        console.error('❌ [useExpenses] Error al cargar:', error);
        setError(errorMessage);
      } finally {
        setGlobalLoading(false);
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, [user, setGlobalLoading, logRead]);
  
  const getExpenseById = useCallback((id: string): Expense | undefined => {
    if (!id || typeof id !== 'string') {
      console.warn('❌ [useExpenses] getExpenseById: ID inválido proporcionado');
      return undefined;
    }
    
    const expense = expenses.find(expense => expense.id === id);
    
    if (expense) {
      logRead('expenses', id, { action: 'get_expense_by_id' });
    }
    
    return expense;
  }, [expenses, logRead]);
  
  const addExpense = useCallback(async (
    expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Expense | void> => {
    if (!user) {
      const errorMessage = 'Usuario no autenticado';
      console.error('❌ [useExpenses] addExpense:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    // Validar datos básicos
    const expenseToValidate = {
      ...expense,
      userId: user.id,
      id: 'temp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!validateExpense(expenseToValidate)) {
      const errorMessage = 'Datos del gasto inválidos';
      console.error('❌ [useExpenses] Validación fallida:', expense);
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useExpenses] Agregando nuevo gasto:', expense);
      
      const newExpense = await addExpenseService(user, expense);
      
      if (newExpense) {
        await logCreate('expenses', newExpense.id, {
          category: newExpense.category,
          amount: newExpense.amount,
          tripId: newExpense.tripId,
          vehicleId: newExpense.vehicleId,
          description: newExpense.description
        }, { action: 'create_expense' });
        
        setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
        console.log('✅ [useExpenses] Gasto agregado exitosamente:', newExpense.id);
        return newExpense;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al agregar el gasto';
      console.error('❌ [useExpenses] Error al agregar:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, logCreate]);
  
  const updateExpense = useCallback(async (
    id: string, 
    expenseUpdates: Partial<Expense>
  ): Promise<boolean> => {
    if (!user || !id) {
      const errorMessage = 'Parámetros inválidos para actualizar';
      console.error('❌ [useExpenses] updateExpense:', errorMessage);
      setError(errorMessage);
      return false;
    }

    const existingExpense = getExpenseById(id);
    if (!existingExpense) {
      const errorMessage = 'Gasto no encontrado';
      console.error('❌ [useExpenses] Gasto no encontrado:', id);
      setError(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useExpenses] Actualizando gasto:', id, expenseUpdates);
      
      const success = await updateExpenseService(user, id, expenseUpdates);
      
      if (success) {
        await logUpdate('expenses', id, {
          category: existingExpense.category,
          amount: existingExpense.amount,
          description: existingExpense.description
        }, expenseUpdates, { action: 'update_expense' });
        
        setExpenses(prevExpenses => 
          prevExpenses.map(expense => 
            expense.id === id ? { ...expense, ...expenseUpdates } : expense
          )
        );
        console.log('✅ [useExpenses] Gasto actualizado exitosamente:', id);
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar el gasto';
      console.error('❌ [useExpenses] Error al actualizar:', error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getExpenseById, logUpdate]);
  
  const deleteExpense = useCallback(async (id: string): Promise<boolean> => {
    if (!user || !id) {
      const errorMessage = 'Parámetros inválidos para eliminar';
      console.error('❌ [useExpenses] deleteExpense:', errorMessage);
      setError(errorMessage);
      return false;
    }

    const existingExpense = getExpenseById(id);
    if (!existingExpense) {
      const errorMessage = 'Gasto no encontrado';
      console.error('❌ [useExpenses] Gasto no encontrado:', id);
      setError(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useExpenses] Eliminando gasto:', id);
      
      const success = await deleteExpenseService(user, id);
      
      if (success) {
        await logDelete('expenses', id, {
          category: existingExpense.category,
          amount: existingExpense.amount,
          tripId: existingExpense.tripId,
          vehicleId: existingExpense.vehicleId,
          description: existingExpense.description
        }, { action: 'delete_expense' });
        
        setExpenses(prevExpenses => 
          prevExpenses.filter(expense => expense.id !== id)
        );
        console.log('✅ [useExpenses] Gasto eliminado exitosamente:', id);
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al eliminar el gasto';
      console.error('❌ [useExpenses] Error al eliminar:', error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getExpenseById, logDelete]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reloadExpenses = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const loadedExpenses = await loadExpenses(user);
      
      await logRead('expenses', undefined, { 
        count: loadedExpenses.length,
        action: 'reload_expenses'
      });
      
      setExpenses(loadedExpenses);
    } catch (error) {
      const errorMessage = 'Error al recargar los gastos';
      console.error('❌ [useExpenses] Error al recargar:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, logRead]);
  
  return {
    expenses,
    loading,
    error,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense,
    clearError,
    reloadExpenses
  };
};
