
/**
 * Servicio para operaciones de registros de peaje
 * 
 * Maneja todas las operaciones CRUD para registros de peaje
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';
import { TollRecord } from '@/types';
import { mapTollRecordFromDB, mapTollRecordToDB } from '@/utils/tollMappers';
import { errorHandler } from '@/utils/errorHandler';

export class TollRecordService {
  /**
   * Carga todos los registros de peaje del usuario
   */
  static async loadTollRecords(userId: string): Promise<TollRecord[]> {
    console.log('🔄 [TollRecordService] Cargando registros para usuario:', userId);
    
    const { data, error } = await supabase
      .from('toll_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ [TollRecordService] Error al cargar registros:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollRecordService', action: 'loadTollRecords' });
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    const mappedRecords = data
      .filter(record => record && typeof record === 'object')
      .map(record => {
        try {
          return mapTollRecordFromDB(record);
        } catch (error) {
          console.error('❌ [TollRecordService] Error al mapear registro:', error, record);
          return null;
        }
      })
      .filter(Boolean) as TollRecord[];
    
    console.log('✅ [TollRecordService] Registros cargados:', mappedRecords.length);
    return mappedRecords;
  }

  /**
   * Crea un nuevo registro de peaje
   */
  static async createTollRecord(record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string): Promise<TollRecord> {
    const newRecord = mapTollRecordToDB({
      ...record,
      userId
    });
    
    if (!newRecord.vehicle_id) {
      throw new Error('El vehículo es requerido');
    }
    
    if (!newRecord.trip_id) {
      throw new Error('El viaje es requerido');
    }
    
    if (!newRecord.toll_id) {
      throw new Error('El peaje es requerido');
    }
    
    if (newRecord.date instanceof Date) {
      newRecord.date = newRecord.date.toISOString();
    }
    
    console.log('📝 [TollRecordService] Creando nuevo registro:', newRecord);
    
    const { data, error } = await supabase
      .from('toll_records')
      .insert(newRecord)
      .select()
      .single();
    
    if (error) {
      console.error('❌ [TollRecordService] Error de Supabase:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollRecordService', action: 'createTollRecord' });
      throw error;
    }
    
    if (!data) {
      throw new Error('No se pudo crear el registro');
    }
    
    const mappedRecord = mapTollRecordFromDB(data);
    console.log('✅ [TollRecordService] Registro creado:', mappedRecord.id);
    return mappedRecord;
  }

  /**
   * Actualiza un registro de peaje existente
   */
  static async updateTollRecord(id: string, record: Partial<TollRecord>, userId: string): Promise<void> {
    console.log('🔄 [TollRecordService] Actualizando registro:', id, record);
    
    const updatedRecord = mapTollRecordToDB(record);
    
    if (updatedRecord.date instanceof Date) {
      updatedRecord.date = updatedRecord.date.toISOString();
    }
    
    const { error } = await supabase
      .from('toll_records')
      .update(updatedRecord)
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('❌ [TollRecordService] Error al actualizar:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollRecordService', action: 'updateTollRecord' });
      throw error;
    }
    
    console.log('✅ [TollRecordService] Registro actualizado:', id);
  }

  /**
   * Elimina un registro de peaje
   */
  static async deleteTollRecord(id: string, userId: string): Promise<void> {
    console.log('🗑️ [TollRecordService] Eliminando registro:', id);
    
    const { error } = await supabase
      .from('toll_records')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('❌ [TollRecordService] Error al eliminar:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollRecordService', action: 'deleteTollRecord' });
      throw error;
    }
    
    console.log('✅ [TollRecordService] Registro eliminado:', id);
  }
}
