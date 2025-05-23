
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import { Toll } from '@/types';
import { Badge } from '@/components/ui/badge';

interface TollCardProps {
  toll: Toll;
  onEdit: (toll: Toll) => void;
  onDelete: (tollId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount);
};

const TollCard = ({ toll, onEdit, onDelete }: TollCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg break-words mr-2">{toll.name}</CardTitle>
          <Badge className="bg-emerald-500 shrink-0">{toll.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="break-words">
            <p className="text-sm font-medium">{toll.location}</p>
            <p className="text-xs text-muted-foreground">{toll.route}</p>
            {toll.coordinates && (
              <p className="text-xs text-muted-foreground">
                Coord: {toll.coordinates}
              </p>
            )}
          </div>
        </div>
        
        <div className="pt-1">
          <p className="text-lg font-semibold currency-cop">
            {formatCurrency(toll.price)}
          </p>
          {toll.description && (
            <p className="text-sm text-muted-foreground mt-1 break-words">{toll.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(toll)}
          className="flex-1 sm:flex-none"
        >
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(toll.id)}
          className="flex-1 sm:flex-none"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TollCard;
