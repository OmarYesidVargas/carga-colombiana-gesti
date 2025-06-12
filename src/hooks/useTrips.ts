import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateTrip } from '@/utils/validators';
import { mapTripFromDB, mapTripToDB } from '@/utils/tripMappers';
import { errorHandler } from '@/utils/errorHandler';
import { useAuditLogger } from './useAuditLogger';

export const useTrips = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const { logRead, logCreate, logUpdate, logDelete } = useAuditLogger(user);
  
  const loadTrips = async () => {
    if (!user) {
      setTrips([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('🔄 [useTrips] Cargando viajes para usuario:', user.id);
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [useTrips] Error al cargar viajes:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTrips', action: 'loadTrips' });
        return;
      }
      
      if (!data) {
        setTrips([]);
        return;
      }
      
      const mappedTrips = data
        .filter(trip => trip && typeof trip === 'object')
        .map(trip => {
          try {
            return mapTripFromDB(trip);
          } catch (error) {
            console.error('❌ [useTrips] Error al mapear viaje:', error, trip);
            return null;
          }
        })
        .filter(Boolean) as Trip[];
      
      console.log('✅ [useTrips] Viajes cargados exitosamente:', mappedTrips.length);
      setTrips(mappedTrips);

      // Auditar la carga de viajes
      await logRead('trips', undefined, { 
        count: mappedTrips.length,
        action: 'load_all_trips'
      });
    } catch (error) {
      console.error('❌ [useTrips] Error inesperado al cargar viajes:', error);
      errorHandler.handleGenericError(error, { component: 'useTrips', action: 'loadTrips' });
    } finally {
      setGlobalLoading(false);
    }
  };
  
  useEffect(() => {
    loadTrips();
  }, [user]);
  
  const getTripById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    const trip = trips.find(trip => trip.id === id);
    
    if (trip) {
      logRead('trips', id, { action: 'get_trip_by_id' });
    }
    
    return trip;
  };
  
  const addTrip = async (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      if (!validateTrip(trip)) {
        toast.error('Datos del viaje incompletos o inválidos');
        return;
      }
      
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
      
      const newTrip = mapTripToDB({
        ...trip,
        userId: user.id
      });
      
      if (newTrip.start_date instanceof Date) {
        newTrip.start_date = newTrip.start_date.toISOString();
      }
      
      if (newTrip.end_date instanceof Date) {
        newTrip.end_date = newTrip.end_date.toISOString();
      }
      
      console.log('📝 [useTrips] Creando nuevo viaje:', newTrip);
      
      const { data, error } = await supabase
        .from('trips')
        .insert(newTrip)
        .select()
        .single();
      
      if (error) {
        console.error('❌ [useTrips] Error de Supabase:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTrips', action: 'addTrip' });
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el viaje');
        return;
      }
      
      const mappedTrip = mapTripFromDB(data);
      setTrips(prev => [mappedTrip, ...prev]);

      // Auditar la creación
      await logCreate('trips', mappedTrip.id, {
        origin: mappedTrip.origin,
        destination: mappedTrip.destination,
        vehicleId: mappedTrip.vehicleId,
        distance: mappedTrip.distance
      }, { action: 'create_trip' });
      
      console.log('✅ [useTrips] Viaje creado exitosamente:', mappedTrip.id);
      toast.success('Viaje agregado correctamente');
    } catch (error) {
      console.error('❌ [useTrips] Error inesperado al agregar viaje:', error);
      errorHandler.handleGenericError(error, { component: 'useTrips', action: 'addTrip' });
    }
  };
  
  const updateTrip = async (id: string, trip: Partial<Trip>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      const existingTrip = getTripById(id);
      if (!existingTrip) {
        toast.error('Viaje no encontrado');
        return;
      }

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
      
      const updatedTrip = mapTripToDB(trip);
      
      if (updatedTrip.start_date instanceof Date) {
        updatedTrip.start_date = updatedTrip.start_date.toISOString();
      }
      
      if (updatedTrip.end_date instanceof Date) {
        updatedTrip.end_date = updatedTrip.end_date.toISOString();
      }
      
      const { error } = await supabase
        .from('trips')
        .update(updatedTrip)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ [useTrips] Error al actualizar viaje:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTrips', action: 'updateTrip' });
        return;
      }
      
      setTrips(prev => 
        prev.map(t => t.id === id ? { ...t, ...trip } : t)
      );

      // Auditar la actualización
      await logUpdate('trips', id, {
        origin: existingTrip.origin,
        destination: existingTrip.destination,
        distance: existingTrip.distance
      }, trip, { action: 'update_trip' });
      
      console.log('✅ [useTrips] Viaje actualizado exitosamente:', id);
      toast.success('Viaje actualizado correctamente');
    } catch (error) {
      console.error('❌ [useTrips] Error inesperado al actualizar viaje:', error);
      errorHandler.handleGenericError(error, { component: 'useTrips', action: 'updateTrip' });
    }
  };
  
  const deleteTrip = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      const existingTrip = getTripById(id);
      if (!existingTrip) {
        toast.error('Viaje no encontrado');
        return;
      }

      console.log('🔍 [useTrips] Verificando dependencias para eliminar viaje:', id);
      
      const [{ data: expenses }, { data: tollRecords }] = await Promise.all([
        supabase.from('expenses').select('id').eq('trip_id', id).eq('user_id', user.id).limit(1),
        supabase.from('toll_records').select('id').eq('trip_id', id).eq('user_id', user.id).limit(1)
      ]);
      
      if ((expenses && expenses.length > 0) || (tollRecords && tollRecords.length > 0)) {
        toast.error('No se puede eliminar el viaje porque tiene gastos o registros de peaje asociados');
        return;
      }
      
      console.log('🗑️ [useTrips] Eliminando viaje:', id);
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ [useTrips] Error al eliminar viaje:', error);
        errorHandler.handleDatabaseError(error, { component: 'useTrips', action: 'deleteTrip' });
        return;
      }
      
      setTrips(prev => prev.filter(t => t.id !== id));

      // Auditar la eliminación
      await logDelete('trips', id, {
        origin: existingTrip.origin,
        destination: existingTrip.destination,
        vehicleId: existingTrip.vehicleId,
        distance: existingTrip.distance
      }, { action: 'delete_trip' });
      
      console.log('✅ [useTrips] Viaje eliminado exitosamente:', id);
      toast.success('Viaje eliminado correctamente');
    } catch (error) {
      console.error('❌ [useTrips] Error inesperado al eliminar viaje:', error);
      errorHandler.handleGenericError(error, { component: 'useTrips', action: 'deleteTrip' });
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
