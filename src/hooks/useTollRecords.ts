
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TollRecord } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateTollRecord } from '@/utils/validators';
import { mapTollRecordFromDB, mapTollRecordToDB } from '@/utils/tollMappers';

/**
 * Hook optimizado para gestionar registros de peajes
 */
export const useTollRecords = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  
  /**
   * Carga todos los registros de peaje del usuario
   */
  const loadTollRecords = async () => {
    if (!user) {
      setTollRecords([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('🔄 [TollRecords] Cargando registros para usuario:', user.id);
      
      const { data, error } = await supabase
        .from('toll_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [TollRecords] Error al cargar registros:', error);
        toast.error('Error al cargar los registros de peajes');
        return;
      }
      
      if (!data) {
        setTollRecords([]);
        return;
      }
      
      // Mapear registros válidos
      const mappedRecords = data
        .filter(record => record && typeof record === 'object')
        .map(record => {
          try {
            return mapTollRecordFromDB(record);
          } catch (error) {
            console.error('❌ [TollRecords] Error al mapear registro:', error, record);
            return null;
          }
        })
        .filter(Boolean) as TollRecord[];
      
      console.log('✅ [TollRecords] Registros cargados:', mappedRecords.length);
      setTollRecords(mappedRecords);
    } catch (error) {
      console.error('❌ [TollRecords] Error inesperado:', error);
      toast.error('Error inesperado al cargar los registros');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  useEffect(() => {
    loadTollRecords();
  }, [user]);
  
  /**
   * Obtiene un registro por ID
   */
  const getTollRecordById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return tollRecords.find(record => record.id === id);
  };
  
  /**
   * Agrega un nuevo registro de peaje
   */
  const addTollRecord = async (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      // Validar datos
      if (!validateTollRecord(record)) {
        toast.error('Datos del registro incompletos o inválidos');
        return;
      }
      
      // Preparar datos para DB
      const newRecord = mapTollRecordToDB({
        ...record,
        userId: user.id
      });
      
      // Validaciones específicas
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
      
      // Convertir fecha si es necesario
      if (newRecord.date instanceof Date) {
        newRecord.date = newRecord.date.toISOString();
      }
      
      console.log('📝 [TollRecords] Creando nuevo registro:', newRecord);
      
      const { data, error } = await supabase
        .from('toll_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) {
        console.error('❌ [TollRecords] Error de Supabase:', error);
        
        if (error.code === '23502') {
          toast.error('Faltan datos obligatorios en el registro');
        } else if (error.code === '23503') {
          toast.error('Referencias inválidas en el registro');
        } else {
          toast.error('Error al guardar el registro de peaje');
        }
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el registro');
        return;
      }
      
      // Agregar al estado local
      const mappedRecord = mapTollRecordFromDB(data);
      setTollRecords(prev => [mappedRecord, ...prev]);
      
      console.log('✅ [TollRecords] Registro creado:', mappedRecord.id);
      toast.success('Registro de peaje agregado correctamente');
    } catch (error) {
      console.error('❌ [TollRecords] Error inesperado:', error);
      toast.error('Error inesperado al agregar el registro');
    }
  };
  
  /**
   * Actualiza un registro existente
   */
  const updateTollRecord = async (id: string, record: Partial<TollRecord>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      console.log('🔄 [TollRecords] Actualizando registro:', id, record);
      
      const updatedRecord = mapTollRecordToDB(record);
      
      // Convertir fecha si es necesario
      if (updatedRecord.date instanceof Date) {
        updatedRecord.date = updatedRecord.date.toISOString();
      }
      
      const { error } = await supabase
        .from('toll_records')
        .update(updatedRecord)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ [TollRecords] Error al actualizar:', error);
        toast.error('Error al actualizar el registro');
        return;
      }
      
      // Actualizar estado local
      setTollRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record } : r)
      );
      
      console.log('✅ [TollRecords] Registro actualizado:', id);
      toast.success('Registro actualizado correctamente');
    } catch (error) {
      console.error('❌ [TollRecords] Error inesperado al actualizar:', error);
      toast.error('Error inesperado al actualizar');
    }
  };
  
  /**
   * Elimina un registro
   */
  const deleteTollRecord = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      console.log('🗑️ [TollRecords] Eliminando registro:', id);
      
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ [TollRecords] Error al eliminar:', error);
        toast.error('Error al eliminar el registro');
        return;
      }
      
      // Actualizar estado local
      setTollRecords(prev => prev.filter(r => r.id !== id));
      
      console.log('✅ [TollRecords] Registro eliminado:', id);
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('❌ [TollRecords] Error inesperado al eliminar:', error);
      toast.error('Error inesperado al eliminar');
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
