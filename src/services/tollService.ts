
import { supabase } from '@/integrations/supabase/client';
import { Toll } from '@/types';
import { mapTollFromDB, mapTollToDB } from '@/utils/tollMappers';
import { errorHandler } from '@/utils/errorHandler';

export class TollService {
  static async fetchTolls(userId: string): Promise<Toll[]> {
    console.log('🔄 [TollService] Cargando peajes para usuario:', userId);
    
    const { data, error } = await supabase
      .from('tolls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ [TollService] Error al cargar peajes:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollService', action: 'fetchTolls' });
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    const mappedTolls = data
      .filter(toll => toll && typeof toll === 'object')
      .map(toll => {
        try {
          return mapTollFromDB(toll);
        } catch (error) {
          console.error('❌ [TollService] Error al mapear peaje:', error, toll);
          return null;
        }
      })
      .filter(Boolean) as Toll[];
    
    console.log('✅ [TollService] Peajes cargados exitosamente:', mappedTolls.length);
    return mappedTolls;
  }

  static async createToll(tollData: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Toll> {
    const newToll = mapTollToDB({
      ...tollData,
      userId
    });
    
    console.log('📝 [TollService] Creando nuevo peaje:', newToll);
    
    const { data, error } = await supabase
      .from('tolls')
      .insert(newToll)
      .select()
      .single();
    
    if (error) {
      console.error('❌ [TollService] Error de Supabase:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollService', action: 'createToll' });
      throw error;
    }
    
    if (!data) {
      throw new Error('No se pudo crear el peaje');
    }
    
    const mappedToll = mapTollFromDB(data);
    console.log('✅ [TollService] Peaje creado exitosamente:', mappedToll.id);
    return mappedToll;
  }

  static async updateToll(id: string, tollData: Partial<Toll>): Promise<void> {
    console.log('🔄 [TollService] Actualizando peaje:', id, tollData);
    
    const updatedToll = mapTollToDB(tollData);
    
    const { error } = await supabase
      .from('tolls')
      .update(updatedToll)
      .eq('id', id);
    
    if (error) {
      console.error('❌ [TollService] Error al actualizar peaje:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollService', action: 'updateToll' });
      throw error;
    }
    
    console.log('✅ [TollService] Peaje actualizado exitosamente:', id);
  }

  static async deleteToll(id: string): Promise<void> {
    console.log('🗑️ [TollService] Eliminando peaje:', id);
    
    const { error } = await supabase
      .from('tolls')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ [TollService] Error al eliminar peaje:', error);
      errorHandler.handleDatabaseError(error, { component: 'TollService', action: 'deleteToll' });
      throw error;
    }
    
    console.log('✅ [TollService] Peaje eliminado exitosamente:', id);
  }

  static async checkTollDependencies(id: string, userId: string): Promise<boolean> {
    console.log('🔍 [TollService] Verificando dependencias para peaje:', id);
    
    const { data: tollRecords } = await supabase
      .from('toll_records')
      .select('id')
      .eq('toll_id', id)
      .eq('user_id', userId)
      .limit(1);
    
    return tollRecords && tollRecords.length > 0;
  }
}
