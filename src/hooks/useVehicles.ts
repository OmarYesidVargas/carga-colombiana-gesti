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
    if (!vehicle || typeof vehicle !== 'object') {
      throw new Error('Datos de vehículo inválidos');
    }

    return {
      id: vehicle.id,
      userId: vehicle.user_id,
      plate: vehicle.plate || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: parseInt(vehicle.year) || new Date().getFullYear(),
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
    
    if (vehicle.plate) mappedVehicle.plate = vehicle.plate.trim();
    if (vehicle.brand) mappedVehicle.brand = vehicle.brand.trim();
    if (vehicle.model) mappedVehicle.model = vehicle.model.trim();
    if (vehicle.year !== undefined) mappedVehicle.year = parseInt(String(vehicle.year));
    if (vehicle.color !== undefined) mappedVehicle.color = vehicle.color?.trim() || null;
    if (vehicle.fuelType !== undefined) mappedVehicle.fuel_type = vehicle.fuelType?.trim() || null;
    if (vehicle.capacity !== undefined) mappedVehicle.capacity = vehicle.capacity?.trim() || null;
    if (vehicle.imageUrl !== undefined) mappedVehicle.image_url = vehicle.imageUrl?.trim() || null;
    if (vehicle.userId) mappedVehicle.user_id = vehicle.userId;
    
    return mappedVehicle;
  };
  
  /**
   * Validar datos del vehículo
   */
  const validateVehicle = (vehicle: any): boolean => {
    if (!vehicle) return false;
    if (!vehicle.plate || typeof vehicle.plate !== 'string' || vehicle.plate.trim().length === 0) return false;
    if (!vehicle.brand || typeof vehicle.brand !== 'string' || vehicle.brand.trim().length === 0) return false;
    if (!vehicle.model || typeof vehicle.model !== 'string' || vehicle.model.trim().length === 0) return false;
    if (!vehicle.year || isNaN(Number(vehicle.year)) || Number(vehicle.year) < 1900 || Number(vehicle.year) > new Date().getFullYear() + 2) return false;
    
    return true;
  };
  
  /**
   * Carga vehículos desde Supabase
   */
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
        .eq('user_id', user.id)
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
      
      // Mapear datos con validación
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
  
  /**
   * Efecto para cargar vehículos cuando cambia el usuario
   */
  useEffect(() => {
    loadVehicles();
  }, [user]);
  
  /**
   * Obtiene un vehículo por su ID
   * @param {string} id - ID del vehículo
   * @returns {Vehicle | undefined} Vehículo encontrado o undefined
   */
  const getVehicleById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    return vehicles.find(vehicle => vehicle.id === id);
  };
  
  /**
   * Agrega un nuevo vehículo
   * @param {Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} vehicle - Datos del vehículo
   */
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      // Validar datos
      if (!validateVehicle(vehicle)) {
        toast.error('Datos del vehículo incompletos o inválidos');
        return;
      }

      // Verificar placa duplicada
      const existingVehicle = vehicles.find(v => 
        v.plate.toLowerCase().trim() === vehicle.plate.toLowerCase().trim()
      );
      
      if (existingVehicle) {
        toast.error('Ya existe un vehículo con esta placa');
        return;
      }
      
      // Preparar datos para la DB
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
      
      // Actualizar estado local
      const mappedVehicle = mapVehicleFromDB(data);
      setVehicles(prev => [mappedVehicle, ...prev]);
      
      toast.success('Vehículo agregado correctamente');
    } catch (error) {
      console.error('Error inesperado al agregar vehículo:', error);
      toast.error('Error inesperado al agregar vehículo');
    }
  };
  
  /**
   * Actualiza un vehículo existente
   * @param {string} id - ID del vehículo a actualizar
   * @param {Partial<Vehicle>} vehicle - Datos parciales del vehículo
   */
  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      // Verificar placa duplicada si se está actualizando
      if (vehicle.plate) {
        const existingVehicle = vehicles.find(v => 
          v.id !== id && v.plate.toLowerCase().trim() === vehicle.plate.toLowerCase().trim()
        );
        
        if (existingVehicle) {
          toast.error('Ya existe un vehículo con esta placa');
          return;
        }
      }
      
      // Mapear datos para la DB
      const updatedVehicle = mapVehicleToDB(vehicle);
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('vehicles')
        .update(updatedVehicle)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error al actualizar vehículo:', error);
        if (error.code === '23505') {
          toast.error('Ya existe un vehículo con esta placa');
        } else {
          toast.error('Error al actualizar el vehículo');
        }
        return;
      }
      
      // Actualizar estado local
      setVehicles(prev => 
        prev.map(v => v.id === id ? { ...v, ...vehicle } : v)
      );
      
      toast.success('Vehículo actualizado correctamente');
    } catch (error) {
      console.error('Error inesperado al actualizar vehículo:', error);
      toast.error('Error inesperado al actualizar vehículo');
    }
  };
  
  /**
   * Elimina un vehículo
   * @param {string} id - ID del vehículo a eliminar
   */
  const deleteVehicle = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      // Verificar si el vehículo tiene viajes asociados
      const { data: trips } = await supabase
        .from('trips')
        .select('id')
        .eq('vehicle_id', id)
        .eq('user_id', user.id)
        .limit(1);
      
      if (trips && trips.length > 0) {
        toast.error('No se puede eliminar el vehículo porque tiene viajes asociados');
        return;
      }
      
      // Eliminar de Supabase
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error al eliminar vehículo:', error);
        toast.error('Error al eliminar el vehículo');
        return;
      }
      
      // Eliminar del estado local
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
