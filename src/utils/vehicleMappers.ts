
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
    // Nuevos campos para Colombia
    soatExpiryDate: vehicle.soat_expiry_date ? new Date(vehicle.soat_expiry_date) : undefined,
    technoExpiryDate: vehicle.techno_expiry_date ? new Date(vehicle.techno_expiry_date) : undefined,
    soatDocumentUrl: vehicle.soat_document_url || undefined,
    technoDocumentUrl: vehicle.techno_document_url || undefined,
    soatInsuranceCompany: vehicle.soat_insurance_company || undefined,
    technoCenter: vehicle.techno_center || undefined,
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
  
  // Nuevos campos para Colombia
  if (vehicle.soatExpiryDate !== undefined) {
    mappedVehicle.soat_expiry_date = vehicle.soatExpiryDate ? vehicle.soatExpiryDate.toISOString().split('T')[0] : null;
  }
  if (vehicle.technoExpiryDate !== undefined) {
    mappedVehicle.techno_expiry_date = vehicle.technoExpiryDate ? vehicle.technoExpiryDate.toISOString().split('T')[0] : null;
  }
  if (vehicle.soatDocumentUrl !== undefined) mappedVehicle.soat_document_url = vehicle.soatDocumentUrl?.trim() || null;
  if (vehicle.technoDocumentUrl !== undefined) mappedVehicle.techno_document_url = vehicle.technoDocumentUrl?.trim() || null;
  if (vehicle.soatInsuranceCompany !== undefined) mappedVehicle.soat_insurance_company = vehicle.soatInsuranceCompany?.trim() || null;
  if (vehicle.technoCenter !== undefined) mappedVehicle.techno_center = vehicle.technoCenter?.trim() || null;
  
  return mappedVehicle;
};
