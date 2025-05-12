
import React from 'react';
import { Expense, Trip, Vehicle, expenseCategoryColors } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  trip?: Trip;
  vehicle?: Vehicle;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

// Función para formateador de moneda colombiana
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount);
};

// Mapeo de categorías a etiquetas en español
const categoryLabels: Record<string, string> = {
  fuel: 'Combustible',
  toll: 'Peaje',
  maintenance: 'Mantenimiento',
  lodging: 'Alojamiento',
  food: 'Comida',
  other: 'Otros',
};

const ExpenseCard = ({ expense, trip, vehicle, onEdit, onDelete }: ExpenseCardProps) => {
  // Obtener el color basado en la categoría
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
              <h3 className="text-xl font-semibold currency-cop">
                {formatCurrency(expense.amount).replace('COP', '').trim()}
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
            <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(expense.id)}>
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
