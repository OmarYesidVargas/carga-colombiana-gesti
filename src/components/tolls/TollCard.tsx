
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{toll.name}</CardTitle>
          <Badge className="bg-emerald-500">{toll.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div>
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
            <p className="text-sm text-muted-foreground mt-1">{toll.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(toll)}
        >
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(toll.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TollCard;
