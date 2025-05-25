
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Toll } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateToll } from '@/utils/validators';
import { mapTollFromDB, mapTollToDB } from '@/utils/tollMappers';

export const useTolls = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tolls, setTolls] = useState<Toll[]>([]);
  
  const loadTolls = async () => {
    if (!user) {
      setTolls([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('tolls')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar peajes:', error);
        toast.error('Error al cargar los peajes');
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
            console.error('Error al mapear peaje:', error, toll);
            return null;
          }
        })
        .filter(Boolean) as Toll[];
      
      setTolls(mappedTolls);
    } catch (error) {
      console.error('Error inesperado al cargar peajes:', error);
      toast.error('Error inesperado al cargar peajes');
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
      
      const { data, error } = await supabase
        .from('tolls')
        .insert(newToll)
        .select()
        .single();
      
      if (error) {
        console.error('Error de Supabase:', error);
        toast.error('Error al guardar el peaje');
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el peaje');
        return;
      }
      
      const mappedToll = mapTollFromDB(data);
      setTolls(prev => [mappedToll, ...prev]);
      
      toast.success('Peaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar peaje:', error);
      toast.error('Error inesperado al agregar peaje');
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
      
      const updatedToll = mapTollToDB(toll);
      
      const { error } = await supabase
        .from('tolls')
        .update(updatedToll)
        .eq('id', id);
      
      if (error) {
        console.error('Error al actualizar peaje:', error);
        toast.error('Error al actualizar el peaje');
        return;
      }
      
      setTolls(prev => 
        prev.map(t => t.id === id ? { ...t, ...toll } : t)
      );
      
      toast.success('Peaje actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar peaje:', error);
      toast.error('Error inesperado al actualizar peaje');
    }
  };
  
  const deleteToll = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      const { data: tollRecords } = await supabase
        .from('toll_records')
        .select('id')
        .eq('toll_id', id)
        .limit(1);
      
      if (tollRecords && tollRecords.length > 0) {
        toast.error('No se puede eliminar el peaje porque tiene registros asociados');
        return;
      }
      
      const { error } = await supabase
        .from('tolls')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar peaje:', error);
        toast.error('Error al eliminar el peaje');
        return;
      }
      
      setTolls(prev => prev.filter(t => t.id !== id));
      
      toast.success('Peaje eliminado correctamente');
    } catch (error) {
      console.error('Error inesperado al eliminar peaje:', error);
      toast.error('Error inesperado al eliminar peaje');
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
