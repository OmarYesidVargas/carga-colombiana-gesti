
import { useState, useEffect } from 'react';
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
  
  /**
   * Efecto para cargar gastos cuando cambia el usuario
   */
  useEffect(() => {
    const fetchExpenses = async () => {
      if (user) {
        setGlobalLoading(true);
        const loadedExpenses = await loadExpenses(user);
        setExpenses(loadedExpenses);
        setGlobalLoading(false);
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
  const getExpenseById = (id: string) => {
    return expenses.find(expense => expense.id === id);
  };
  
  /**
   * Agrega un nuevo gasto
   */
  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense | void> => {
    const newExpense = await addExpenseService(user, expense);
    
    if (newExpense) {
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    }
  };
  
  /**
   * Actualiza un gasto existente
   */
  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    const success = await updateExpenseService(user, id, expense);
    
    if (success) {
      setExpenses(prev => 
        prev.map(e => e.id === id ? { ...e, ...expense } : e)
      );
    }
  };
  
  /**
   * Elimina un gasto
   */
  const deleteExpense = async (id: string) => {
    const success = await deleteExpenseService(user, id);
    
    if (success) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };
  
  return {
    expenses,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense
  };
};
