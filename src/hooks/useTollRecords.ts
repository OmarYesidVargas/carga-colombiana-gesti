
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TollRecord } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Hook personalizado para gestionar registros de peajes
 */
export const useTollRecords = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  
  /**
   * Mapeador para convertir datos de la DB al formato de la aplicación
   */
  const mapTollRecordFromDB = (record: any): TollRecord => {
    if (!record || typeof record !== 'object') {
      throw new Error('Registro de peaje inválido');
    }

    return {
      id: record.id,
      userId: record.user_id,
      tripId: record.trip_id,
      vehicleId: record.vehicle_id,
      tollId: record.toll_id,
      date: record.date,
      price: parseFloat(record.price) || 0,
      paymentMethod: record.payment_method || 'efectivo',
      receipt: record.receipt || null,
      notes: record.notes || null,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    };
  };
  
  /**
   * Mapeador para convertir datos de la aplicación al formato de la DB
   */
  const mapTollRecordToDB = (record: Partial<TollRecord>): any => {
    const mappedRecord: Record<string, any> = {};
    
    if (record.tripId) mappedRecord.trip_id = record.tripId;
    if (record.vehicleId) mappedRecord.vehicle_id = record.vehicleId;
    if (record.tollId) mappedRecord.toll_id = record.tollId;
    if (record.date) mappedRecord.date = record.date;
    if (record.price !== undefined) mappedRecord.price = Number(record.price);
    if (record.paymentMethod) mappedRecord.payment_method = record.paymentMethod;
    if (record.receipt !== undefined) mappedRecord.receipt = record.receipt;
    if (record.notes !== undefined) mappedRecord.notes = record.notes;
    if (record.userId) mappedRecord.user_id = record.userId;
    
    return mappedRecord;
  };

  /**
   * Validar datos del registro antes de enviar
   */
  const validateTollRecord = (record: any): boolean => {
    if (!record) return false;
    if (!record.tripId || typeof record.tripId !== 'string') return false;
    if (!record.vehicleId || typeof record.vehicleId !== 'string') return false;
    if (!record.tollId || typeof record.tollId !== 'string') return false;
    if (!record.date) return false;
    if (record.price === undefined || isNaN(Number(record.price))) return false;
    if (!record.paymentMethod || typeof record.paymentMethod !== 'string') return false;
    
    return true;
  };
  
  /**
   * Carga registros de peajes desde Supabase
   */
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
        .eq('user_id', user.id)
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
      
      // Mapear datos con validación
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
  
  /**
   * Efecto para cargar registros cuando cambia el usuario
   */
  useEffect(() => {
    loadTollRecords();
  }, [user]);
  
  /**
   * Obtiene un registro por su ID
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
      // Validar datos de entrada
      if (!validateTollRecord(record)) {
        toast.error('Datos del registro incompletos o inválidos');
        return;
      }
      
      // Preparar datos para la DB
      const newRecord = mapTollRecordToDB({
        ...record,
        userId: user.id
      });
      
      // Validaciones adicionales
      if (!newRecord.vehicle_id) {
        toast.error('El ID del vehículo es requerido');
        return;
      }
      
      if (!newRecord.trip_id) {
        toast.error('El ID del viaje es requerido');
        return;
      }
      
      // Convertir fecha a formato ISO string si es necesario
      if (newRecord.date instanceof Date) {
        newRecord.date = newRecord.date.toISOString();
      }
      
      // Insertar en Supabase
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
      
      // Actualizar estado local
      const mappedRecord = mapTollRecordFromDB(data);
      setTollRecords(prev => [mappedRecord, ...prev]);
      
      toast.success('Registro de peaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar registro:', error);
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
      // Mapear datos para la DB
      const updatedRecord = mapTollRecordToDB(record);
      
      // Convertir fecha si es necesario
      if (updatedRecord.date instanceof Date) {
        updatedRecord.date = updatedRecord.date.toISOString();
      }
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('toll_records')
        .update(updatedRecord)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error al actualizar:', error);
        toast.error('Error al actualizar el registro');
        return;
      }
      
      // Actualizar estado local
      setTollRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record } : r)
      );
      
      toast.success('Registro actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar:', error);
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
      // Eliminar de Supabase
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error al eliminar:', error);
        toast.error('Error al eliminar el registro');
        return;
      }
      
      // Eliminar del estado local
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
