
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Expense, Trip, Vehicle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { expenseCategories } from './ExpenseReportFilters';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseReportTableProps {
  expenses: Expense[];
  vehicles: Vehicle[];
  trips: Trip[];
  totalExpenses: number;
}

/**
 * Componente de tabla responsivo para mostrar el detalle de gastos en reportes
 * Se adapta a diferentes tamaños de pantalla mostrando información compacta en móvil
 */
const ExpenseReportTable: React.FC<ExpenseReportTableProps> = ({
  expenses,
  vehicles,
  trips,
  totalExpenses
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Detalles de Gastos</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* Vista de tabla para pantallas grandes */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left text-sm font-medium">Fecha</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Categoría</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Vehículo</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Viaje</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Descripción</th>
                <th className="py-3 px-4 text-right text-sm font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const vehicle = vehicles.find(v => v.id === expense.vehicleId);
                const trip = trips.find(t => t.id === expense.tripId);
                
                return (
                  <tr key={expense.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(expense.date), "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-normal text-xs">
                        {expenseCategories.find(c => c.value === expense.category)?.label || expense.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 vehicle-plate text-sm">
                      {vehicle?.plate || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {trip ? `${trip.origin} → ${trip.destination}` : '-'}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-sm">
                      {expense.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-sm">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td className="py-3 px-4 font-semibold text-sm" colSpan={5}>Total</td>
                <td className="py-3 px-4 text-right font-bold text-sm">
                  {formatCurrency(totalExpenses)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Vista de tarjetas para móvil y tablet */}
        <div className="md:hidden space-y-3">
          {expenses.map((expense) => {
            const vehicle = vehicles.find(v => v.id === expense.vehicleId);
            const trip = trips.find(t => t.id === expense.tripId);
            
            return (
              <div key={expense.id} className="border rounded-lg p-4 bg-card">
                {/* Header de la tarjeta con fecha y monto */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(expense.date), "dd/MM/yyyy", { locale: es })}
                    </span>
                    <Badge variant="outline" className="font-normal text-xs w-fit mt-1">
                      {expenseCategories.find(c => c.value === expense.category)?.label || expense.category}
                    </Badge>
                  </div>
                  <span className="font-bold text-lg">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                {/* Información adicional */}
                <div className="space-y-2 text-sm">
                  {vehicle && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehículo:</span>
                      <span className="vehicle-plate">{vehicle.plate}</span>
                    </div>
                  )}
                  
                  {trip && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Viaje:</span>
                      <span className="truncate max-w-[150px]">
                        {trip.origin} → {trip.destination}
                      </span>
                    </div>
                  )}
                  
                  {expense.description && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Descripción:</span>
                      <span className="text-sm mt-1">{expense.description}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Total para vista móvil */}
          <div className="border-t-2 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-xl">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseReportTable;
