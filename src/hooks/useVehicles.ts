
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateVehicle } from '@/utils/validators';
import { mapVehicleFromDB, mapVehicleToDB } from '@/utils/vehicleMappers';

export const useVehicles = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const loadVehicles = async () => {
    if (!user) {
      setVehicles([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar vehículos:', error);
        toast.error('Error al cargar los vehículos');
        return;
      }
      
      if (!data) {
        setVehicles([]);
        return;
      }
      
      const mappedVehicles = data
        .filter(vehicle => vehicle && typeof vehicle === 'object')
        .map(vehicle => {
          try {
            return mapVehicleFromDB(vehicle);
          } catch (error) {
            console.error('Error al mapear vehículo:', error, vehicle);
            return null;
          }
        })
        .filter(Boolean) as Vehicle[];
      
      setVehicles(mappedVehicles);
    } catch (error) {
      console.error('Error inesperado al cargar vehículos:', error);
      toast.error('Error inesperado al cargar vehículos');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  useEffect(() => {
    loadVehicles();
  }, [user]);
  
  const getVehicleById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return vehicles.find(vehicle => vehicle.id === id);
  };
  
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      if (!validateVehicle(vehicle)) {
        toast.error('Datos del vehículo incompletos o inválidos');
        return;
      }

      const existingVehicle = vehicles.find(v => 
        v.plate.toLowerCase().trim() === vehicle.plate.toLowerCase().trim()
      );
      
      if (existingVehicle) {
        toast.error('Ya existe un vehículo con esta placa');
        return;
      }
      
      const newVehicle = mapVehicleToDB({
        ...vehicle,
        userId: user.id
      });
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert(newVehicle)
        .select()
        .single();
      
      if (error) {
        console.error('Error de Supabase:', error);
        if (error.code === '23505') {
          toast.error('Ya existe un vehículo con esta placa');
        } else {
          toast.error('Error al guardar el vehículo');
        }
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el vehículo');
        return;
      }
      
      const mappedVehicle = mapVehicleFromDB(data);
      setVehicles(prev => [mappedVehicle, ...prev]);
      
      toast.success('Vehículo agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar vehículo:', error);
      toast.error('Error inesperado al agregar vehículo');
    }
  };
  
  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      if (vehicle.plate) {
        const existingVehicle = vehicles.find(v => 
          v.id !== id && v.plate.toLowerCase().trim() === vehicle.plate.toLowerCase().trim()
        );
        
        if (existingVehicle) {
          toast.error('Ya existe un vehículo con esta placa');
          return;
        }
      }
      
      const updatedVehicle = mapVehicleToDB(vehicle);
      
      const { error } = await supabase
        .from('vehicles')
        .update(updatedVehicle)
        .eq('id', id);
      
      if (error) {
        console.error('Error al actualizar vehículo:', error);
        if (error.code === '23505') {
          toast.error('Ya existe un vehículo con esta placa');
        } else {
          toast.error('Error al actualizar el vehículo');
        }
        return;
      }
      
      setVehicles(prev => 
        prev.map(v => v.id === id ? { ...v, ...vehicle } : v)
      );
      
      toast.success('Vehículo actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar vehículo:', error);
      toast.error('Error inesperado al actualizar vehículo');
    }
  };
  
  const deleteVehicle = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      const { data: trips } = await supabase
        .from('trips')
        .select('id')
        .eq('vehicle_id', id)
        .limit(1);
      
      if (trips && trips.length > 0) {
        toast.error('No se puede eliminar el vehículo porque tiene viajes asociados');
        return;
      }
      
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar vehículo:', error);
        toast.error('Error al eliminar el vehículo');
        return;
      }
      
      setVehicles(prev => prev.filter(v => v.id !== id));
      
      toast.success('Vehículo eliminado correctamente');
    } catch (error) {
      console.error('Error inesperado al eliminar vehículo:', error);
      toast.error('Error inesperado al eliminar vehículo');
    }
  };
  
  return {
    vehicles,
    getVehicleById,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
};
