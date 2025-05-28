
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Toll } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateToll } from '@/utils/validators';
import { mapTollFromDB, mapTollToDB } from '@/utils/tollMappers';
import { errorHandler } from '@/utils/errorHandler';

export const useTolls = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tolls, setTolls] = useState<Toll[]>([]);
  
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
    return tolls.find(toll => toll.id === id);
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
      if (toll.name || toll.location) {
        const currentToll = tolls.find(t => t.id === id);
        if (!currentToll) {
          toast.error('Peaje no encontrado');
          return;
        }
        
        const checkName = toll.name || currentToll.name;
        const checkLocation = toll.location || currentToll.location;
        
        const existingToll = tolls.find(t => 
          t.id !== id &&
          t.name.toLowerCase().trim() === checkName.toLowerCase().trim() &&
          t.location.toLowerCase().trim() === checkLocation.toLowerCase().trim()
        );
        
        if (existingToll) {
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
