
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Hook personalizado para gestionar viajes
 * @param {User | null} user - Usuario autenticado
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Funciones y estado para gestionar viajes
 */
export const useTrips = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  
  /**
   * Mapeador para convertir datos de la DB al formato de la aplicación
   */
  const mapTripFromDB = (trip: any): Trip => {
    return {
      id: trip.id,
      userId: trip.user_id,
      vehicleId: trip.vehicle_id,
      origin: trip.origin,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date || null,
      distance: trip.distance,
      notes: trip.notes || null,
      createdAt: trip.created_at,
      updatedAt: trip.updated_at
    };
  };
  
  /**
   * Mapeador para convertir datos de la aplicación al formato de la DB
   */
  const mapTripToDB = (trip: Partial<Trip>): any => {
    const mappedTrip: Record<string, any> = {};
    
    if (trip.origin !== undefined) mappedTrip.origin = trip.origin;
    if (trip.destination !== undefined) mappedTrip.destination = trip.destination;
    if (trip.startDate !== undefined) mappedTrip.start_date = trip.startDate;
    if (trip.endDate !== undefined) mappedTrip.end_date = trip.endDate;
    if (trip.distance !== undefined) mappedTrip.distance = trip.distance;
    if (trip.notes !== undefined) mappedTrip.notes = trip.notes;
    if (trip.vehicleId !== undefined) mappedTrip.vehicle_id = trip.vehicleId;
    if (trip.userId !== undefined) mappedTrip.user_id = trip.userId;
    
    return mappedTrip;
  };
  
  /**
   * Carga viajes desde Supabase
   */
  const loadTrips = async () => {
    if (!user) return;
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Mapear datos de la DB al formato de la aplicación
      const mappedTrips = data.map(mapTripFromDB);
      setTrips(mappedTrips);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
      toast.error('Error al cargar los viajes');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  /**
   * Efecto para cargar viajes cuando cambia el usuario
   */
  useEffect(() => {
    if (user) {
      loadTrips();
    } else {
      setTrips([]);
    }
  }, [user]);
  
  /**
   * Obtiene un viaje por su ID
   * @param {string} id - ID del viaje
   * @returns {Trip | undefined} Viaje encontrado o undefined
   */
  const getTripById = (id: string) => {
    return trips.find(trip => trip.id === id);
  };
  
  /**
   * Agrega un nuevo viaje
   * @param {Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} trip - Datos del viaje
   */
  const addTrip = async (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      // Preparar datos para la DB
      const newTrip = mapTripToDB({
        ...trip,
        userId: user.id
      });
      
      // Asegurar que las fechas sean strings para Supabase
      if (newTrip.start_date instanceof Date) {
        newTrip.start_date = newTrip.start_date.toISOString();
      }
      
      if (newTrip.end_date instanceof Date) {
        newTrip.end_date = newTrip.end_date.toISOString();
      }
      
      // Insertar en Supabase
      const { data, error } = await supabase
        .from('trips')
        .insert(newTrip)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Actualizar estado local
      const mappedTrip = mapTripFromDB(data);
      setTrips(prev => [...prev, mappedTrip]);
      
      toast.success('Viaje agregado correctamente');
    } catch (error) {
      console.error('Error al agregar viaje:', error);
      toast.error('Error al agregar el viaje');
    }
  };
  
  /**
   * Actualiza un viaje existente
   * @param {string} id - ID del viaje a actualizar
   * @param {Partial<Trip>} trip - Datos parciales del viaje
   */
  const updateTrip = async (id: string, trip: Partial<Trip>) => {
    if (!user) return;
    
    try {
      // Mapear datos para la DB
      const updatedTrip = mapTripToDB(trip);
      
      // Convertir fechas a formato string para Supabase
      if (updatedTrip.start_date instanceof Date) {
        updatedTrip.start_date = updatedTrip.start_date.toISOString();
      }
      
      if (updatedTrip.end_date instanceof Date) {
        updatedTrip.end_date = updatedTrip.end_date.toISOString();
      }
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('trips')
        .update(updatedTrip)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Actualizar estado local
      setTrips(prev => 
        prev.map(t => t.id === id ? { ...t, ...trip } : t)
      );
      
      toast.success('Viaje actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar viaje:', error);
      toast.error('Error al actualizar el viaje');
    }
  };
  
  /**
   * Elimina un viaje
   * @param {string} id - ID del viaje a eliminar
   */
  const deleteTrip = async (id: string) => {
    if (!user) return;
    
    try {
      // Eliminar de Supabase
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Eliminar del estado local
      setTrips(prev => prev.filter(t => t.id !== id));
      
      toast.success('Viaje eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar viaje:', error);
      toast.error('Error al eliminar el viaje');
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
