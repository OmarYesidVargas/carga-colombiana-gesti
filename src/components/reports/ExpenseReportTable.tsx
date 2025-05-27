
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
 * Componente de tabla para mostrar el detalle de gastos en reportes
 * Presenta información detallada de cada gasto con formato tabular
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
        <CardTitle>Detalles de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-left">Vehículo</th>
                <th className="py-3 px-4 text-left">Viaje</th>
                <th className="py-3 px-4 text-left">Descripción</th>
                <th className="py-3 px-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const vehicle = vehicles.find(v => v.id === expense.vehicleId);
                const trip = trips.find(t => t.id === expense.tripId);
                
                return (
                  <tr key={expense.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      {format(new Date(expense.date), "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-normal">
                        {expenseCategories.find(c => c.value === expense.category)?.label || expense.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 vehicle-plate">
                      {vehicle?.plate || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {trip ? `${trip.origin} → ${trip.destination}` : '-'}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">
                      {expense.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-t-2">
                <td className="py-3 px-4 font-semibold" colSpan={5}>Total</td>
                <td className="py-3 px-4 text-right font-bold">
                  {formatCurrency(totalExpenses)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseReportTable;
