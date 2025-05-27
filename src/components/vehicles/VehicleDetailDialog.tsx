
import React from 'react';
import { Vehicle } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, 
  Calendar, 
  Palette, 
  Fuel, 
  Users, 
  FileText, 
  Eye, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDocumentViewer } from '@/hooks/useDocumentViewer';

interface VehicleDetailDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VehicleDetailDialog: React.FC<VehicleDetailDialogProps> = ({
  vehicle,
  open,
  onOpenChange
}) => {
  const { viewDocument, downloadDocument, loading } = useDocumentViewer();

  if (!vehicle) return null;

  const isExpiringSoon = (date?: Date | string) => {
    if (!date) return false;
    const expiryDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (date?: Date | string) => {
    if (!date) return false;
    const expiryDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return expiryDate < today;
  };

  const getDocumentStatus = (date?: Date | string) => {
    if (!date) return { status: 'none', color: 'gray', icon: null, text: 'No registrado' };
    if (isExpired(date)) return { status: 'expired', color: 'red', icon: AlertTriangle, text: 'Vencido' };
    if (isExpiringSoon(date)) return { status: 'expiring', color: 'yellow', icon: Clock, text: 'Por vencer' };
    return { status: 'valid', color: 'green', icon: CheckCircle, text: 'Vigente' };
  };

  // Función mejorada para verificar si hay documento
  const hasDocument = (url: string | undefined): boolean => {
    console.log('📋 Verificando documento URL:', url);
    
    if (!url) {
      console.log('📋 URL no definida');
      return false;
    }
    
    const trimmedUrl = url.trim();
    if (trimmedUrl === '' || trimmedUrl === 'null' || trimmedUrl === 'undefined') {
      console.log('📋 URL vacía o inválida:', trimmedUrl);
      return false;
    }
    
    // Verificar si es una URL válida
    const isValidUrl = trimmedUrl.startsWith('data:') || 
                      trimmedUrl.startsWith('http://') || 
                      trimmedUrl.startsWith('https://') ||
                      trimmedUrl.includes('supabase.co');
    
    console.log(`📋 Verificando documento: ${trimmedUrl.substring(0, 50)}... -> ${isValidUrl}`);
    return isValidUrl;
  };

  const handleViewDocument = (url: string | undefined) => {
    console.log('👁️ Intentando ver documento:', url);
    if (hasDocument(url)) {
      viewDocument(url!);
    } else {
      console.log('❌ No se puede ver el documento, URL inválida');
    }
  };

  const handleDownloadDocument = (url: string | undefined, type: string) => {
    console.log('💾 Intentando descargar documento:', url);
    if (hasDocument(url)) {
      const filename = `${type}_${vehicle.plate}_${Date.now()}.pdf`;
      downloadDocument(url!, filename);
    } else {
      console.log('❌ No se puede descargar el documento, URL inválida');
    }
  };

  const soatStatus = getDocumentStatus(vehicle.soatExpiryDate);
  const technoStatus = getDocumentStatus(vehicle.technoExpiryDate);

  // Log detallado para debugging
  console.log('🚗 Detalles del vehículo en diálogo:', {
    id: vehicle.id,
    plate: vehicle.plate,
    soatDocumentUrl: vehicle.soatDocumentUrl,
    technoDocumentUrl: vehicle.technoDocumentUrl,
    hasSoatDoc: hasDocument(vehicle.soatDocumentUrl),
    hasTechnoDoc: hasDocument(vehicle.technoDocumentUrl)
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Detalles del Vehículo - {vehicle.plate}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                  <p className="text-sm text-muted-foreground">Marca y Modelo</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">{vehicle.year}</span>
                  <p className="text-sm text-muted-foreground">Año</p>
                </div>
              </div>

              {vehicle.color && (
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: vehicle.color }}
                    ></div>
                    <span className="font-medium">{vehicle.color}</span>
                    <p className="text-sm text-muted-foreground">Color</p>
                  </div>
                </div>
              )}

              {vehicle.fuelType && (
                <div className="flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{vehicle.fuelType}</span>
                    <p className="text-sm text-muted-foreground">Combustible</p>
                  </div>
                </div>
              )}

              {vehicle.capacity && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{vehicle.capacity}</span>
                    <p className="text-sm text-muted-foreground">Capacidad</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documentación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SOAT */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">SOAT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {soatStatus.icon && (
                      <soatStatus.icon className={`h-4 w-4 text-${soatStatus.color}-600`} />
                    )}
                    <Badge 
                      variant={soatStatus.status === 'valid' ? 'default' : 'destructive'}
                      className={`text-xs ${
                        soatStatus.status === 'valid' ? 'bg-green-100 text-green-700' :
                        soatStatus.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {soatStatus.text}
                    </Badge>
                  </div>
                </div>

                {vehicle.soatExpiryDate && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Vence: {format(new Date(vehicle.soatExpiryDate), 'dd/MM/yyyy', { locale: es })}
                  </p>
                )}

                {vehicle.soatInsuranceCompany && (
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{vehicle.soatInsuranceCompany}</span>
                  </div>
                )}

                {hasDocument(vehicle.soatDocumentUrl) ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(vehicle.soatDocumentUrl)}
                      disabled={loading}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(vehicle.soatDocumentUrl, 'SOAT')}
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">No hay documento adjunto</p>
                    <p className="text-xs text-red-500">URL: {vehicle.soatDocumentUrl || 'No definida'}</p>
                  </div>
                )}
              </div>

              {/* Tecnomecánica */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Tecnomecánica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {technoStatus.icon && (
                      <technoStatus.icon className={`h-4 w-4 text-${technoStatus.color}-600`} />
                    )}
                    <Badge 
                      variant={technoStatus.status === 'valid' ? 'default' : 'destructive'}
                      className={`text-xs ${
                        technoStatus.status === 'valid' ? 'bg-green-100 text-green-700' :
                        technoStatus.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {technoStatus.text}
                    </Badge>
                  </div>
                </div>

                {vehicle.technoExpiryDate && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Vence: {format(new Date(vehicle.technoExpiryDate), 'dd/MM/yyyy', { locale: es })}
                  </p>
                )}

                {vehicle.technoCenter && (
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{vehicle.technoCenter}</span>
                  </div>
                )}

                {hasDocument(vehicle.technoDocumentUrl) ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(vehicle.technoDocumentUrl)}
                      disabled={loading}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(vehicle.technoDocumentUrl, 'Tecnomecanica')}
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">No hay documento adjunto</p>
                    <p className="text-xs text-red-500">URL: {vehicle.technoDocumentUrl || 'No definida'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailDialog;
