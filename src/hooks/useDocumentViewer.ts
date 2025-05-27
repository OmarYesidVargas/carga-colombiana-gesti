
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDocumentViewer = () => {
  const [loading, setLoading] = useState(false);

  const viewDocument = async (url: string) => {
    if (!url) {
      console.warn('❌ No document URL provided');
      toast.error('No hay documento para mostrar');
      return;
    }

    console.log('📄 Intentando abrir documento:', url);
    setLoading(true);

    try {
      // Si es una URL de Supabase Storage, verificar que existe
      if (url.includes('supabase.co') || url.includes('/storage/')) {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          console.error('❌ Documento no encontrado en storage:', response.status);
          toast.error('Documento no encontrado');
          return;
        }
      }

      // Abrir documento
      if (url.startsWith('data:')) {
        // Para archivos base64
        const byteCharacters = atob(url.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const newUrl = URL.createObjectURL(blob);
        window.open(newUrl, '_blank');
      } else {
        // Para URLs de Supabase
        window.open(url, '_blank');
      }

      console.log('✅ Documento abierto exitosamente');
    } catch (error) {
      console.error('❌ Error al abrir documento:', error);
      toast.error('Error al abrir el documento');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (url: string, filename: string) => {
    if (!url) {
      console.warn('❌ No document URL provided for download');
      toast.error('No hay documento para descargar');
      return;
    }

    console.log('💾 Intentando descargar documento:', url);
    setLoading(true);

    try {
      if (url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      } else {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al descargar documento');
        }
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      }

      console.log('✅ Documento descargado exitosamente');
      toast.success('Documento descargado');
    } catch (error) {
      console.error('❌ Error al descargar documento:', error);
      toast.error('Error al descargar el documento');
    } finally {
      setLoading(false);
    }
  };

  return {
    viewDocument,
    downloadDocument,
    loading
  };
};
