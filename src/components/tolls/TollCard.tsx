
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MapPin, DollarSign, Route } from 'lucide-react';
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

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'liviano':
      return 'bg-green-500 hover:bg-green-600';
    case 'pesado':
      return 'bg-orange-500 hover:bg-orange-600';
    case 'motocicleta':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'especial':
      return 'bg-purple-500 hover:bg-purple-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const TollCard = ({ toll, onEdit, onDelete }: TollCardProps) => {
  return (
    <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-violet-300">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold break-words mr-2 text-gray-900">
            {toll.name}
          </CardTitle>
          <Badge className={`text-white shrink-0 ${getCategoryColor(toll.category)}`}>
            {toll.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-4">
        {/* Ubicación */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <MapPin className="h-4 w-4 text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{toll.location}</p>
            <p className="text-sm text-gray-600">{toll.route}</p>
            {toll.coordinates && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {toll.coordinates}
              </p>
            )}
          </div>
        </div>
        
        {/* Precio */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(toll.price)}
            </p>
            <p className="text-xs text-gray-500">Tarifa oficial</p>
          </div>
        </div>
        
        {/* Descripción */}
        {toll.description && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600 break-words leading-relaxed">
              {toll.description}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-end gap-2 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(toll)}
          className="flex-1 sm:flex-none border-violet-300 text-violet-700 hover:bg-violet-50 hover:border-violet-400"
        >
          <Pencil className="h-4 w-4 mr-1" /> 
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(toll.id)}
          className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1" /> 
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TollCard;
