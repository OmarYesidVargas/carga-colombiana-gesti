
/**
 * Hook personalizado para gestionar peajes en TransporegistrosPlus
 * 
 * Este hook encapsula toda la lógica relacionada con peajes incluyendo:
 * - Carga de peajes desde Supabase con ordenamiento
 * - Creación de nuevos peajes con validación de duplicados
 * - Actualización de peajes existentes con verificación de unicidad
 * - Eliminación de peajes con validación de dependencias
 * - Manejo robusto de estados de error y carga
 * - Mapeo automático entre formatos de DB y aplicación
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Toll } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateToll } from '@/utils/validators';
import { mapTollFromDB, mapTollToDB } from '@/utils/tollMappers';

/**
 * Hook personalizado para gestionar peajes
 * 
 * @param {User | null} user - Usuario autenticado actual
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Objeto con funciones y estado para gestionar peajes
 */
export const useTolls = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  // Estado local para almacenar los peajes
  const [tolls, setTolls] = useState<Toll[]>([]);
  
  /**
   * Función para cargar todos los peajes del usuario
   * Se ejecuta automáticamente cuando cambia el usuario
   * Incluye manejo de errores y validación de datos
   */
  const loadTolls = async () => {
    if (!user) {
      setTolls([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('Cargando peajes para usuario:', user.id);
      
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
      
      // Mapear y filtrar peajes válidos
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
      
      console.log('Peajes cargados exitosamente:', mappedTolls.length);
      setTolls(mappedTolls);
    } catch (error) {
      console.error('Error inesperado al cargar peajes:', error);
      toast.error('Error inesperado al cargar peajes');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  // Efecto para cargar peajes cuando cambia el usuario
  useEffect(() => {
    loadTolls();
  }, [user]);
  
  /**
   * Obtiene un peaje específico por su ID
   * 
   * @param {string} id - ID del peaje a buscar
   * @returns {Toll | undefined} Peaje encontrado o undefined si no existe
   */
  const getTollById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return tolls.find(toll => toll.id === id);
  };
  
  /**
   * Agrega un nuevo peaje con validación de duplicados
   * Verifica que no exista un peaje con el mismo nombre y ubicación
   * 
   * @param {Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} toll - Datos del nuevo peaje
   */
  const addToll = async (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      // Validar datos del peaje
      if (!validateToll(toll)) {
        toast.error('Datos del peaje incompletos o inválidos');
        return;
      }

      // Verificar que no exista un peaje duplicado
      const existingToll = tolls.find(t => 
        t.name.toLowerCase().trim() === toll.name.toLowerCase().trim() &&
        t.location.toLowerCase().trim() === toll.location.toLowerCase().trim()
      );
      
      if (existingToll) {
        toast.error('Ya existe un peaje con este nombre en esta ubicación');
        return;
      }
      
      // Preparar datos para inserción en DB
      const newToll = mapTollToDB({
        ...toll,
        userId: user.id
      });
      
      console.log('Creando nuevo peaje:', newToll);
      
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
      
      // Mapear y agregar al estado
      const mappedToll = mapTollFromDB(data);
      setTolls(prev => [mappedToll, ...prev]);
      
      console.log('Peaje creado exitosamente:', mappedToll.id);
      toast.success('Peaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar peaje:', error);
      toast.error('Error inesperado al agregar peaje');
    }
  };
  
  /**
   * Actualiza un peaje existente con validación de duplicados
   * Verifica que los cambios no generen duplicados con otros peajes
   * 
   * @param {string} id - ID del peaje a actualizar
   * @param {Partial<Toll>} toll - Datos a actualizar
   */
  const updateToll = async (id: string, toll: Partial<Toll>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      // Validar duplicados si se actualizan nombre o ubicación
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
      
      console.log('Actualizando peaje:', id, toll);
      
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
      
      // Actualizar estado local
      setTolls(prev => 
        prev.map(t => t.id === id ? { ...t, ...toll } : t)
      );
      
      console.log('Peaje actualizado exitosamente:', id);
      toast.success('Peaje actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar peaje:', error);
      toast.error('Error inesperado al actualizar peaje');
    }
  };
  
  /**
   * Elimina un peaje después de verificar que no tenga registros asociados
   * 
   * @param {string} id - ID del peaje a eliminar
   */
  const deleteToll = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      console.log('Verificando dependencias para eliminar peaje:', id);
      
      // Verificar que no tenga registros de peaje asociados
      const { data: tollRecords } = await supabase
        .from('toll_records')
        .select('id')
        .eq('toll_id', id)
        .limit(1);
      
      if (tollRecords && tollRecords.length > 0) {
        toast.error('No se puede eliminar el peaje porque tiene registros asociados');
        return;
      }
      
      console.log('Eliminando peaje:', id);
      
      const { error } = await supabase
        .from('tolls')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar peaje:', error);
        toast.error('Error al eliminar el peaje');
        return;
      }
      
      // Actualizar estado local
      setTolls(prev => prev.filter(t => t.id !== id));
      
      console.log('Peaje eliminado exitosamente:', id);
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
