
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
 * Componente de tabla completamente responsivo con diseño mobile-first
 * Usa grid adaptativo y cards para móvil, tabla para desktop
 */
const ExpenseReportTable: React.FC<ExpenseReportTableProps> = ({
  expenses,
  vehicles,
  trips,
  totalExpenses
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl">Detalles de Gastos</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {/* Vista móvil: Grid de cards responsivo */}
        <div className="block lg:hidden">
          <div className="grid gap-3 sm:gap-4">
            {expenses.map((expense) => {
              const vehicle = vehicles.find(v => v.id === expense.vehicleId);
              const trip = trips.find(t => t.id === expense.tripId);
              
              return (
                <div key={expense.id} className="border rounded-lg p-3 sm:p-4 bg-card shadow-sm">
                  {/* Header móvil con fecha y monto */}
                  <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 mb-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {format(new Date(expense.date), "dd/MM/yyyy", { locale: es })}
                      </span>
                      <Badge variant="outline" className="text-xs w-fit">
                        {expenseCategories.find(c => c.value === expense.category)?.label || expense.category}
                      </Badge>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-primary">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>

                  {/* Grid de información responsivo */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    {vehicle && (
                      <div className="flex flex-col xs:flex-row xs:justify-between">
                        <span className="text-muted-foreground">Vehículo:</span>
                        <span className="vehicle-plate font-medium">{vehicle.plate}</span>
                      </div>
                    )}
                    
                    {trip && (
                      <div className="flex flex-col xs:col-span-2">
                        <span className="text-muted-foreground">Viaje:</span>
                        <span className="text-xs sm:text-sm truncate mt-1">
                          {trip.origin} → {trip.destination}
                        </span>
                      </div>
                    )}
                    
                    {expense.description && (
                      <div className="xs:col-span-2 flex flex-col">
                        <span className="text-muted-foreground">Descripción:</span>
                        <span className="text-xs sm:text-sm mt-1 break-words">
                          {expense.description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total móvil */}
          <div className="border-t-2 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base sm:text-lg">Total</span>
              <span className="font-bold text-lg sm:text-xl text-primary">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>
        </div>

        {/* Vista desktop: Tabla tradicional */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left text-sm font-medium">Fecha</th>
                  <th className="py-3 px-2 text-left text-sm font-medium">Categoría</th>
                  <th className="py-3 px-2 text-left text-sm font-medium">Vehículo</th>
                  <th className="py-3 px-2 text-left text-sm font-medium">Viaje</th>
                  <th className="py-3 px-2 text-left text-sm font-medium">Descripción</th>
                  <th className="py-3 px-2 text-right text-sm font-medium">Monto</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const vehicle = vehicles.find(v => v.id === expense.vehicleId);
                  const trip = trips.find(t => t.id === expense.tripId);
                  
                  return (
                    <tr key={expense.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 text-sm">
                        {format(new Date(expense.date), "dd/MM/yyyy", { locale: es })}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">
                          {expenseCategories.find(c => c.value === expense.category)?.label || expense.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 vehicle-plate text-sm">
                        {vehicle?.plate || '-'}
                      </td>
                      <td className="py-3 px-2 text-sm max-w-[150px] truncate">
                        {trip ? `${trip.origin} → ${trip.destination}` : '-'}
                      </td>
                      <td className="py-3 px-2 max-w-[200px] truncate text-sm">
                        {expense.description || '-'}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-sm">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="py-3 px-2 font-semibold text-sm" colSpan={5}>Total</td>
                  <td className="py-3 px-2 text-right font-bold text-sm">
                    {formatCurrency(totalExpenses)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseReportTable;
