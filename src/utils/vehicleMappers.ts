
import { Vehicle } from '@/types';

/**
 * Mapeador para convertir datos de la DB al formato de la aplicación
 */
export const mapVehicleFromDB = (vehicle: any): Vehicle => {
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
export const mapVehicleToDB = (vehicle: Partial<Vehicle>): any => {
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
