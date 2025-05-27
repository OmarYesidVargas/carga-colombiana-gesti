
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
    <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg break-words mr-2 text-gray-900">{toll.name}</CardTitle>
          <Badge className="bg-blue-500 text-white hover:bg-blue-600 shrink-0">{toll.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
          <div className="break-words flex-1">
            <p className="text-sm font-medium text-gray-900">{toll.location}</p>
            <p className="text-xs text-gray-600">{toll.route}</p>
            {toll.coordinates && (
              <p className="text-xs text-gray-500">
                Coord: {toll.coordinates}
              </p>
            )}
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(toll.price)}
          </p>
          {toll.description && (
            <p className="text-sm text-gray-600 mt-2 break-words">{toll.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2 flex-wrap bg-gray-50 border-t border-gray-100">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(toll)}
          className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(toll.id)}
          className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TollCard;
