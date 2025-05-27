
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types';
import { toast } from 'sonner';
import { mapExpenseFromDB, mapExpenseToDB, validateExpenseData } from '@/utils/expenseMappers';

/**
 * Carga gastos desde Supabase para un usuario específico
 */
export const loadExpenses = async (user: User | null): Promise<Expense[]> => {
  if (!user) {
    console.log('❌ [ExpensesService] Usuario no autenticado');
    return [];
  }
  
  try {
    console.log('🔄 [ExpensesService] Cargando gastos para usuario:', user.id);
    
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('❌ [ExpensesService] Error en Supabase:', error);
      throw error;
    }
    
    console.log('✅ [ExpensesService] Datos cargados:', data?.length || 0, 'gastos');
    
    // Mapear datos de la DB al formato de la aplicación
    const mappedExpenses = data.map(mapExpenseFromDB);
    console.log('✅ [ExpensesService] Gastos mapeados correctamente');
    
    return mappedExpenses;
  } catch (error) {
    console.error('❌ [ExpensesService] Error al cargar gastos:', error);
    toast.error('Error al cargar los gastos');
    return [];
  }
};

/**
 * Agrega un nuevo gasto con validación completa
 */
export const addExpense = async (
  user: User | null, 
  expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Expense | void> => {
  if (!user) {
    console.error('❌ [ExpensesService] Usuario no autenticado');
    toast.error('Usuario no autenticado');
    return;
  }
  
  try {
    console.log('🔄 [ExpensesService] Agregando gasto:', expense);
    
    // Validar datos antes de procesar
    const validation = validateExpenseData(expense);
    if (!validation.isValid) {
      console.error('❌ [ExpensesService] Datos inválidos:', validation.errors);
      toast.error(`Datos inválidos: ${validation.errors.join(', ')}`);
      return;
    }
    
    // Preparar datos para la DB
    const expenseWithUser = {
      ...expense,
      userId: user.id
    };
    
    const newExpense = mapExpenseToDB(expenseWithUser);
    console.log('🔄 [ExpensesService] Datos preparados para DB:', newExpense);
    
    // Insertar en Supabase
    const { data, error } = await supabase
      .from('expenses')
      .insert(newExpense)
      .select()
      .single();
    
    if (error) {
      console.error('❌ [ExpensesService] Error en inserción Supabase:', error);
      throw error;
    }
    
    if (!data) {
      console.error('❌ [ExpensesService] No se recibieron datos de Supabase');
      throw new Error('No se recibieron datos después de la inserción');
    }
    
    console.log('✅ [ExpensesService] Gasto insertado en DB:', data);
    
    // Mapear respuesta
    const mappedExpense = mapExpenseFromDB(data);
    console.log('✅ [ExpensesService] Gasto mapeado:', mappedExpense);
    
    toast.success('Gasto agregado correctamente');
    return mappedExpense;
    
  } catch (error: any) {
    console.error('❌ [ExpensesService] Error crítico al agregar gasto:', error);
    
    // Mensajes de error más específicos
    if (error.code === '23503') {
      toast.error('Error: El viaje o vehículo seleccionado no existe');
    } else if (error.code === '23505') {
      toast.error('Error: Ya existe un gasto con estos datos');
    } else {
      toast.error(`Error al agregar el gasto: ${error.message || 'Error desconocido'}`);
    }
  }
};

/**
 * Actualiza un gasto existente con validación completa
 */
export const updateExpense = async (
  user: User | null, 
  id: string, 
  expense: Partial<Expense>
): Promise<boolean> => {
  if (!user) {
    console.error('❌ [ExpensesService] Usuario no autenticado');
    toast.error('Usuario no autenticado');
    return false;
  }
  
  if (!id) {
    console.error('❌ [ExpensesService] ID de gasto no proporcionado');
    toast.error('ID de gasto inválido');
    return false;
  }
  
  try {
    console.log('🔄 [ExpensesService] Actualizando gasto:', id, expense);
    
    // Validar datos si se están actualizando campos críticos
    if (expense.amount !== undefined || expense.category !== undefined) {
      const validation = validateExpenseData(expense);
      if (!validation.isValid) {
        console.error('❌ [ExpensesService] Datos inválidos:', validation.errors);
        toast.error(`Datos inválidos: ${validation.errors.join(', ')}`);
        return false;
      }
    }
    
    // Mapear datos para la DB
    const updatedExpense = mapExpenseToDB(expense);
    console.log('🔄 [ExpensesService] Datos preparados para actualización:', updatedExpense);
    
    // Actualizar en Supabase
    const { error } = await supabase
      .from('expenses')
      .update(updatedExpense)
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('❌ [ExpensesService] Error en actualización Supabase:', error);
      throw error;
    }
    
    console.log('✅ [ExpensesService] Gasto actualizado correctamente');
    toast.success('Gasto actualizado correctamente');
    return true;
    
  } catch (error: any) {
    console.error('❌ [ExpensesService] Error al actualizar gasto:', error);
    toast.error(`Error al actualizar el gasto: ${error.message || 'Error desconocido'}`);
    return false;
  }
};

/**
 * Elimina un gasto con validación
 */
export const deleteExpense = async (
  user: User | null, 
  id: string
): Promise<boolean> => {
  if (!user) {
    console.error('❌ [ExpensesService] Usuario no autenticado');
    toast.error('Usuario no autenticado');
    return false;
  }
  
  if (!id) {
    console.error('❌ [ExpensesService] ID de gasto no proporcionado');
    toast.error('ID de gasto inválido');
    return false;
  }
  
  try {
    console.log('🔄 [ExpensesService] Eliminando gasto:', id);
    
    // Eliminar de Supabase
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('❌ [ExpensesService] Error en eliminación Supabase:', error);
      throw error;
    }
    
    console.log('✅ [ExpensesService] Gasto eliminado correctamente');
    toast.success('Gasto eliminado correctamente');
    return true;
    
  } catch (error: any) {
    console.error('❌ [ExpensesService] Error al eliminar gasto:', error);
    toast.error(`Error al eliminar el gasto: ${error.message || 'Error desconocido'}`);
    return false;
  }
};
