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
    if (!toll || typeof toll !== 'object') {
      throw new Error('Datos de peaje inválidos');
    }

    return {
      id: toll.id,
      userId: toll.user_id,
      name: toll.name || '',
      location: toll.location || '',
      price: parseFloat(toll.price) || 0,
      category: toll.category || '',
      route: toll.route || '',
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
    
    if (toll.name) mappedToll.name = toll.name.trim();
    if (toll.location) mappedToll.location = toll.location.trim();
    if (toll.price !== undefined) mappedToll.price = Number(toll.price);
    if (toll.category) mappedToll.category = toll.category.trim();
    if (toll.route) mappedToll.route = toll.route.trim();
    if (toll.coordinates !== undefined) mappedToll.coordinates = toll.coordinates?.trim() || null;
    if (toll.description !== undefined) mappedToll.description = toll.description?.trim() || null;
    if (toll.userId) mappedToll.user_id = toll.userId;
    
    return mappedToll;
  };
  
  /**
   * Validar datos del peaje
   */
  const validateToll = (toll: any): boolean => {
    if (!toll) return false;
    if (!toll.name || typeof toll.name !== 'string' || toll.name.trim().length === 0) return false;
    if (!toll.location || typeof toll.location !== 'string' || toll.location.trim().length === 0) return false;
    if (!toll.category || typeof toll.category !== 'string' || toll.category.trim().length === 0) return false;
    if (!toll.route || typeof toll.route !== 'string' || toll.route.trim().length === 0) return false;
    if (toll.price === undefined || isNaN(Number(toll.price)) || Number(toll.price) < 0) return false;
    
    return true;
  };
  
  /**
   * Carga peajes desde Supabase
   */
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
        .eq('user_id', user.id)
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
      
      // Mapear datos con validación
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
  
  /**
   * Efecto para cargar peajes cuando cambia el usuario
   */
  useEffect(() => {
    loadTolls();
  }, [user]);
  
  /**
   * Obtiene un peaje por su ID
   * @param {string} id - ID del peaje
   * @returns {Toll | undefined} Peaje encontrado o undefined
   */
  const getTollById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return tolls.find(toll => toll.id === id);
  };
  
  /**
   * Agrega un nuevo peaje
   * @param {Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} toll - Datos del peaje
   */
  const addToll = async (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      // Validar datos
      if (!validateToll(toll)) {
        toast.error('Datos del peaje incompletos o inválidos');
        return;
      }

      // Verificar peaje duplicado
      const existingToll = tolls.find(t => 
        t.name.toLowerCase().trim() === toll.name.toLowerCase().trim() &&
        t.location.toLowerCase().trim() === toll.location.toLowerCase().trim()
      );
      
      if (existingToll) {
        toast.error('Ya existe un peaje con este nombre en esta ubicación');
        return;
      }
      
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
        console.error('Error de Supabase:', error);
        toast.error('Error al guardar el peaje');
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el peaje');
        return;
      }
      
      // Actualizar estado local
      const mappedToll = mapTollFromDB(data);
      setTolls(prev => [mappedToll, ...prev]);
      
      toast.success('Peaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar peaje:', error);
      toast.error('Error inesperado al agregar peaje');
    }
  };
  
  /**
   * Actualiza un peaje existente
   * @param {string} id - ID del peaje a actualizar
   * @param {Partial<Toll>} toll - Datos parciales del peaje
   */
  const updateToll = async (id: string, toll: Partial<Toll>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      // Verificar duplicados si se actualiza nombre o ubicación
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
      
      // Mapear datos para la DB
      const updatedToll = mapTollToDB(toll);
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('tolls')
        .update(updatedToll)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error al actualizar peaje:', error);
        toast.error('Error al actualizar el peaje');
        return;
      }
      
      // Actualizar estado local
      setTolls(prev => 
        prev.map(t => t.id === id ? { ...t, ...toll } : t)
      );
      
      toast.success('Peaje actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar peaje:', error);
      toast.error('Error inesperado al actualizar peaje');
    }
  };
  
  /**
   * Elimina un peaje
   * @param {string} id - ID del peaje a eliminar
   */
  const deleteToll = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      // Verificar si el peaje tiene registros asociados
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
      
      // Eliminar de Supabase
      const { error } = await supabase
        .from('tolls')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error al eliminar peaje:', error);
        toast.error('Error al eliminar el peaje');
        return;
      }
      
      // Eliminar del estado local
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
