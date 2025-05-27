
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, X, Eye } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

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
      // Para vehículos nuevos, guardamos el archivo temporalmente
      const reader = new FileReader();
      reader.onload = () => {
        onUploadComplete(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    const url = await uploadFile(file, userId, vehicleId, documentType);
    if (url) {
      onUploadComplete(url);
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
      window.open(currentUrl, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentUrl ? (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Documento cargado</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFile}
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver
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
