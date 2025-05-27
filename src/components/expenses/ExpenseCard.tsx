
import React from 'react';
import { Expense, Trip, Vehicle, expenseCategoryColors } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash } from 'lucide-react';
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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2" style={{ backgroundColor: `${expenseCategoryColors[expense.category]}15` }}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                style={getCategoryColor(expense.category)}
              >
                {categoryLabels[expense.category]}
              </Badge>
              <h3 className="text-xl font-semibold">
                {formatCurrency(expense.amount)}
              </h3>
            </div>
            
            {trip && (
              <span className="text-xs text-muted-foreground">
                {trip.origin} → {trip.destination}
                {vehicle && ` • ${vehicle.plate}`}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(expense)} title="Editar gasto">
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive" 
              onClick={() => onDelete(expense.id)}
              title="Eliminar gasto"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(expense.date), 'PPP', { locale: es })}
            </span>
          </div>
          
          {expense.description && (
            <div className="text-sm text-muted-foreground">
              "{expense.description}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
