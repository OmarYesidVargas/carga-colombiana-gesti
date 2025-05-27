
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (
    file: File,
    userId: string,
    vehicleId: string,
    documentType: 'soat' | 'techno'
  ): Promise<string | null> => {
    try {
      setUploading(true);

      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipo de archivo no permitido. Use PDF, JPG o PNG');
        return null;
      }

      // Validar tamaño (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo no debe superar 10MB');
        return null;
      }

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userId}/${vehicleId}/${documentType}_${timestamp}.${fileExtension}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('vehicle-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error al subir archivo:', error);
        toast.error('Error al subir el archivo');
        return null;
      }

      // Obtener URL pública del archivo
      const { data: urlData } = supabase.storage
        .from('vehicle-documents')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error inesperado:', error);
      toast.error('Error inesperado al subir archivo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('vehicle-documents')
        .remove([filePath]);

      if (error) {
        console.error('Error al eliminar archivo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error inesperado al eliminar archivo:', error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading
  };
};
