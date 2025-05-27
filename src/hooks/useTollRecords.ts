
/**
 * Hook personalizado para gestionar registros de peajes en TransporegistrosPlus
 * 
 * Este hook encapsula toda la lógica relacionada con registros de peaje incluyendo:
 * - Carga de registros desde Supabase con validación
 * - Creación de nuevos registros con verificación de integridad
 * - Actualización de registros existentes
 * - Eliminación de registros con validaciones
 * - Manejo robusto de estados de error y carga
 * - Mapeo automático entre formatos de DB y aplicación
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TollRecord } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateTollRecord } from '@/utils/validators';
import { mapTollRecordFromDB, mapTollRecordToDB } from '@/utils/tollMappers';

/**
 * Hook personalizado para gestionar registros de peajes
 * 
 * @param {User | null} user - Usuario autenticado actual
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Objeto con funciones y estado para gestionar registros de peaje
 */
export const useTollRecords = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  // Estado local para almacenar los registros de peaje
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  
  /**
   * Función para cargar todos los registros de peaje del usuario
   * Se ejecuta automáticamente cuando cambia el usuario
   * Incluye manejo de errores y validación de datos
   */
  const loadTollRecords = async () => {
    if (!user) {
      setTollRecords([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('Cargando registros de peajes para usuario:', user.id);
      
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
      
      // Mapear y filtrar registros válidos
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
      
      console.log('Registros de peaje cargados exitosamente:', mappedRecords.length);
      setTollRecords(mappedRecords);
    } catch (error) {
      console.error('Error inesperado al cargar registros:', error);
      toast.error('Error inesperado al cargar los registros');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  // Efecto para cargar registros cuando cambia el usuario
  useEffect(() => {
    loadTollRecords();
  }, [user]);
  
  /**
   * Obtiene un registro de peaje específico por su ID
   * 
   * @param {string} id - ID del registro a buscar
   * @returns {TollRecord | undefined} Registro encontrado o undefined si no existe
   */
  const getTollRecordById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return tollRecords.find(record => record.id === id);
  };
  
  /**
   * Agrega un nuevo registro de peaje con validación completa
   * 
   * @param {Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} record - Datos del nuevo registro
   */
  const addTollRecord = async (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      // Validar datos del registro
      if (!validateTollRecord(record)) {
        toast.error('Datos del registro incompletos o inválidos');
        return;
      }
      
      // Preparar datos para inserción en DB
      const newRecord = mapTollRecordToDB({
        ...record,
        userId: user.id
      });
      
      // Validaciones específicas de campos requeridos
      if (!newRecord.vehicle_id) {
        toast.error('El ID del vehículo es requerido');
        return;
      }
      
      if (!newRecord.trip_id) {
        toast.error('El ID del viaje es requerido');
        return;
      }
      
      // Convertir fecha si es necesario
      if (newRecord.date instanceof Date) {
        newRecord.date = newRecord.date.toISOString();
      }
      
      console.log('Creando nuevo registro de peaje:', newRecord);
      
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
      
      // Mapear y agregar al estado
      const mappedRecord = mapTollRecordFromDB(data);
      setTollRecords(prev => [mappedRecord, ...prev]);
      
      console.log('Registro de peaje creado exitosamente:', mappedRecord.id);
      toast.success('Registro de peaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar registro:', error);
      toast.error('Error inesperado al agregar el registro');
    }
  };
  
  /**
   * Actualiza un registro de peaje existente
   * 
   * @param {string} id - ID del registro a actualizar
   * @param {Partial<TollRecord>} record - Datos a actualizar
   */
  const updateTollRecord = async (id: string, record: Partial<TollRecord>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      console.log('Actualizando registro de peaje:', id, record);
      
      const updatedRecord = mapTollRecordToDB(record);
      
      // Convertir fecha si es necesario
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
      
      // Actualizar estado local
      setTollRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record } : r)
      );
      
      console.log('Registro actualizado exitosamente:', id);
      toast.success('Registro actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar:', error);
      toast.error('Error inesperado al actualizar');
    }
  };
  
  /**
   * Elimina un registro de peaje
   * 
   * @param {string} id - ID del registro a eliminar
   */
  const deleteTollRecord = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      console.log('Eliminando registro de peaje:', id);
      
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar:', error);
        toast.error('Error al eliminar el registro');
        return;
      }
      
      // Actualizar estado local
      setTollRecords(prev => prev.filter(r => r.id !== id));
      
      console.log('Registro eliminado exitosamente:', id);
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
