import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateVehicle } from '@/utils/validators';
import { mapVehicleFromDB, mapVehicleToDB } from '@/utils/vehicleMappers';
import { useAuditLogger } from './useAuditLogger';

export const useVehicles = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { logRead, logCreate, logUpdate, logDelete } = useAuditLogger(user);
  
  const loadVehicles = async () => {
    if (!user) {
      setVehicles([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      console.log('🔍 Cargando vehículos desde DB...');
      
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          id,
          user_id,
          plate,
          brand,
          model,
          year,
          color,
          fuel_type,
          capacity,
          image_url,
          soat_expiry_date,
          techno_expiry_date,
          soat_document_url,
          techno_document_url,
          soat_insurance_company,
          techno_center,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error al cargar vehículos:', error);
        toast.error('Error al cargar los vehículos');
        return;
      }
      
      if (!data) {
        console.log('📭 No hay datos de vehículos');
        setVehicles([]);
        return;
      }
      
      console.log('📊 Datos raw de vehículos:', data);
      
      const mappedVehicles = data
        .filter(vehicle => vehicle && typeof vehicle === 'object')
        .map(vehicle => {
          try {
            console.log('🔄 Mapeando vehículo individual:', {
              id: vehicle.id,
              plate: vehicle.plate,
              soat_document_url: vehicle.soat_document_url,
              techno_document_url: vehicle.techno_document_url
            });
            return mapVehicleFromDB(vehicle);
          } catch (error) {
            console.error('❌ Error al mapear vehículo:', error, vehicle);
            return null;
          }
        })
        .filter(Boolean) as Vehicle[];
      
      console.log('✅ Vehículos mapeados finales:', mappedVehicles.map(v => ({
        id: v.id,
        plate: v.plate,
        soatDocumentUrl: v.soatDocumentUrl,
        technoDocumentUrl: v.technoDocumentUrl
      })));
      
      // Registrar auditoría de lectura
      await logRead('vehicles', undefined, { 
        count: mappedVehicles.length,
        action: 'load_all_vehicles'
      });
      
      setVehicles(mappedVehicles);
    } catch (error) {
      console.error('❌ Error inesperado al cargar vehículos:', error);
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
    const vehicle = vehicles.find(vehicle => vehicle.id === id);
    
    // Registrar auditoría de lectura individual
    if (vehicle) {
      logRead('vehicles', id, { action: 'get_vehicle_by_id' });
    }
    
    return vehicle;
  };
  
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      console.log('🚗 Intentando agregar vehículo:', vehicleData);
      console.log('📄 URLs de documentos recibidas:', {
        soatDocumentUrl: vehicleData.soatDocumentUrl,
        technoDocumentUrl: vehicleData.technoDocumentUrl
      });
      
      // Crear objeto con datos normalizados y type casting para fuelType
      const normalizedVehicle = {
        ...vehicleData,
        plate: vehicleData.plate?.trim().toUpperCase() || '',
        brand: vehicleData.brand?.trim() || '',
        model: vehicleData.model?.trim() || '',
        year: typeof vehicleData.year === 'string' ? parseInt(vehicleData.year, 10) : vehicleData.year,
        color: vehicleData.color?.trim() || null,
        fuelType: (vehicleData.fuelType?.trim() || null) as Vehicle['fuelType'],
        capacity: vehicleData.capacity?.trim() || null,
        // Asegurar que las URLs de documentos se mantengan
        soatDocumentUrl: vehicleData.soatDocumentUrl || null,
        technoDocumentUrl: vehicleData.technoDocumentUrl || null
      };
      
      console.log('🔄 Vehículo normalizado:', {
        ...normalizedVehicle,
        soatDocumentUrl: normalizedVehicle.soatDocumentUrl ? 'PRESENTE' : 'NULL',
        technoDocumentUrl: normalizedVehicle.technoDocumentUrl ? 'PRESENTE' : 'NULL'
      });
      
      if (!validateVehicle(normalizedVehicle)) {
        console.error('❌ Validación fallida para vehículo:', normalizedVehicle);
        toast.error('Por favor, completa todos los campos obligatorios correctamente');
        return;
      }

      const existingVehicle = vehicles.find(v => 
        v.plate.toLowerCase().trim() === normalizedVehicle.plate.toLowerCase().trim()
      );
      
      if (existingVehicle) {
        toast.error('Ya existe un vehículo con esta placa');
        return;
      }
      
      const vehicleToSave = {
        ...normalizedVehicle,
        userId: user.id
      } as Vehicle;
      
      console.log('💾 Preparando para guardar vehículo con URLs:', {
        id: 'nuevo',
        plate: vehicleToSave.plate,
        soatDocumentUrl: vehicleToSave.soatDocumentUrl,
        technoDocumentUrl: vehicleToSave.technoDocumentUrl
      });
      
      const newVehicle = mapVehicleToDB(vehicleToSave);
      
      console.log('📤 Datos mapeados para DB:', {
        ...newVehicle,
        soat_document_url: newVehicle.soat_document_url,
        techno_document_url: newVehicle.techno_document_url
      });
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert(newVehicle)
        .select(`
          id,
          user_id,
          plate,
          brand,
          model,
          year,
          color,
          fuel_type,
          capacity,
          image_url,
          soat_expiry_date,
          techno_expiry_date,
          soat_document_url,
          techno_document_url,
          soat_insurance_company,
          techno_center,
          created_at,
          updated_at
        `)
        .single();
      
      if (error) {
        console.error('❌ Error de Supabase:', error);
        if (error.code === '23505') {
          toast.error('Ya existe un vehículo con esta placa');
        } else {
          toast.error(`Error al guardar el vehículo: ${error.message}`);
        }
        return;
      }
      
      if (!data) {
        toast.error('No se pudo crear el vehículo');
        return;
      }
      
      console.log('💾 Vehículo guardado en DB (RAW):', {
        id: data.id,
        plate: data.plate,
        soat_document_url: data.soat_document_url,
        techno_document_url: data.techno_document_url
      });
      
      const mappedVehicle = mapVehicleFromDB(data);
      
      console.log('✅ Vehículo mapeado final con URLs:', {
        id: mappedVehicle.id,
        plate: mappedVehicle.plate,
        soatDocumentUrl: mappedVehicle.soatDocumentUrl,
        technoDocumentUrl: mappedVehicle.technoDocumentUrl
      });
      
      // Registrar auditoría de creación
      await logCreate('vehicles', mappedVehicle.id, {
        plate: mappedVehicle.plate,
        brand: mappedVehicle.brand,
        model: mappedVehicle.model,
        year: mappedVehicle.year
      }, { action: 'create_vehicle' });
      
      setVehicles(prev => [mappedVehicle, ...prev]);
      toast.success('Vehículo agregado correctamente');
      
      console.log('✅ Vehículo creado exitosamente con documentos');
    } catch (error) {
      console.error('❌ Error inesperado al agregar vehículo:', error);
      toast.error('Error inesperado al agregar vehículo');
    }
  };
  
  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      console.log('🔄 Intentando actualizar vehículo:', id, vehicleData);
      
      const existingVehicle = getVehicleById(id);
      if (!existingVehicle) {
        toast.error('Vehículo no encontrado');
        return;
      }
      
      // Normalizar datos con type casting
      const normalizedData = {
        ...vehicleData,
        plate: vehicleData.plate?.trim().toUpperCase(),
        brand: vehicleData.brand?.trim(),
        model: vehicleData.model?.trim(),
        year: typeof vehicleData.year === 'string' ? parseInt(vehicleData.year, 10) : vehicleData.year,
        color: vehicleData.color?.trim() || null,
        fuelType: vehicleData.fuelType ? vehicleData.fuelType as Vehicle['fuelType'] : undefined,
        capacity: vehicleData.capacity?.trim() || null,
        // Mantener URLs de documentos si están presentes
        soatDocumentUrl: vehicleData.soatDocumentUrl !== undefined ? vehicleData.soatDocumentUrl : existingVehicle.soatDocumentUrl,
        technoDocumentUrl: vehicleData.technoDocumentUrl !== undefined ? vehicleData.technoDocumentUrl : existingVehicle.technoDocumentUrl
      };
      
      console.log('📋 URLs de documentos en actualización:', {
        soatDocumentUrl: normalizedData.soatDocumentUrl,
        technoDocumentUrl: normalizedData.technoDocumentUrl
      });
      
      // Validar solo si hay cambios en campos obligatorios
      const hasRequiredFieldChanges = normalizedData.plate || normalizedData.brand || normalizedData.model || normalizedData.year;
      
      if (hasRequiredFieldChanges) {
        const vehicleToValidate = {
          ...existingVehicle,
          ...normalizedData
        };
        
        if (!validateVehicle(vehicleToValidate)) {
          toast.error('Datos del vehículo incompletos o inválidos');
          return;
        }
      }
      
      if (normalizedData.plate) {
        const plateExists = vehicles.find(v => 
          v.id !== id && v.plate.toLowerCase().trim() === normalizedData.plate.toLowerCase().trim()
        );
        
        if (plateExists) {
          toast.error('Ya existe un vehículo con esta placa');
          return;
        }
      }
      
      const updatedVehicle = mapVehicleToDB(normalizedData);
      
      console.log('💾 Datos de actualización para DB:', {
        ...updatedVehicle,
        soat_document_url: updatedVehicle.soat_document_url,
        techno_document_url: updatedVehicle.techno_document_url
      });
      
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
      
      // Registrar auditoría de actualización
      await logUpdate('vehicles', id, {
        plate: existingVehicle.plate,
        brand: existingVehicle.brand,
        model: existingVehicle.model
      }, normalizedData, { action: 'update_vehicle' });
      
      setVehicles(prev => 
        prev.map(v => v.id === id ? { ...v, ...normalizedData } as Vehicle : v)
      );
      
      toast.success('Vehículo actualizado correctamente');
      
      console.log('✅ Vehículo actualizado exitosamente');
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
      const existingVehicle = getVehicleById(id);
      if (!existingVehicle) {
        toast.error('Vehículo no encontrado');
        return;
      }
      
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
      
      // Registrar auditoría de eliminación
      await logDelete('vehicles', id, {
        plate: existingVehicle.plate,
        brand: existingVehicle.brand,
        model: existingVehicle.model,
        year: existingVehicle.year
      }, { action: 'delete_vehicle' });
      
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
