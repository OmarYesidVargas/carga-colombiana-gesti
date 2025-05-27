
import { Vehicle } from '@/types';

/**
 * Mapeador para convertir datos de la DB al formato de la aplicación
 */
export const mapVehicleFromDB = (vehicle: any): Vehicle => {
  if (!vehicle || typeof vehicle !== 'object') {
    throw new Error('Datos de vehículo inválidos');
  }

  console.log('🔄 Mapeando vehículo desde DB:', {
    id: vehicle.id,
    plate: vehicle.plate,
    soat_document_url: vehicle.soat_document_url ? `${vehicle.soat_document_url.substring(0, 30)}...` : 'NULL',
    techno_document_url: vehicle.techno_document_url ? `${vehicle.techno_document_url.substring(0, 30)}...` : 'NULL'
  });

  // Procesar URLs de documentos - asegurar que se mantengan las URLs válidas
  const soatDocumentUrl = vehicle.soat_document_url && vehicle.soat_document_url.trim() !== '' 
    ? vehicle.soat_document_url.trim() 
    : undefined;
  
  const technoDocumentUrl = vehicle.techno_document_url && vehicle.techno_document_url.trim() !== '' 
    ? vehicle.techno_document_url.trim() 
    : undefined;

  console.log('📋 URLs procesadas después de mapeo:', {
    soatDocumentUrl: soatDocumentUrl ? `${soatDocumentUrl.substring(0, 50)}...` : 'UNDEFINED',
    technoDocumentUrl: technoDocumentUrl ? `${technoDocumentUrl.substring(0, 50)}...` : 'UNDEFINED'
  });

  const mappedVehicle = {
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
    // Documentos - asegurar que se mapeen correctamente
    soatExpiryDate: vehicle.soat_expiry_date ? new Date(vehicle.soat_expiry_date) : undefined,
    technoExpiryDate: vehicle.techno_expiry_date ? new Date(vehicle.techno_expiry_date) : undefined,
    soatDocumentUrl,
    technoDocumentUrl,
    soatInsuranceCompany: vehicle.soat_insurance_company || undefined,
    technoCenter: vehicle.techno_center || undefined,
    createdAt: vehicle.created_at,
    updatedAt: vehicle.updated_at
  };

  console.log('✅ Vehículo mapeado final:', {
    id: mappedVehicle.id,
    plate: mappedVehicle.plate,
    hasSoatDoc: !!mappedVehicle.soatDocumentUrl,
    hasTechnoDoc: !!mappedVehicle.technoDocumentUrl,
    soatUrl: mappedVehicle.soatDocumentUrl ? `${mappedVehicle.soatDocumentUrl.substring(0, 30)}...` : 'NO URL',
    technoUrl: mappedVehicle.technoDocumentUrl ? `${mappedVehicle.technoDocumentUrl.substring(0, 30)}...` : 'NO URL'
  });

  return mappedVehicle;
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
  
  // Campos de documentación
  if (vehicle.soatExpiryDate !== undefined) {
    mappedVehicle.soat_expiry_date = vehicle.soatExpiryDate ? vehicle.soatExpiryDate.toISOString().split('T')[0] : null;
  }
  if (vehicle.technoExpiryDate !== undefined) {
    mappedVehicle.techno_expiry_date = vehicle.technoExpiryDate ? vehicle.technoExpiryDate.toISOString().split('T')[0] : null;
  }
  
  // URLs de documentos - CRÍTICO: asegurar que se guarden correctamente
  if (vehicle.soatDocumentUrl !== undefined) {
    const processedUrl = vehicle.soatDocumentUrl && vehicle.soatDocumentUrl.trim() !== '' 
      ? vehicle.soatDocumentUrl.trim() 
      : null;
    mappedVehicle.soat_document_url = processedUrl;
    console.log('💾 Guardando SOAT URL:', processedUrl ? `${processedUrl.substring(0, 30)}...` : 'NULL');
  }
  
  if (vehicle.technoDocumentUrl !== undefined) {
    const processedUrl = vehicle.technoDocumentUrl && vehicle.technoDocumentUrl.trim() !== '' 
      ? vehicle.technoDocumentUrl.trim() 
      : null;
    mappedVehicle.techno_document_url = processedUrl;
    console.log('💾 Guardando Techno URL:', processedUrl ? `${processedUrl.substring(0, 30)}...` : 'NULL');
  }
  
  if (vehicle.soatInsuranceCompany !== undefined) {
    mappedVehicle.soat_insurance_company = vehicle.soatInsuranceCompany?.trim() || null;
  }
  if (vehicle.technoCenter !== undefined) {
    mappedVehicle.techno_center = vehicle.technoCenter?.trim() || null;
  }
  
  console.log('📤 Resultado final del mapeo a DB:', {
    soat_document_url: mappedVehicle.soat_document_url ? 'PRESENTE' : 'NULL',
    techno_document_url: mappedVehicle.techno_document_url ? 'PRESENTE' : 'NULL'
  });
  
  return mappedVehicle;
};
