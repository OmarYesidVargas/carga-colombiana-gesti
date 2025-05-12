
import React from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onSelect: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, onEdit, onDelete, onSelect }: VehicleCardProps) => {
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
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
              <span className="text-sm text-muted-foreground ml-2">{vehicle.year}</span>
            </div>
          </div>
          
          {vehicle.color && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: vehicle.color }}></div>
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
