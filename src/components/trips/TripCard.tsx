
import React from 'react';
import { Trip, Vehicle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface TripCardProps {
  trip: Trip;
  vehicle?: Vehicle;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  onSelect: (trip: Trip) => void;
}

const TripCard = ({ trip, vehicle, onEdit, onDelete, onSelect }: TripCardProps) => {
  const isActive = trip.endDate ? new Date() <= new Date(trip.endDate) : true;
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isActive ? 'border-l-4 border-l-primary' : ''}`}>
      <CardHeader className="bg-secondary/10 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{trip.origin} → {trip.destination}</h3>
              {isActive && (
                <Badge variant="outline" className="bg-primary/20">
                  Activo
                </Badge>
              )}
            </div>
            {vehicle && (
              <span className="text-xs text-muted-foreground vehicle-plate">
                {vehicle.plate} • {vehicle.brand} {vehicle.model}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(trip)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(trip.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm">
                <span className="font-medium">Inicio:</span> {format(new Date(trip.startDate), 'PPP', { locale: es })}
              </div>
              {trip.endDate && (
                <div className="text-sm">
                  <span className="font-medium">Fin:</span> {format(new Date(trip.endDate), 'PPP', { locale: es })}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Distancia:</span> {trip.distance} km
          </div>
          
          {trip.notes && (
            <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
              "{trip.notes}"
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-0">
        <Button variant="outline" size="sm" onClick={() => onSelect(trip)}>
          Ver gastos
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
