
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

      console.log('📤 Subiendo archivo a bucket vehicle-documents:', fileName);

      // Verificar si el bucket existe, si no crearlo
      const { data: buckets } = await supabase.storage.listBuckets();
      const vehicleDocumentsBucket = buckets?.find(bucket => bucket.name === 'vehicle-documents');
      
      if (!vehicleDocumentsBucket) {
        console.log('📦 Creando bucket vehicle-documents...');
        const { error: bucketError } = await supabase.storage.createBucket('vehicle-documents', {
          public: true,
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (bucketError) {
          console.error('❌ Error al crear bucket:', bucketError);
        } else {
          console.log('✅ Bucket vehicle-documents creado');
        }
      }

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('vehicle-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('❌ Error al subir archivo:', error);
        toast.error(`Error al subir el archivo: ${error.message}`);
        return null;
      }

      console.log('✅ Archivo subido correctamente:', data.path);

      // Obtener URL pública del archivo
      const { data: urlData } = supabase.storage
        .from('vehicle-documents')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      console.log('🔗 URL pública generada:', publicUrl);

      return publicUrl;
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      toast.error('Error inesperado al subir archivo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      console.log('🗑️ Eliminando archivo:', filePath);

      // Extraer el path del archivo desde la URL
      let pathToDelete = filePath;
      if (filePath.includes('/storage/v1/object/public/vehicle-documents/')) {
        pathToDelete = filePath.split('/storage/v1/object/public/vehicle-documents/')[1];
      }

      const { error } = await supabase.storage
        .from('vehicle-documents')
        .remove([pathToDelete]);

      if (error) {
        console.error('❌ Error al eliminar archivo:', error);
        return false;
      }

      console.log('✅ Archivo eliminado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error inesperado al eliminar archivo:', error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading
  };
};
