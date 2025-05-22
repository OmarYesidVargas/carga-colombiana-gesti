
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Hook personalizado para gestionar gastos
 * @param {User | null} user - Usuario autenticado
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Funciones y estado para gestionar gastos
 */
export const useExpenses = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  /**
   * Mapeador para convertir datos de la DB al formato de la aplicación
   */
  const mapExpenseFromDB = (expense: any): Expense => {
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
  const mapExpenseToDB = (expense: Partial<Expense>): any => {
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
  
  /**
   * Carga gastos desde Supabase
   */
  const loadExpenses = async () => {
    if (!user) return;
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Mapear datos de la DB al formato de la aplicación
      const mappedExpenses = data.map(mapExpenseFromDB);
      setExpenses(mappedExpenses);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
      toast.error('Error al cargar los gastos');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  /**
   * Efecto para cargar gastos cuando cambia el usuario
   */
  useEffect(() => {
    if (user) {
      loadExpenses();
    } else {
      setExpenses([]);
    }
  }, [user]);
  
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
   * @param {Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} expense - Datos del gasto
   * @returns {Promise<Expense | void>} Gasto creado o void en caso de error
   */
  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense | void> => {
    if (!user) return;
    
    try {
      console.log('Agregando gasto:', expense);
      
      // Preparar datos para la DB
      const newExpense = mapExpenseToDB({
        ...expense,
        userId: user.id
      });
      
      console.log('Gasto mapeado para DB:', newExpense);
      
      // Insertar en Supabase
      const { data, error } = await supabase
        .from('expenses')
        .insert(newExpense)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log('Respuesta de Supabase:', data);
      
      // Mapear respuesta y actualizar estado local
      const mappedExpense = mapExpenseFromDB(data);
      setExpenses(prev => [...prev, mappedExpense]);
      
      toast.success('Gasto agregado correctamente');
      
      return mappedExpense;
    } catch (error) {
      console.error('Error al agregar gasto:', error);
      toast.error('Error al agregar el gasto');
    }
  };
  
  /**
   * Actualiza un gasto existente
   * @param {string} id - ID del gasto a actualizar
   * @param {Partial<Expense>} expense - Datos parciales del gasto
   */
  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    if (!user) return;
    
    try {
      // Mapear datos para la DB
      const updatedExpense = mapExpenseToDB(expense);
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('expenses')
        .update(updatedExpense)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Actualizar estado local
      setExpenses(prev => 
        prev.map(e => e.id === id ? { ...e, ...expense } : e)
      );
      
      toast.success('Gasto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      toast.error('Error al actualizar el gasto');
    }
  };
  
  /**
   * Elimina un gasto
   * @param {string} id - ID del gasto a eliminar
   */
  const deleteExpense = async (id: string) => {
    if (!user) return;
    
    try {
      // Eliminar de Supabase
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Eliminar del estado local
      setExpenses(prev => prev.filter(e => e.id !== id));
      
      toast.success('Gasto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      toast.error('Error al eliminar el gasto');
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
