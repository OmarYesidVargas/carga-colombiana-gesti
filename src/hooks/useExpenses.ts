
import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/types';
import { User } from '@supabase/supabase-js';
import { loadExpenses, addExpense as addExpenseService, updateExpense as updateExpenseService, deleteExpense as deleteExpenseService } from '@/services/expensesService';

/**
 * Hook personalizado para gestionar gastos
 * @param {User | null} user - Usuario autenticado
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Funciones y estado para gestionar gastos
 */
export const useExpenses = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  /**
   * Efecto para cargar gastos cuando cambia el usuario
   */
  useEffect(() => {
    const fetchExpenses = async () => {
      if (user) {
        setGlobalLoading(true);
        setLoading(true);
        try {
          const loadedExpenses = await loadExpenses(user);
          setExpenses(loadedExpenses);
        } catch (error) {
          console.error('Error al cargar gastos:', error);
        } finally {
          setGlobalLoading(false);
          setLoading(false);
        }
      } else {
        setExpenses([]);
      }
    };
    
    fetchExpenses();
  }, [user, setGlobalLoading]);
  
  /**
   * Obtiene un gasto por su ID
   * @param {string} id - ID del gasto
   * @returns {Expense | undefined} Gasto encontrado o undefined
   */
  const getExpenseById = useCallback((id: string) => {
    return expenses.find(expense => expense.id === id);
  }, [expenses]);
  
  /**
   * Agrega un nuevo gasto
   */
  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense | void> => {
    setLoading(true);
    try {
      const newExpense = await addExpenseService(user, expense);
      
      if (newExpense) {
        setExpenses(prev => [...prev, newExpense]);
        return newExpense;
      }
    } catch (error) {
      console.error('Error en useExpenses al agregar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  /**
   * Actualiza un gasto existente
   */
  const updateExpense = useCallback(async (id: string, expense: Partial<Expense>) => {
    setLoading(true);
    try {
      const success = await updateExpenseService(user, id, expense);
      
      if (success) {
        setExpenses(prev => 
          prev.map(e => e.id === id ? { ...e, ...expense } : e)
        );
      }
      
      return success;
    } catch (error) {
      console.error('Error en useExpenses al actualizar:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  /**
   * Elimina un gasto
   */
  const deleteExpense = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteExpenseService(user, id);
      
      if (success) {
        setExpenses(prev => prev.filter(e => e.id !== id));
      }
      
      return success;
    } catch (error) {
      console.error('Error en useExpenses al eliminar:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  return {
    expenses,
    loading,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense
  };
};
