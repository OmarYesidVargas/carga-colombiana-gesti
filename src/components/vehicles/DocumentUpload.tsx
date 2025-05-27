
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, X, Eye, Download, ExternalLink } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';

interface DocumentUploadProps {
  label: string;
  documentType: 'soat' | 'techno';
  currentUrl?: string;
  vehicleId?: string;
  userId: string;
  onUploadComplete: (url: string) => void;
  onRemove: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  documentType,
  currentUrl,
  vehicleId,
  userId,
  onUploadComplete,
  onRemove
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { uploadFile, uploading } = useFileUpload();

  const handleFileSelect = async (file: File) => {
    if (!vehicleId) {
      // Para vehículos nuevos, guardamos el archivo temporalmente como base64
      const reader = new FileReader();
      reader.onload = () => {
        onUploadComplete(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      const url = await uploadFile(file, userId, vehicleId, documentType);
      if (url) {
        onUploadComplete(url);
        toast.success('Documento subido correctamente');
      } else {
        toast.error('Error al subir el documento');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error al subir el documento');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const openFile = () => {
    if (currentUrl) {
      try {
        // Si es una URL base64 (documento temporal)
        if (currentUrl.startsWith('data:')) {
          // Crear un blob y abrir en nueva pestaña
          const byteCharacters = atob(currentUrl.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        } else {
          // Para URLs normales de Supabase
          window.open(currentUrl, '_blank');
        }
      } catch (error) {
        console.error('Error opening file:', error);
        toast.error('Error al abrir el documento');
      }
    }
  };

  const downloadFile = () => {
    if (currentUrl) {
      try {
        if (currentUrl.startsWith('data:')) {
          // Para archivos base64, crear descarga
          const link = document.createElement('a');
          link.href = currentUrl;
          link.download = `${documentType}_${Date.now()}.pdf`;
          link.click();
        } else {
          // Para URLs de Supabase, abrir en nueva pestaña
          window.open(currentUrl, '_blank');
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        toast.error('Error al descargar el documento');
      }
    }
  };

  const getFileTypeFromUrl = (url: string): string => {
    if (url.startsWith('data:')) {
      const mimeType = url.split(':')[1].split(';')[0];
      return mimeType.includes('pdf') ? 'PDF' : 'Imagen';
    }
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'Imagen';
      default:
        return 'Archivo';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentUrl ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <span className="text-sm font-medium">Documento cargado</span>
                  <p className="text-xs text-muted-foreground">
                    {getFileTypeFromUrl(currentUrl)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openFile}
                  disabled={!currentUrl}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadFile}
                  disabled={!currentUrl}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemove}
                >
                  <X className="h-4 w-4 mr-1" />
                  Quitar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Arrastra un archivo aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-500 mb-4">
              PDF, JPG, PNG (máx. 10MB)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default DocumentUpload;
