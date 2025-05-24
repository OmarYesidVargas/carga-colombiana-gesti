
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TollRecord } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Hook personalizado para gestionar registros de peajes
 * @param {User | null} user - Usuario autenticado
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Funciones y estado para gestionar registros de peajes
 */
export const useTollRecords = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  
  /**
   * Mapeador para convertir datos de la DB al formato de la aplicación
   */
  const mapTollRecordFromDB = (record: any): TollRecord => {
    return {
      id: record.id,
      userId: record.user_id,
      tripId: record.trip_id,
      vehicleId: record.vehicle_id,
      tollId: record.toll_id,
      date: record.date,
      price: record.price,
      paymentMethod: record.payment_method,
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
    
    if (record.tripId !== undefined) mappedRecord.trip_id = record.tripId;
    if (record.vehicleId !== undefined) mappedRecord.vehicle_id = record.vehicleId;
    if (record.tollId !== undefined) mappedRecord.toll_id = record.tollId;
    if (record.date !== undefined) mappedRecord.date = record.date;
    if (record.price !== undefined) mappedRecord.price = record.price;
    if (record.paymentMethod !== undefined) mappedRecord.payment_method = record.paymentMethod;
    if (record.receipt !== undefined) mappedRecord.receipt = record.receipt;
    if (record.notes !== undefined) mappedRecord.notes = record.notes;
    if (record.userId !== undefined) mappedRecord.user_id = record.userId;
    
    return mappedRecord;
  };
  
  /**
   * Carga registros de peajes desde Supabase
   */
  const loadTollRecords = async () => {
    if (!user) return;
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('toll_records')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Mapear datos de la DB al formato de la aplicación
      const mappedRecords = data.map(mapTollRecordFromDB);
      setTollRecords(mappedRecords);
    } catch (error) {
      console.error('Error al cargar registros de peajes:', error);
      toast.error('Error al cargar los registros de peajes');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  /**
   * Efecto para cargar registros cuando cambia el usuario
   */
  useEffect(() => {
    if (user) {
      loadTollRecords();
    } else {
      setTollRecords([]);
    }
  }, [user]);
  
  /**
   * Obtiene un registro por su ID
   * @param {string} id - ID del registro
   * @returns {TollRecord | undefined} Registro encontrado o undefined
   */
  const getTollRecordById = (id: string) => {
    return tollRecords.find(record => record.id === id);
  };
  
  /**
   * Agrega un nuevo registro de peaje
   * @param {Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} record - Datos del registro
   */
  const addTollRecord = async (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      console.log('Datos recibidos en addTollRecord:', record);
      
      // Validar que vehicleId esté presente
      if (!record.vehicleId) {
        throw new Error('vehicleId es requerido');
      }
      
      // Preparar datos para la DB
      const newRecord = mapTollRecordToDB({
        ...record,
        userId: user.id
      });
      
      console.log('Datos mapeados para DB:', newRecord);
      
      // Asegurar que la fecha sea string para Supabase
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
        console.error('Error de Supabase al insertar:', error);
        throw error;
      }
      
      console.log('Registro creado exitosamente:', data);
      
      // Actualizar estado local
      const mappedRecord = mapTollRecordFromDB(data);
      setTollRecords(prev => [...prev, mappedRecord]);
      
      toast.success('Registro de peaje agregado correctamente');
    } catch (error) {
      console.error('Error al agregar registro de peaje:', error);
      toast.error('Error al agregar el registro de peaje');
    }
  };
  
  /**
   * Actualiza un registro existente
   * @param {string} id - ID del registro a actualizar
   * @param {Partial<TollRecord>} record - Datos parciales del registro
   */
  const updateTollRecord = async (id: string, record: Partial<TollRecord>) => {
    if (!user) return;
    
    try {
      // Mapear datos para la DB
      const updatedRecord = mapTollRecordToDB(record);
      
      // Convertir fecha a formato string para Supabase
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
        throw error;
      }
      
      // Actualizar estado local
      setTollRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record } : r)
      );
      
      toast.success('Registro de peaje actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar registro de peaje:', error);
      toast.error('Error al actualizar el registro de peaje');
    }
  };
  
  /**
   * Elimina un registro
   * @param {string} id - ID del registro a eliminar
   */
  const deleteTollRecord = async (id: string) => {
    if (!user) return;
    
    try {
      // Eliminar de Supabase
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Eliminar del estado local
      setTollRecords(prev => prev.filter(r => r.id !== id));
      
      toast.success('Registro de peaje eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar registro de peaje:', error);
      toast.error('Error al eliminar el registro de peaje');
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
