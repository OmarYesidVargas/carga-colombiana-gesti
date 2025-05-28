/**
 * TollCard Component
 * 
 * Componente para mostrar la información de un peaje
 * incluyendo su ubicación, tarifa y opciones de gestión.
 * 
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:37:08
 */

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MapPin, DollarSign, LocateFixed } from 'lucide-react';
import { Toll } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface TollCardProps {
  toll: Toll;
  onEdit?: (toll: Toll) => void;
  onDelete?: (toll: Toll) => void;
  className?: string;
}

/**
 * Componente TollCard
 * Muestra la información de un peaje en una tarjeta
 * 
 * @param {TollCardProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente TollCard
 */
export const TollCard: React.FC<TollCardProps> = ({
  toll,
  onEdit,
  onDelete,
  className = '',
}) => {
  const {
    nombre,
    ubicacion,
    tarifa,
    categoria,
    estado,
    coordenadas,
  } = toll;

  /**
   * Determina el color del badge según el estado del peaje
   */
  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'activo': 'bg-green-500',
      'inactivo': 'bg-red-500',
      'mantenimiento': 'bg-yellow-500',
      'construccion': 'bg-blue-500',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-500';
  };

  /**
   * Formatea las coordenadas para mostrar
   */
  const formatCoordinates = (coords: { lat: number; lng: number }): string => {
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{nombre}</CardTitle>
          <Badge 
            variant="secondary"
            className={`${getStatusColor(estado)} text-white`}
          >
            {estado}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ubicación */}
        <div className="flex items-start space-x-2">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Ubicación</p>
            <p className="text-sm font-medium">{ubicacion}</p>
            {coordenadas && (
              <p className="text-xs text-muted-foreground">
                <LocateFixed className="h-3 w-3 inline mr-1" />
                {formatCoordinates(coordenadas)}
              </p>
            )}
          </div>
        </div>

        {/* Tarifa y Categoría */}
        <div className="flex items-start space-x-2">
          <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tarifa</p>
            <p className="text-sm font-medium">
              {formatCurrency(tarifa)}
              <span className="ml-2 text-xs text-muted-foreground">
                Categoría {categoria}
              </span>
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end space-x-2 pt-4">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(toll)}
            className="h-8"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(toll)}
            className="h-8"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TollCard;
