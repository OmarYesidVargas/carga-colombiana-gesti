
import React from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Edit, Trash, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onSelect: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, onEdit, onDelete, onSelect }: VehicleCardProps) => {
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
    if (!date) return { status: 'none', color: 'gray', icon: null };
    if (isExpired(date)) return { status: 'expired', color: 'red', icon: AlertTriangle };
    if (isExpiringSoon(date)) return { status: 'expiring', color: 'yellow', icon: Clock };
    return { status: 'valid', color: 'green', icon: CheckCircle };
  };

  const soatStatus = getDocumentStatus(vehicle.soatExpiryDate || vehicle.soatExpiry);
  const technoStatus = getDocumentStatus(vehicle.technoExpiryDate || vehicle.technicalReviewExpiry);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-secondary/10 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold vehicle-plate">{vehicle.plate}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(vehicle.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
              <span className="text-sm text-muted-foreground ml-2">{vehicle.year}</span>
            </div>
          </div>
          
          {vehicle.color && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: vehicle.color }}></div>
              <span className="text-sm">{vehicle.color}</span>
            </div>
          )}
          
          {vehicle.fuelType && (
            <div className="text-sm text-muted-foreground">
              Combustible: {vehicle.fuelType}
            </div>
          )}
          
          {vehicle.capacity && (
            <div className="text-sm text-muted-foreground">
              Capacidad: {vehicle.capacity}
            </div>
          )}

          {/* Estado de documentos para Colombia */}
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium text-gray-700">Documentación</h4>
            
            {/* SOAT */}
            <div className="flex items-center justify-between">
              <span className="text-sm">SOAT</span>
              {(vehicle.soatExpiryDate || vehicle.soatExpiry) ? (
                <div className="flex items-center gap-2">
                  {soatStatus.icon && <soatStatus.icon className={`h-4 w-4 text-${soatStatus.color}-600`} />}
                  <Badge 
                    variant={soatStatus.status === 'valid' ? 'default' : 'destructive'}
                    className={`text-xs ${
                      soatStatus.status === 'valid' ? 'bg-green-100 text-green-700' :
                      soatStatus.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {soatStatus.status === 'expired' ? 'Vencido' :
                     soatStatus.status === 'expiring' ? 'Por vencer' : 'Vigente'}
                  </Badge>
                </div>
              ) : (
                <Badge variant="outline" className="text-xs">No registrado</Badge>
              )}
            </div>

            {/* Tecnomecánica */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Tecnomecánica</span>
              {(vehicle.technoExpiryDate || vehicle.technicalReviewExpiry) ? (
                <div className="flex items-center gap-2">
                  {technoStatus.icon && <technoStatus.icon className={`h-4 w-4 text-${technoStatus.color}-600`} />}
                  <Badge 
                    variant={technoStatus.status === 'valid' ? 'default' : 'destructive'}
                    className={`text-xs ${
                      technoStatus.status === 'valid' ? 'bg-green-100 text-green-700' :
                      technoStatus.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {technoStatus.status === 'expired' ? 'Vencido' :
                     technoStatus.status === 'expiring' ? 'Por vencer' : 'Vigente'}
                  </Badge>
                </div>
              ) : (
                <Badge variant="outline" className="text-xs">No registrado</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="text-xs text-muted-foreground">
          Añadido {formatDistanceToNow(new Date(vehicle.createdAt), { locale: es, addSuffix: true })}
        </div>
        <Button variant="outline" size="sm" onClick={() => onSelect(vehicle)}>
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
