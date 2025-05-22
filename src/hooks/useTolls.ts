
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Toll } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Hook personalizado para gestionar peajes
 * @param {User | null} user - Usuario autenticado
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Funciones y estado para gestionar peajes
 */
export const useTolls = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tolls, setTolls] = useState<Toll[]>([]);
  
  /**
   * Mapeador para convertir datos de la DB al formato de la aplicación
   */
  const mapTollFromDB = (toll: any): Toll => {
    return {
      id: toll.id,
      userId: toll.user_id,
      name: toll.name,
      location: toll.location,
      price: toll.price,
      category: toll.category || null,
      route: toll.route || null,
      coordinates: toll.coordinates || null,
      description: toll.description || null,
      createdAt: toll.created_at,
      updatedAt: toll.updated_at
    };
  };
  
  /**
   * Mapeador para convertir datos de la aplicación al formato de la DB
   */
  const mapTollToDB = (toll: Partial<Toll>): any => {
    const mappedToll: Record<string, any> = {};
    
    if (toll.name !== undefined) mappedToll.name = toll.name;
    if (toll.location !== undefined) mappedToll.location = toll.location;
    if (toll.price !== undefined) mappedToll.price = toll.price;
    if (toll.category !== undefined) mappedToll.category = toll.category;
    if (toll.route !== undefined) mappedToll.route = toll.route;
    if (toll.coordinates !== undefined) mappedToll.coordinates = toll.coordinates;
    if (toll.description !== undefined) mappedToll.description = toll.description;
    if (toll.userId !== undefined) mappedToll.user_id = toll.userId;
    
    return mappedToll;
  };
  
  /**
   * Carga peajes desde Supabase
   */
  const loadTolls = async () => {
    if (!user) return;
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('tolls')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Mapear datos de la DB al formato de la aplicación
      const mappedTolls = data.map(mapTollFromDB);
      setTolls(mappedTolls);
    } catch (error) {
      console.error('Error al cargar peajes:', error);
      toast.error('Error al cargar los peajes');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  /**
   * Efecto para cargar peajes cuando cambia el usuario
   */
  useEffect(() => {
    if (user) {
      loadTolls();
    } else {
      setTolls([]);
    }
  }, [user]);
  
  /**
   * Obtiene un peaje por su ID
   * @param {string} id - ID del peaje
   * @returns {Toll | undefined} Peaje encontrado o undefined
   */
  const getTollById = (id: string) => {
    return tolls.find(toll => toll.id === id);
  };
  
  /**
   * Agrega un nuevo peaje
   * @param {Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} toll - Datos del peaje
   */
  const addToll = async (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      // Preparar datos para la DB
      const newToll = mapTollToDB({
        ...toll,
        userId: user.id
      });
      
      // Insertar en Supabase
      const { data, error } = await supabase
        .from('tolls')
        .insert(newToll)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Actualizar estado local
      const mappedToll = mapTollFromDB(data);
      setTolls(prev => [...prev, mappedToll]);
      
      toast.success('Peaje agregado correctamente');
    } catch (error) {
      console.error('Error al agregar peaje:', error);
      toast.error('Error al agregar el peaje');
    }
  };
  
  /**
   * Actualiza un peaje existente
   * @param {string} id - ID del peaje a actualizar
   * @param {Partial<Toll>} toll - Datos parciales del peaje
   */
  const updateToll = async (id: string, toll: Partial<Toll>) => {
    if (!user) return;
    
    try {
      // Mapear datos para la DB
      const updatedToll = mapTollToDB(toll);
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('tolls')
        .update(updatedToll)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Actualizar estado local
      setTolls(prev => 
        prev.map(t => t.id === id ? { ...t, ...toll } : t)
      );
      
      toast.success('Peaje actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar peaje:', error);
      toast.error('Error al actualizar el peaje');
    }
  };
  
  /**
   * Elimina un peaje
   * @param {string} id - ID del peaje a eliminar
   */
  const deleteToll = async (id: string) => {
    if (!user) return;
    
    try {
      // Eliminar de Supabase
      const { error } = await supabase
        .from('tolls')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Eliminar del estado local
      setTolls(prev => prev.filter(t => t.id !== id));
      
      toast.success('Peaje eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar peaje:', error);
      toast.error('Error al eliminar el peaje');
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
