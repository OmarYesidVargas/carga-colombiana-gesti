
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TollRecord } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateTollRecord } from '@/utils/validators';
import { mapTollRecordFromDB, mapTollRecordToDB } from '@/utils/tollMappers';

export const useTollRecords = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  
  const loadTollRecords = async () => {
    if (!user) {
      setTollRecords([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('toll_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar registros de peajes:', error);
        toast.error('Error al cargar los registros de peajes');
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
            console.error('Error al mapear registro:', error, record);
            return null;
          }
        })
        .filter(Boolean) as TollRecord[];
      
      setTollRecords(mappedRecords);
    } catch (error) {
      console.error('Error inesperado al cargar registros:', error);
      toast.error('Error inesperado al cargar los registros');
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
        toast.error('El ID del vehículo es requerido');
        return;
      }
      
      if (!newRecord.trip_id) {
        toast.error('El ID del viaje es requerido');
        return;
      }
      
      if (newRecord.date instanceof Date) {
        newRecord.date = newRecord.date.toISOString();
      }
      
      const { data, error } = await supabase
        .from('toll_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) {
        console.error('Error de Supabase:', error);
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
      
      const mappedRecord = mapTollRecordFromDB(data);
      setTollRecords(prev => [mappedRecord, ...prev]);
      
      toast.success('Registro de peaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar registro:', error);
      toast.error('Error inesperado al agregar el registro');
    }
  };
  
  const updateTollRecord = async (id: string, record: Partial<TollRecord>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      const updatedRecord = mapTollRecordToDB(record);
      
      if (updatedRecord.date instanceof Date) {
        updatedRecord.date = updatedRecord.date.toISOString();
      }
      
      const { error } = await supabase
        .from('toll_records')
        .update(updatedRecord)
        .eq('id', id);
      
      if (error) {
        console.error('Error al actualizar:', error);
        toast.error('Error al actualizar el registro');
        return;
      }
      
      setTollRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record } : r)
      );
      
      toast.success('Registro actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar:', error);
      toast.error('Error inesperado al actualizar');
    }
  };
  
  const deleteTollRecord = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar:', error);
        toast.error('Error al eliminar el registro');
        return;
      }
      
      setTollRecords(prev => prev.filter(r => r.id !== id));
      
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error inesperado al eliminar:', error);
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
