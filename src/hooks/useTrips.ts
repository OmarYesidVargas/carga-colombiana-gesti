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
    if (!trip || typeof trip !== 'object') {
      throw new Error('Datos de viaje inválidos');
    }

    return {
      id: trip.id,
      userId: trip.user_id,
      vehicleId: trip.vehicle_id,
      origin: trip.origin || '',
      destination: trip.destination || '',
      startDate: trip.start_date,
      endDate: trip.end_date || null,
      distance: parseFloat(trip.distance) || 0,
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
    
    if (trip.origin) mappedTrip.origin = trip.origin.trim();
    if (trip.destination) mappedTrip.destination = trip.destination.trim();
    if (trip.startDate) mappedTrip.start_date = trip.startDate;
    if (trip.endDate !== undefined) mappedTrip.end_date = trip.endDate;
    if (trip.distance !== undefined) mappedTrip.distance = Number(trip.distance);
    if (trip.notes !== undefined) mappedTrip.notes = trip.notes?.trim() || null;
    if (trip.vehicleId) mappedTrip.vehicle_id = trip.vehicleId;
    if (trip.userId) mappedTrip.user_id = trip.userId;
    
    return mappedTrip;
  };
  
  /**
   * Validar datos del viaje
   */
  const validateTrip = (trip: any): boolean => {
    if (!trip) return false;
    if (!trip.vehicleId || typeof trip.vehicleId !== 'string') return false;
    if (!trip.origin || typeof trip.origin !== 'string' || trip.origin.trim().length === 0) return false;
    if (!trip.destination || typeof trip.destination !== 'string' || trip.destination.trim().length === 0) return false;
    if (!trip.startDate) return false;
    if (trip.distance === undefined || isNaN(Number(trip.distance)) || Number(trip.distance) < 0) return false;
    
    // Validar fechas
    const startDate = new Date(trip.startDate);
    if (isNaN(startDate.getTime())) return false;
    
    if (trip.endDate) {
      const endDate = new Date(trip.endDate);
      if (isNaN(endDate.getTime()) || endDate < startDate) return false;
    }
    
    return true;
  };
  
  /**
   * Carga viajes desde Supabase
   */
  const loadTrips = async () => {
    if (!user) {
      setTrips([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
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
      
      // Mapear datos con validación
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
      
      setTrips(mappedTrips);
    } catch (error) {
      console.error('Error inesperado al cargar viajes:', error);
      toast.error('Error inesperado al cargar viajes');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  /**
   * Efecto para cargar viajes cuando cambia el usuario
   */
  useEffect(() => {
    loadTrips();
  }, [user]);
  
  /**
   * Obtiene un viaje por su ID
   * @param {string} id - ID del viaje
   * @returns {Trip | undefined} Viaje encontrado o undefined
   */
  const getTripById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return trips.find(trip => trip.id === id);
  };
  
  /**
   * Agrega un nuevo viaje
   * @param {Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} trip - Datos del viaje
   */
  const addTrip = async (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      // Validar datos
      if (!validateTrip(trip)) {
        toast.error('Datos del viaje incompletos o inválidos');
        return;
      }
      
      // Verificar que el vehículo existe
      const { data: vehicleExists } = await supabase
        .from('vehicles')
        .select('id')
        .eq('id', trip.vehicleId)
        .eq('user_id', user.id)
        .single();
      
      if (!vehicleExists) {
        toast.error('El vehículo seleccionado no existe');
        return;
      }
      
      // Preparar datos para la DB
      const newTrip = mapTripToDB({
        ...trip,
        userId: user.id
      });
      
      // Convertir fechas a ISO string
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
      
      // Actualizar estado local
      const mappedTrip = mapTripFromDB(data);
      setTrips(prev => [mappedTrip, ...prev]);
      
      toast.success('Viaje agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar viaje:', error);
      toast.error('Error inesperado al agregar viaje');
    }
  };
  
  /**
   * Actualiza un viaje existente
   * @param {string} id - ID del viaje a actualizar
   * @param {Partial<Trip>} trip - Datos parciales del viaje
   */
  const updateTrip = async (id: string, trip: Partial<Trip>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      // Validar vehículo si se está actualizando
      if (trip.vehicleId) {
        const { data: vehicleExists } = await supabase
          .from('vehicles')
          .select('id')
          .eq('id', trip.vehicleId)
          .eq('user_id', user.id)
          .single();
        
        if (!vehicleExists) {
          toast.error('El vehículo seleccionado no existe');
          return;
        }
      }
      
      // Mapear datos para la DB
      const updatedTrip = mapTripToDB(trip);
      
      // Convertir fechas
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
        console.error('Error al actualizar viaje:', error);
        toast.error('Error al actualizar el viaje');
        return;
      }
      
      // Actualizar estado local
      setTrips(prev => 
        prev.map(t => t.id === id ? { ...t, ...trip } : t)
      );
      
      toast.success('Viaje actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar viaje:', error);
      toast.error('Error inesperado al actualizar viaje');
    }
  };
  
  /**
   * Elimina un viaje
   * @param {string} id - ID del viaje a eliminar
   */
  const deleteTrip = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      // Verificar si el viaje tiene gastos o registros de peajes asociados
      const [{ data: expenses }, { data: tollRecords }] = await Promise.all([
        supabase.from('expenses').select('id').eq('trip_id', id).eq('user_id', user.id).limit(1),
        supabase.from('toll_records').select('id').eq('trip_id', id).eq('user_id', user.id).limit(1)
      ]);
      
      if ((expenses && expenses.length > 0) || (tollRecords && tollRecords.length > 0)) {
        toast.error('No se puede eliminar el viaje porque tiene gastos o registros de peaje asociados');
        return;
      }
      
      // Eliminar de Supabase
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error al eliminar viaje:', error);
        toast.error('Error al eliminar el viaje');
        return;
      }
      
      // Eliminar del estado local
      setTrips(prev => prev.filter(t => t.id !== id));
      
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
