
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Hook personalizado para gestionar vehículos
 * @param {User | null} user - Usuario autenticado
 * @param {Function} setGlobalLoading - Función para actualizar el estado global de carga
 * @returns {Object} Funciones y estado para gestionar vehículos
 */
export const useVehicles = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  /**
   * Mapeador para convertir datos de la DB al formato de la aplicación
   */
  const mapVehicleFromDB = (vehicle: any): Vehicle => {
    return {
      id: vehicle.id,
      userId: vehicle.user_id,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || null,
      fuelType: vehicle.fuel_type || null,
      capacity: vehicle.capacity || null,
      imageUrl: vehicle.image_url || null,
      createdAt: vehicle.created_at,
      updatedAt: vehicle.updated_at
    };
  };
  
  /**
   * Mapeador para convertir datos de la aplicación al formato de la DB
   */
  const mapVehicleToDB = (vehicle: Partial<Vehicle>): any => {
    const mappedVehicle: Record<string, any> = {};
    
    if (vehicle.plate !== undefined) mappedVehicle.plate = vehicle.plate;
    if (vehicle.brand !== undefined) mappedVehicle.brand = vehicle.brand;
    if (vehicle.model !== undefined) mappedVehicle.model = vehicle.model;
    if (vehicle.year !== undefined) mappedVehicle.year = vehicle.year;
    if (vehicle.color !== undefined) mappedVehicle.color = vehicle.color;
    if (vehicle.fuelType !== undefined) mappedVehicle.fuel_type = vehicle.fuelType;
    if (vehicle.capacity !== undefined) mappedVehicle.capacity = vehicle.capacity;
    if (vehicle.imageUrl !== undefined) mappedVehicle.image_url = vehicle.imageUrl;
    if (vehicle.userId !== undefined) mappedVehicle.user_id = vehicle.userId;
    
    return mappedVehicle;
  };
  
  /**
   * Carga vehículos desde Supabase
   */
  const loadVehicles = async () => {
    if (!user) return;
    
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Mapear datos de la DB al formato de la aplicación
      const mappedVehicles = data.map(mapVehicleFromDB);
      setVehicles(mappedVehicles);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      toast.error('Error al cargar los vehículos');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  /**
   * Efecto para cargar vehículos cuando cambia el usuario
   */
  useEffect(() => {
    if (user) {
      loadVehicles();
    } else {
      setVehicles([]);
    }
  }, [user]);
  
  /**
   * Obtiene un vehículo por su ID
   * @param {string} id - ID del vehículo
   * @returns {Vehicle | undefined} Vehículo encontrado o undefined
   */
  const getVehicleById = (id: string) => {
    return vehicles.find(vehicle => vehicle.id === id);
  };
  
  /**
   * Agrega un nuevo vehículo
   * @param {Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} vehicle - Datos del vehículo
   */
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      // Preparar datos para la base de datos
      const newVehicle = mapVehicleToDB({
        ...vehicle,
        userId: user.id
      });
      
      // Insertar en Supabase
      const { data, error } = await supabase
        .from('vehicles')
        .insert(newVehicle)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Actualizar estado local con la respuesta mapeada
      const mappedVehicle = mapVehicleFromDB(data);
      setVehicles(prev => [...prev, mappedVehicle]);
      
      toast.success('Vehículo agregado correctamente');
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      toast.error('Error al agregar el vehículo');
    }
  };
  
  /**
   * Actualiza un vehículo existente
   * @param {string} id - ID del vehículo a actualizar
   * @param {Partial<Vehicle>} vehicle - Datos parciales del vehículo
   */
  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    if (!user) return;
    
    try {
      // Mapear datos para la DB
      const updatedVehicle = mapVehicleToDB(vehicle);
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('vehicles')
        .update(updatedVehicle)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Actualizar estado local
      setVehicles(prev => 
        prev.map(v => v.id === id ? { ...v, ...vehicle } : v)
      );
      
      toast.success('Vehículo actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      toast.error('Error al actualizar el vehículo');
    }
  };
  
  /**
   * Elimina un vehículo
   * @param {string} id - ID del vehículo a eliminar
   */
  const deleteVehicle = async (id: string) => {
    if (!user) return;
    
    try {
      // Eliminar de Supabase
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Eliminar del estado local
      setVehicles(prev => prev.filter(v => v.id !== id));
      
      toast.success('Vehículo eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      toast.error('Error al eliminar el vehículo');
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
