
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types';
import { toast } from 'sonner';
import { mapExpenseFromDB, mapExpenseToDB } from '@/utils/expenseMappers';

/**
 * Carga gastos desde Supabase para un usuario específico
 */
export const loadExpenses = async (user: User | null): Promise<Expense[]> => {
  if (!user) return [];
  
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Mapear datos de la DB al formato de la aplicación
    return data.map(mapExpenseFromDB);
  } catch (error) {
    console.error('Error al cargar gastos:', error);
    toast.error('Error al cargar los gastos');
    return [];
  }
};

/**
 * Agrega un nuevo gasto
 */
export const addExpense = async (
  user: User | null, 
  expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Expense | void> => {
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
    
    // Mapear respuesta
    const mappedExpense = mapExpenseFromDB(data);
    
    toast.success('Gasto agregado correctamente');
    
    return mappedExpense;
  } catch (error) {
    console.error('Error al agregar gasto:', error);
    toast.error('Error al agregar el gasto');
  }
};

/**
 * Actualiza un gasto existente
 */
export const updateExpense = async (
  user: User | null, 
  id: string, 
  expense: Partial<Expense>
): Promise<boolean> => {
  if (!user) return false;
  
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
    
    toast.success('Gasto actualizado correctamente');
    return true;
  } catch (error) {
    console.error('Error al actualizar gasto:', error);
    toast.error('Error al actualizar el gasto');
    return false;
  }
};

/**
 * Elimina un gasto
 */
export const deleteExpense = async (
  user: User | null, 
  id: string
): Promise<boolean> => {
  if (!user) return false;
  
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
    
    toast.success('Gasto eliminado correctamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    toast.error('Error al eliminar el gasto');
    return false;
  }
};
