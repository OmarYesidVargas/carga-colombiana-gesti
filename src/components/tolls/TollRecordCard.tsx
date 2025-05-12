
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MapPin, Calendar, Truck, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TollRecord, Toll, Trip, Vehicle } from '@/types';
import { Badge } from '@/components/ui/badge';

interface TollRecordCardProps {
  record: TollRecord;
  toll?: Toll;
  trip?: Trip;
  vehicle?: Vehicle;
  onEdit: (record: TollRecord) => void;
  onDelete: (recordId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount);
};

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'efectivo': return 'Efectivo';
    case 'electrónico': return 'Electrónico';
    case 'tag': return 'Tag / Telepeaje';
    default: return 'Otro';
  }
};

const TollRecordCard = ({ 
  record, 
  toll, 
  trip, 
  vehicle, 
  onEdit, 
  onDelete 
}: TollRecordCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="font-medium">{toll?.name || "Peaje"}</div>
          <Badge className="bg-emerald-500">
            {formatCurrency(record.price)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {format(new Date(record.date), "d 'de' MMMM, yyyy", { locale: es })}
          </span>
        </div>
        
        {toll && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm">{toll.location}</p>
              <p className="text-xs text-muted-foreground">{toll.route}</p>
            </div>
          </div>
        )}
        
        {(trip || vehicle) && (
          <div className="flex items-start gap-2">
            <Truck className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              {trip && (
                <p className="text-sm">{trip.origin} → {trip.destination}</p>
              )}
              {vehicle && (
                <p className="text-xs text-muted-foreground">{vehicle.plate} - {vehicle.brand} {vehicle.model}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {getPaymentMethodLabel(record.paymentMethod)}
            {record.receipt && ` - Recibo: ${record.receipt}`}
          </span>
        </div>
        
        {record.notes && (
          <p className="text-sm text-muted-foreground pt-1">{record.notes}</p>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(record)}
        >
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(record.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TollRecordCard;
