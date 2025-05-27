
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
      return 'bg-emerald-500 hover:bg-emerald-600 text-white';
    case 'pesado':
      return 'bg-orange-500 hover:bg-orange-600 text-white';
    case 'motocicleta':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'especial':
      return 'bg-purple-500 hover:bg-purple-600 text-white';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

const TollCard = ({ toll, onEdit, onDelete }: TollCardProps) => {
  return (
    <Card className="group h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-violet-300 hover:-translate-y-1">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-violet-700 transition-colors line-clamp-2 flex-1 min-w-0">
            {toll.name}
          </CardTitle>
          <Badge className={`shrink-0 ${getCategoryColor(toll.category)} font-medium text-xs px-2 py-1`}>
            {toll.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-4">
        {/* Ubicación */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-violet-50 rounded-lg border border-violet-100 group-hover:bg-violet-100 transition-colors">
            <MapPin className="h-4 w-4 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{toll.location}</p>
            <div className="flex items-center gap-1 mt-1">
              <Route className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-600 truncate">{toll.route}</p>
            </div>
            {toll.coordinates && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                📍 {toll.coordinates}
              </p>
            )}
          </div>
        </div>
        
        {/* Precio */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {formatCurrency(toll.price)}
            </p>
            <p className="text-xs text-gray-500">Tarifa oficial</p>
          </div>
        </div>
        
        {/* Descripción */}
        {toll.description && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {toll.description}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col sm:flex-row gap-2 bg-gradient-to-r from-gray-50 to-violet-50 border-t border-gray-100 rounded-b-lg">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(toll)}
          className="flex-1 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
        >
          <Pencil className="h-4 w-4 mr-1" /> 
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(toll.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 transition-all duration-200"
        >
          <Trash2 className="h-4 w-4 mr-1" /> 
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TollCard;
