
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Toll } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateToll } from '@/utils/validators';
import { mapTollFromDB, mapTollToDB } from '@/utils/tollMappers';
import { errorHandler } from '@/utils/errorHandler';
import { useAuditLogger } from './useAuditLogger';

export const useTolls = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tolls, setTolls] = useState<Toll[]>([]);
  const { logRead, logCreate, logUpdate, logDelete } = useAuditLogger(user);
  
  const loadTolls = async () => {
    if (!user) {
      setTolls([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('🔄 [useTolls] Cargando peajes para usuario:', user.id);
      
      const { data, error } = await supabase
        .from('tolls')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [useTolls] Error al cargar peajes:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTolls', action: 'loadTolls' });
        return;
      }
      
      if (!data) {
        setTolls([]);
        return;
      }
      
      const mappedTolls = data
        .filter(toll => toll && typeof toll === 'object')
        .map(toll => {
          try {
            return mapTollFromDB(toll);
          } catch (error) {
            console.error('❌ [useTolls] Error al mapear peaje:', error, toll);
            return null;
          }
        })
        .filter(Boolean) as Toll[];
      
      console.log('✅ [useTolls] Peajes cargados exitosamente:', mappedTolls.length);
      setTolls(mappedTolls);

      // Auditar la carga de peajes
      await logRead('tolls', undefined, { 
        count: mappedTolls.length,
        action: 'load_all_tolls'
      });
    } catch (error) {
      console.error('❌ [useTolls] Error inesperado al cargar peajes:', error);
      errorHandler.handleGenericError(error, { component: 'useTolls', action: 'loadTolls' });
    } finally {
      setGlobalLoading(false);
    }
  };
  
  useEffect(() => {
    loadTolls();
  }, [user]);
  
  const getTollById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    const toll = tolls.find(toll => toll.id === id);
    
    if (toll) {
      logRead('tolls', id, { action: 'get_toll_by_id' });
    }
    
    return toll;
  };
  
  const addToll = async (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      if (!validateToll(toll)) {
        toast.error('Datos del peaje incompletos o inválidos');
        return;
      }

      const existingToll = tolls.find(t => 
        t.name.toLowerCase().trim() === toll.name.toLowerCase().trim() &&
        t.location.toLowerCase().trim() === toll.location.toLowerCase().trim()
      );
      
      if (existingToll) {
        toast.error('Ya existe un peaje con este nombre en esta ubicación');
        return;
      }
      
      const newToll = mapTollToDB({
        ...toll,
        userId: user.id
      });
      
      console.log('📝 [useTolls] Creando nuevo peaje:', newToll);
      
      const { data, error } = await supabase
        .from('tolls')
        .insert(newToll)
        .select()
        .single();
      
      if (error) {
        console.error('❌ [useTolls] Error de Supabase:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTolls', action: 'addToll' });
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el peaje');
        return;
      }
      
      const mappedToll = mapTollFromDB(data);
      setTolls(prev => [mappedToll, ...prev]);

      // Auditar la creación
      await logCreate('tolls', mappedToll.id, {
        name: mappedToll.name,
        location: mappedToll.location,
        price: mappedToll.price,
        category: mappedToll.category
      }, { action: 'create_toll' });
      
      console.log('✅ [useTolls] Peaje creado exitosamente:', mappedToll.id);
      toast.success('Peaje agregado correctamente');
    } catch (error) {
      console.error('❌ [useTolls] Error inesperado al agregar peaje:', error);
      errorHandler.handleGenericError(error, { component: 'useTolls', action: 'addToll' });
    }
  };
  
  const updateToll = async (id: string, toll: Partial<Toll>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      const currentToll = getTollById(id);
      if (!currentToll) {
        toast.error('Peaje no encontrado');
        return;
      }

      if (toll.name || toll.location) {
        const checkName = toll.name || currentToll.name;
        const checkLocation = toll.location || currentToll.location;
        
        const duplicateToll = tolls.find(t => 
          t.id !== id &&
          t.name.toLowerCase().trim() === checkName.toLowerCase().trim() &&
          t.location.toLowerCase().trim() === checkLocation.toLowerCase().trim()
        );
        
        if (duplicateToll) {
          toast.error('Ya existe un peaje con este nombre en esta ubicación');
          return;
        }
      }
      
      console.log('🔄 [useTolls] Actualizando peaje:', id, toll);
      
      const updatedToll = mapTollToDB(toll);
      
      const { error } = await supabase
        .from('tolls')
        .update(updatedToll)
        .eq('id', id);
      
      if (error) {
        console.error('❌ [useTolls] Error al actualizar peaje:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTolls', action: 'updateToll' });
        return;
      }
      
      setTolls(prev => 
        prev.map(t => t.id === id ? { ...t, ...toll } : t)
      );

      // Auditar la actualización
      await logUpdate('tolls', id, {
        name: currentToll.name,
        location: currentToll.location,
        price: currentToll.price
      }, toll, { action: 'update_toll' });
      
      console.log('✅ [useTolls] Peaje actualizado exitosamente:', id);
      toast.success('Peaje actualizado correctamente');
    } catch (error) {
      console.error('❌ [useTolls] Error inesperado al actualizar peaje:', error);
      errorHandler.handleGenericError(error, { component: 'useTolls', action: 'updateToll' });
    }
  };
  
  const deleteToll = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      const existingToll = getTollById(id);
      if (!existingToll) {
        toast.error('Peaje no encontrado');
        return;
      }

      console.log('🔍 [useTolls] Verificando dependencias para eliminar peaje:', id);
      
      const { data: tollRecords } = await supabase
        .from('toll_records')
        .select('id')
        .eq('toll_id', id)
        .eq('user_id', user.id)
        .limit(1);
      
      if (tollRecords && tollRecords.length > 0) {
        toast.error('No se puede eliminar el peaje porque tiene registros asociados');
        return;
      }
      
      console.log('🗑️ [useTolls] Eliminando peaje:', id);
      
      const { error } = await supabase
        .from('tolls')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ [useTolls] Error al eliminar peaje:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTolls', action: 'deleteToll' });
        return;
      }
      
      setTolls(prev => prev.filter(t => t.id !== id));

      // Auditar la eliminación
      await logDelete('tolls', id, {
        name: existingToll.name,
        location: existingToll.location,
        price: existingToll.price,
        category: existingToll.category
      }, { action: 'delete_toll' });
      
      console.log('✅ [useTolls] Peaje eliminado exitosamente:', id);
      toast.success('Peaje eliminado correctamente');
    } catch (error) {
      console.error('❌ [useTolls] Error inesperado al eliminar peaje:', error);
      errorHandler.handleGenericError(error, { component: 'useTolls', action: 'deleteToll' });
    }
  };
  
  return {
    tolls,
    getTollById,
    addToll,
    updateToll,
    deleteToll
  };
};
