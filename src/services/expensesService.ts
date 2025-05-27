
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types';
import { toast } from 'sonner';
import { mapExpenseFromDB, mapExpenseToDB, validateExpenseData } from '@/utils/expenseMappers';

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
    
    const mappedExpenses = data?.map(mapExpenseFromDB) || [];
    console.log('✅ [ExpensesService] Gastos mapeados correctamente');
    
    return mappedExpenses;
  } catch (error) {
    console.error('❌ [ExpensesService] Error al cargar gastos:', error);
    toast.error('Error al cargar los gastos');
    return [];
  }
};

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
    
    // Preparar datos completos
    const expenseWithUser = {
      ...expense,
      userId: user.id,
      amount: Number(expense.amount) // Asegurar conversión numérica
    };
    
    // Validar datos
    const validation = validateExpenseData(expenseWithUser);
    if (!validation.isValid) {
      console.error('❌ [ExpensesService] Datos inválidos:', validation.errors);
      toast.error(`Datos inválidos: ${validation.errors.join(', ')}`);
      return;
    }
    
    // Verificar que el viaje existe y pertenece al usuario
    const { data: tripData, error: tripError } = await supabase
      .from('trips')
      .select('id, vehicle_id')
      .eq('id', expense.tripId)
      .eq('user_id', user.id)
      .single();
    
    if (tripError || !tripData) {
      console.error('❌ [ExpensesService] Viaje no encontrado:', tripError);
      toast.error('El viaje seleccionado no existe o no te pertenece');
      return;
    }
    
    // Verificar consistencia del vehículo
    if (tripData.vehicle_id !== expense.vehicleId) {
      console.error('❌ [ExpensesService] Inconsistencia en vehículo');
      toast.error('El vehículo no coincide con el del viaje seleccionado');
      return;
    }
    
    const newExpense = mapExpenseToDB(expenseWithUser);
    console.log('🔄 [ExpensesService] Datos preparados para DB:', newExpense);
    
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
    
    const mappedExpense = mapExpenseFromDB(data);
    console.log('✅ [ExpensesService] Gasto mapeado:', mappedExpense);
    
    toast.success('Gasto agregado correctamente');
    return mappedExpense;
    
  } catch (error: any) {
    console.error('❌ [ExpensesService] Error crítico al agregar gasto:', error);
    
    if (error.code === '23503') {
      toast.error('Error: El viaje o vehículo seleccionado no existe');
    } else if (error.code === '23505') {
      toast.error('Error: Ya existe un gasto con estos datos');
    } else {
      toast.error(`Error al agregar el gasto: ${error.message || 'Error desconocido'}`);
    }
  }
};

export const updateExpense = async (
  user: User | null, 
  id: string, 
  expense: Partial<Expense>
): Promise<boolean> => {
  if (!user || !id) {
    console.error('❌ [ExpensesService] Parámetros inválidos');
    toast.error('Parámetros inválidos para actualizar');
    return false;
  }
  
  try {
    console.log('🔄 [ExpensesService] Actualizando gasto:', id, expense);
    
    // Preparar datos con conversión numérica si es necesario
    const expenseToUpdate = { ...expense };
    if (expenseToUpdate.amount !== undefined) {
      expenseToUpdate.amount = Number(expenseToUpdate.amount);
    }
    
    // Validar datos críticos si se están actualizando
    const fieldsToValidate = ['amount', 'category', 'date', 'tripId', 'vehicleId'];
    const hasImportantChanges = fieldsToValidate.some(field => expenseToUpdate[field] !== undefined);
    
    if (hasImportantChanges) {
      const validation = validateExpenseData(expenseToUpdate);
      if (!validation.isValid) {
        console.error('❌ [ExpensesService] Datos inválidos:', validation.errors);
        toast.error(`Datos inválidos: ${validation.errors.join(', ')}`);
        return false;
      }
    }
    
    const updatedExpense = mapExpenseToDB(expenseToUpdate);
    console.log('🔄 [ExpensesService] Datos preparados para actualización:', updatedExpense);
    
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

export const deleteExpense = async (
  user: User | null, 
  id: string
): Promise<boolean> => {
  if (!user || !id) {
    console.error('❌ [ExpensesService] Parámetros inválidos');
    toast.error('Parámetros inválidos para eliminar');
    return false;
  }
  
  try {
    console.log('🔄 [ExpensesService] Eliminando gasto:', id);
    
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
