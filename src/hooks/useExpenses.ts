
/**
 * Hook personalizado para gestionar gastos en TransporegistrosPlus
 * 
 * Este hook encapsula toda la lógica relacionada con gastos incluyendo:
 * - Carga de gastos desde Supabase
 * - Creación de nuevos gastos
 * - Actualización de gastos existentes
 * - Eliminación de gastos
 * - Manejo de estados de carga y errores
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/types';
import { User } from '@supabase/supabase-js';
import { validateExpense } from '@/utils/validators';
import { 
  loadExpenses, 
  addExpense as addExpenseService, 
  updateExpense as updateExpenseService, 
  deleteExpense as deleteExpenseService 
} from '@/services/expensesService';

/**
 * Hook personalizado para gestionar gastos
 * 
 * @param {User | null} user - Usuario autenticado actual
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Objeto con funciones y estado para gestionar gastos
 */
export const useExpenses = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  // Estados locales
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Efecto para cargar gastos cuando cambia el usuario
   * Se ejecuta automáticamente al montar el componente y cuando cambia el usuario
   */
  useEffect(() => {
    const fetchExpenses = async () => {
      // Solo cargar si hay un usuario autenticado
      if (!user) {
        setExpenses([]);
        setError(null);
        return;
      }

      try {
        setGlobalLoading(true);
        setLoading(true);
        setError(null);
        
        console.log('Cargando gastos para el usuario:', user.id);
        
        const loadedExpenses = await loadExpenses(user);
        
        console.log('Gastos cargados exitosamente:', loadedExpenses.length);
        setExpenses(loadedExpenses);
      } catch (error) {
        const errorMessage = 'Error al cargar los gastos';
        console.error(errorMessage, error);
        setError(errorMessage);
      } finally {
        setGlobalLoading(false);
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, [user, setGlobalLoading]);
  
  /**
   * Obtiene un gasto específico por su ID
   * 
   * @param {string} id - ID del gasto a buscar
   * @returns {Expense | undefined} Gasto encontrado o undefined si no existe
   */
  const getExpenseById = useCallback((id: string): Expense | undefined => {
    if (!id || typeof id !== 'string') {
      console.warn('getExpenseById: ID inválido proporcionado');
      return undefined;
    }
    
    return expenses.find(expense => expense.id === id);
  }, [expenses]);
  
  /**
   * Agrega un nuevo gasto
   * 
   * @param {Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} expense - Datos del nuevo gasto
   * @returns {Promise<Expense | void>} Gasto creado o void si hay error
   */
  const addExpense = useCallback(async (
    expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Expense | void> => {
    // Validar que el usuario esté autenticado
    if (!user) {
      const errorMessage = 'Usuario no autenticado';
      console.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    // Validar datos del gasto
    if (!validateExpense(expense)) {
      const errorMessage = 'Datos del gasto inválidos';
      console.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Agregando nuevo gasto:', expense);
      
      const newExpense = await addExpenseService(user, expense);
      
      if (newExpense) {
        // Actualizar estado local agregando el nuevo gasto al inicio
        setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
        console.log('Gasto agregado exitosamente:', newExpense.id);
        return newExpense;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al agregar el gasto';
      console.error('Error en useExpenses al agregar:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  /**
   * Actualiza un gasto existente
   * 
   * @param {string} id - ID del gasto a actualizar
   * @param {Partial<Expense>} expenseUpdates - Datos a actualizar
   * @returns {Promise<boolean>} true si la actualización fue exitosa
   */
  const updateExpense = useCallback(async (
    id: string, 
    expenseUpdates: Partial<Expense>
  ): Promise<boolean> => {
    // Validar parámetros
    if (!user) {
      const errorMessage = 'Usuario no autenticado';
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    if (!id || typeof id !== 'string') {
      const errorMessage = 'ID de gasto inválido';
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    // Verificar que el gasto existe
    const existingExpense = getExpenseById(id);
    if (!existingExpense) {
      const errorMessage = 'Gasto no encontrado';
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    // Validar datos actualizados
    const updatedExpense = { ...existingExpense, ...expenseUpdates };
    if (!validateExpense(updatedExpense)) {
      const errorMessage = 'Datos actualizados del gasto son inválidos';
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Actualizando gasto:', id, expenseUpdates);
      
      const success = await updateExpenseService(user, id, expenseUpdates);
      
      if (success) {
        // Actualizar estado local
        setExpenses(prevExpenses => 
          prevExpenses.map(expense => 
            expense.id === id ? { ...expense, ...expenseUpdates } : expense
          )
        );
        console.log('Gasto actualizado exitosamente:', id);
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar el gasto';
      console.error('Error en useExpenses al actualizar:', error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getExpenseById]);
  
  /**
   * Elimina un gasto
   * 
   * @param {string} id - ID del gasto a eliminar
   * @returns {Promise<boolean>} true si la eliminación fue exitosa
   */
  const deleteExpense = useCallback(async (id: string): Promise<boolean> => {
    // Validar parámetros
    if (!user) {
      const errorMessage = 'Usuario no autenticado';
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    if (!id || typeof id !== 'string') {
      const errorMessage = 'ID de gasto inválido';
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    // Verificar que el gasto existe
    const existingExpense = getExpenseById(id);
    if (!existingExpense) {
      const errorMessage = 'Gasto no encontrado';
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Eliminando gasto:', id);
      
      const success = await deleteExpenseService(user, id);
      
      if (success) {
        // Actualizar estado local removiendo el gasto
        setExpenses(prevExpenses => 
          prevExpenses.filter(expense => expense.id !== id)
        );
        console.log('Gasto eliminado exitosamente:', id);
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al eliminar el gasto';
      console.error('Error en useExpenses al eliminar:', error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getExpenseById]);

  /**
   * Función para limpiar errores manualmente
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Función para recargar gastos manualmente
   */
  const reloadExpenses = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const loadedExpenses = await loadExpenses(user);
      setExpenses(loadedExpenses);
    } catch (error) {
      const errorMessage = 'Error al recargar los gastos';
      console.error(errorMessage, error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Retornar todas las funciones y estados disponibles
  return {
    // Estado
    expenses,
    loading,
    error,
    
    // Funciones principales
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Funciones auxiliares
    clearError,
    reloadExpenses
  };
};
