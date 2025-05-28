
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TollRecord } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateTollRecord } from '@/utils/validators';
import { mapTollRecordFromDB, mapTollRecordToDB } from '@/utils/tollMappers';
import { errorHandler } from '@/utils/errorHandler';

export const useTollRecords = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  
  const loadTollRecords = async () => {
    if (!user) {
      setTollRecords([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('🔄 [useTollRecords] Cargando registros para usuario:', user.id);
      
      const { data, error } = await supabase
        .from('toll_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [useTollRecords] Error al cargar registros:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTollRecords', action: 'loadTollRecords' });
        return;
      }
      
      if (!data) {
        setTollRecords([]);
        return;
      }
      
      const mappedRecords = data
        .filter(record => record && typeof record === 'object')
        .map(record => {
          try {
            return mapTollRecordFromDB(record);
          } catch (error) {
            console.error('❌ [useTollRecords] Error al mapear registro:', error, record);
            return null;
          }
        })
        .filter(Boolean) as TollRecord[];
      
      console.log('✅ [useTollRecords] Registros cargados:', mappedRecords.length);
      setTollRecords(mappedRecords);
    } catch (error) {
      console.error('❌ [useTollRecords] Error inesperado:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecords', action: 'loadTollRecords' });
    } finally {
      setGlobalLoading(false);
    }
  };
  
  useEffect(() => {
    loadTollRecords();
  }, [user]);
  
  const getTollRecordById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return tollRecords.find(record => record.id === id);
  };
  
  const addTollRecord = async (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      if (!validateTollRecord(record)) {
        toast.error('Datos del registro incompletos o inválidos');
        return;
      }
      
      const newRecord = mapTollRecordToDB({
        ...record,
        userId: user.id
      });
      
      if (!newRecord.vehicle_id) {
        toast.error('El vehículo es requerido');
        return;
      }
      
      if (!newRecord.trip_id) {
        toast.error('El viaje es requerido');
        return;
      }
      
      if (!newRecord.toll_id) {
        toast.error('El peaje es requerido');
        return;
      }
      
      if (newRecord.date instanceof Date) {
        newRecord.date = newRecord.date.toISOString();
      }
      
      console.log('📝 [useTollRecords] Creando nuevo registro:', newRecord);
      
      const { data, error } = await supabase
        .from('toll_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) {
        console.error('❌ [useTollRecords] Error de Supabase:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTollRecords', action: 'addTollRecord' });
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el registro');
        return;
      }
      
      const mappedRecord = mapTollRecordFromDB(data);
      setTollRecords(prev => [mappedRecord, ...prev]);
      
      console.log('✅ [useTollRecords] Registro creado:', mappedRecord.id);
      toast.success('Registro de peaje agregado correctamente');
    } catch (error) {
      console.error('❌ [useTollRecords] Error inesperado:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecords', action: 'addTollRecord' });
    }
  };
  
  const updateTollRecord = async (id: string, record: Partial<TollRecord>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      console.log('🔄 [useTollRecords] Actualizando registro:', id, record);
      
      const updatedRecord = mapTollRecordToDB(record);
      
      if (updatedRecord.date instanceof Date) {
        updatedRecord.date = updatedRecord.date.toISOString();
      }
      
      const { error } = await supabase
        .from('toll_records')
        .update(updatedRecord)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ [useTollRecords] Error al actualizar:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTollRecords', action: 'updateTollRecord' });
        return;
      }
      
      setTollRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record } : r)
      );
      
      console.log('✅ [useTollRecords] Registro actualizado:', id);
      toast.success('Registro actualizado correctamente');
    } catch (error) {
      console.error('❌ [useTollRecords] Error inesperado al actualizar:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecords', action: 'updateTollRecord' });
    }
  };
  
  const deleteTollRecord = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      console.log('🗑️ [useTollRecords] Eliminando registro:', id);
      
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ [useTollRecords] Error al eliminar:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTollRecords', action: 'deleteTollRecord' });
        return;
      }
      
      setTollRecords(prev => prev.filter(r => r.id !== id));
      
      console.log('✅ [useTollRecords] Registro eliminado:', id);
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('❌ [useTollRecords] Error inesperado al eliminar:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecords', action: 'deleteTollRecord' });
    }
  };
  
  return {
    tollRecords,
    getTollRecordById,
    addTollRecord,
    updateTollRecord,
    deleteTollRecord
  };
};
