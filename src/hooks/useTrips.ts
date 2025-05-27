
/**
 * Hook personalizado para gestionar viajes en TransporegistrosPlus
 * 
 * Este hook encapsula toda la lógica relacionada con viajes incluyendo:
 * - Carga de viajes desde Supabase con ordenamiento cronológico
 * - Creación de nuevos viajes con validación de vehículos
 * - Actualización de viajes existentes con verificaciones de integridad
 * - Eliminación de viajes con validación de dependencias (gastos y peajes)
 * - Manejo robusto de estados de error y carga
 * - Mapeo automático entre formatos de DB y aplicación
 * - Conversión automática de fechas para compatibilidad con Supabase
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateTrip } from '@/utils/validators';
import { mapTripFromDB, mapTripToDB } from '@/utils/tripMappers';

/**
 * Hook personalizado para gestionar viajes
 * 
 * @param {User | null} user - Usuario autenticado actual
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Objeto con funciones y estado para gestionar viajes
 */
export const useTrips = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  // Estado local para almacenar los viajes
  const [trips, setTrips] = useState<Trip[]>([]);
  
  /**
   * Función para cargar todos los viajes del usuario
   * Se ejecuta automáticamente cuando cambia el usuario
   * Incluye manejo de errores y validación de datos
   */
  const loadTrips = async () => {
    if (!user) {
      setTrips([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('Cargando viajes para usuario:', user.id);
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar viajes:', error);
        toast.error('Error al cargar los viajes');
        return;
      }
      
      if (!data) {
        setTrips([]);
        return;
      }
      
      // Mapear y filtrar viajes válidos
      const mappedTrips = data
        .filter(trip => trip && typeof trip === 'object')
        .map(trip => {
          try {
            return mapTripFromDB(trip);
          } catch (error) {
            console.error('Error al mapear viaje:', error, trip);
            return null;
          }
        })
        .filter(Boolean) as Trip[];
      
      console.log('Viajes cargados exitosamente:', mappedTrips.length);
      setTrips(mappedTrips);
    } catch (error) {
      console.error('Error inesperado al cargar viajes:', error);
      toast.error('Error inesperado al cargar viajes');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  // Efecto para cargar viajes cuando cambia el usuario
  useEffect(() => {
    loadTrips();
  }, [user]);
  
  /**
   * Obtiene un viaje específico por su ID
   * 
   * @param {string} id - ID del viaje a buscar
   * @returns {Trip | undefined} Viaje encontrado o undefined si no existe
   */
  const getTripById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return trips.find(trip => trip.id === id);
  };
  
  /**
   * Agrega un nuevo viaje con validación de vehículo
   * Verifica que el vehículo asociado exista antes de crear el viaje
   * 
   * @param {Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} trip - Datos del nuevo viaje
   */
  const addTrip = async (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      // Validar datos del viaje
      if (!validateTrip(trip)) {
        toast.error('Datos del viaje incompletos o inválidos');
        return;
      }
      
      // Verificar que el vehículo existe
      const { data: vehicleExists } = await supabase
        .from('vehicles')
        .select('id')
        .eq('id', trip.vehicleId)
        .single();
      
      if (!vehicleExists) {
        toast.error('El vehículo seleccionado no existe');
        return;
      }
      
      // Preparar datos para inserción en DB
      const newTrip = mapTripToDB({
        ...trip,
        userId: user.id
      });
      
      // Convertir fechas a formato ISO string para Supabase
      if (newTrip.start_date instanceof Date) {
        newTrip.start_date = newTrip.start_date.toISOString();
      }
      
      if (newTrip.end_date instanceof Date) {
        newTrip.end_date = newTrip.end_date.toISOString();
      }
      
      console.log('Creando nuevo viaje:', newTrip);
      
      const { data, error } = await supabase
        .from('trips')
        .insert(newTrip)
        .select()
        .single();
      
      if (error) {
        console.error('Error de Supabase:', error);
        if (error.code === '23503') {
          toast.error('El vehículo seleccionado no es válido');
        } else {
          toast.error('Error al guardar el viaje');
        }
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el viaje');
        return;
      }
      
      // Mapear y agregar al estado
      const mappedTrip = mapTripFromDB(data);
      setTrips(prev => [mappedTrip, ...prev]);
      
      console.log('Viaje creado exitosamente:', mappedTrip.id);
      toast.success('Viaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar viaje:', error);
      toast.error('Error inesperado al agregar viaje');
    }
  };
  
  /**
   * Actualiza un viaje existente con validación de vehículo
   * Verifica que el vehículo exista si se está actualizando
   * 
   * @param {string} id - ID del viaje a actualizar
   * @param {Partial<Trip>} trip - Datos a actualizar
   */
  const updateTrip = async (id: string, trip: Partial<Trip>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      // Verificar vehículo si se está actualizando
      if (trip.vehicleId) {
        const { data: vehicleExists } = await supabase
          .from('vehicles')
          .select('id')
          .eq('id', trip.vehicleId)
          .single();
        
        if (!vehicleExists) {
          toast.error('El vehículo seleccionado no existe');
          return;
        }
      }
      
      console.log('Actualizando viaje:', id, trip);
      
      const updatedTrip = mapTripToDB(trip);
      
      // Convertir fechas a formato ISO string para Supabase
      if (updatedTrip.start_date instanceof Date) {
        updatedTrip.start_date = updatedTrip.start_date.toISOString();
      }
      
      if (updatedTrip.end_date instanceof Date) {
        updatedTrip.end_date = updatedTrip.end_date.toISOString();
      }
      
      const { error } = await supabase
        .from('trips')
        .update(updatedTrip)
        .eq('id', id);
      
      if (error) {
        console.error('Error al actualizar viaje:', error);
        toast.error('Error al actualizar el viaje');
        return;
      }
      
      // Actualizar estado local
      setTrips(prev => 
        prev.map(t => t.id === id ? { ...t, ...trip } : t)
      );
      
      console.log('Viaje actualizado exitosamente:', id);
      toast.success('Viaje actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar viaje:', error);
      toast.error('Error inesperado al actualizar viaje');
    }
  };
  
  /**
   * Elimina un viaje después de verificar que no tenga dependencias
   * Verifica que no tenga gastos o registros de peaje asociados
   * 
   * @param {string} id - ID del viaje a eliminar
   */
  const deleteTrip = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      console.log('Verificando dependencias para eliminar viaje:', id);
      
      // Verificar dependencias en paralelo
      const [{ data: expenses }, { data: tollRecords }] = await Promise.all([
        supabase.from('expenses').select('id').eq('trip_id', id).limit(1),
        supabase.from('toll_records').select('id').eq('trip_id', id).limit(1)
      ]);
      
      if ((expenses && expenses.length > 0) || (tollRecords && tollRecords.length > 0)) {
        toast.error('No se puede eliminar el viaje porque tiene gastos o registros de peaje asociados');
        return;
      }
      
      console.log('Eliminando viaje:', id);
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar viaje:', error);
        toast.error('Error al eliminar el viaje');
        return;
      }
      
      // Actualizar estado local
      setTrips(prev => prev.filter(t => t.id !== id));
      
      console.log('Viaje eliminado exitosamente:', id);
      toast.success('Viaje eliminado correctamente');
    } catch (error) {
      console.error('Error inesperado al eliminar viaje:', error);
      toast.error('Error inesperado al eliminar viaje');
    }
  };
  
  return {
    trips,
    getTripById,
    addTrip,
    updateTrip,
    deleteTrip
  };
};
