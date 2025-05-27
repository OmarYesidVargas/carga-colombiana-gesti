
import React from 'react';
import { Expense, Trip, Vehicle, expenseCategoryColors } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash, MapPin, Car } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseCardProps {
  expense: Expense;
  trip?: Trip;
  vehicle?: Vehicle;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

/**
 * Mapeo de categorías a etiquetas en español
 * Proporciona traducciones legibles para las categorías de gastos
 */
const categoryLabels: Record<string, string> = {
  fuel: 'Combustible',
  toll: 'Peaje',
  maintenance: 'Mantenimiento',
  lodging: 'Alojamiento',
  food: 'Comida',
  other: 'Otros',
};

/**
 * Componente de tarjeta para mostrar información de un gasto
 * Incluye detalles del gasto, categoría, fecha y acciones de edición/eliminación
 */
const ExpenseCard = ({ expense, trip, vehicle, onEdit, onDelete }: ExpenseCardProps) => {
  /**
   * Obtiene los estilos de color basados en la categoría del gasto
   * @param category - Categoría del gasto
   * @returns Objeto con estilos de color para background, border y text
   */
  const getCategoryColor = (category: string) => {
    return {
      backgroundColor: `${expenseCategoryColors[category as keyof typeof expenseCategoryColors]}15`,
      borderColor: expenseCategoryColors[category as keyof typeof expenseCategoryColors],
      color: expenseCategoryColors[category as keyof typeof expenseCategoryColors]
    };
  };

  return (
    <Card className="group h-full bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-violet-300 hover:-translate-y-1">
      <CardHeader className="pb-3 space-y-3" style={{ backgroundColor: `${expenseCategoryColors[expense.category]}08` }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                style={getCategoryColor(expense.category)}
                className="text-xs font-medium"
              >
                {categoryLabels[expense.category]}
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
              {formatCurrency(expense.amount)}
            </h3>
          </div>
          
          <div className="flex gap-1 sm:gap-2 self-start">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(expense)} 
              title="Editar gasto"
              className="h-8 w-8 p-0 hover:bg-violet-100 hover:text-violet-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700" 
              onClick={() => onDelete(expense.id)}
              title="Eliminar gasto"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-6 space-y-4">
        {/* Información del viaje y vehículo */}
        {trip && (
          <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100">
            <MapPin className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {trip.origin} → {trip.destination}
              </p>
              {vehicle && (
                <div className="flex items-center gap-1 mt-1">
                  <Car className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600 vehicle-plate">
                    {vehicle.plate} - {vehicle.brand} {vehicle.model}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Fecha */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
            <Calendar className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {format(new Date(expense.date), 'PPP', { locale: es })}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(expense.date), 'EEEE', { locale: es })}
            </p>
          </div>
        </div>
        
        {/* Descripción */}
        {expense.description && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 italic line-clamp-2 leading-relaxed">
              "{expense.description}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
