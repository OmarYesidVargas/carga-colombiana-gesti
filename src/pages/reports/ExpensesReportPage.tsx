import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { ExpenseCategory } from '@/types';
import ExpensesChart from '@/components/reports/ExpensesChart';
import ExpenseSummary from '@/components/reports/ExpenseSummary';
import MonthlyExpenseChart from '@/components/reports/MonthlyExpenseChart';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Categorías de gastos con etiquetas en español
const expenseCategories = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'fuel', label: 'Combustible' },
  { value: 'toll', label: 'Peaje' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'lodging', label: 'Alojamiento' },
  { value: 'food', label: 'Comida' },
  { value: 'other', label: 'Otros' },
];

const ExpensesReportPage = () => {
  const { vehicles, trips, expenses } = useData();
  
  // Estados para filtros
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });
  
  // Formatear moneda colombiana
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Filtrar gastos según los criterios seleccionados
  const filteredExpenses = expenses.filter(expense => {
    // Filtrar por vehículo
    const matchesVehicle = 
      vehicleFilter === 'all' || expense.vehicleId === vehicleFilter;
    
    // Filtrar por categoría
    const matchesCategory = 
      categoryFilter === 'all' || expense.category === categoryFilter as ExpenseCategory;
    
    // Filtrar por rango de fechas
    const expenseDate = new Date(expense.date);
    const matchesDateRange = 
      (!dateRange?.from || expenseDate >= dateRange.from) &&
      (!dateRange?.to || expenseDate <= dateRange.to);
    
    return matchesVehicle && matchesCategory && matchesDateRange;
  });
  
  // Calcular el total de gastos
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Función para simular la exportación de datos
  const handleExportData = () => {
    toast.success('Reporte exportado exitosamente a tu dispositivo');
    // En una implementación real, aquí se generaría un archivo CSV o PDF
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reporte de Gastos</h1>
          <p className="text-muted-foreground">
            Visualiza y analiza los gastos de tus viajes
          </p>
        </div>
        
        <Button onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Datos
        </Button>
      </div>
      
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Vehículo
              </label>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vehículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vehículos</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} - {vehicle.brand} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Categoría
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Rango de fechas
              </label>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "P", { locale: es })} -{" "}
                            {format(dateRange.to, "P", { locale: es })}
                          </>
                        ) : (
                          format(dateRange.from, "P", { locale: es })
                        )
                      ) : (
                        <span>Seleccionar fechas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      locale={es}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          {/* Chips con los filtros activos */}
          <div className="flex flex-wrap gap-2">
            {vehicleFilter !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setVehicleFilter('all')}>
                {vehicles.find(v => v.id === vehicleFilter)?.plate || vehicleFilter}
                <span className="ml-1">×</span>
              </Badge>
            )}
            
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategoryFilter('all')}>
                {expenseCategories.find(c => c.value === categoryFilter)?.label || categoryFilter}
                <span className="ml-1">×</span>
              </Badge>
            )}
            
            {dateRange && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setDateRange(undefined)}>
                {dateRange.from && format(dateRange.from, "dd/MM/yyyy", { locale: es })}
                {dateRange.to && ` - ${format(dateRange.to, "dd/MM/yyyy", { locale: es })}`}
                <span className="ml-1">×</span>
              </Badge>
            )}
            
            {(vehicleFilter !== 'all' || categoryFilter !== 'all' || dateRange) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setVehicleFilter('all');
                  setCategoryFilter('all');
                  setDateRange(undefined);
                }}
                className="text-xs h-6"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Resultados */}
      {filteredExpenses.length > 0 ? (
        <div className="space-y-6">
          {/* Resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseSummary expenses={filteredExpenses} vehicles={vehicles} trips={trips} />
            <ExpensesChart expenses={filteredExpenses} />
          </div>
          
          {/* Gráfico de gastos mensuales */}
          <MonthlyExpenseChart expenses={filteredExpenses} />
          
          {/* Tabla de gastos */}
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
                    {filteredExpenses.map((expense) => {
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
                          <td className="py-3 px-4 text-right font-medium currency-cop">
                            {formatCurrency(expense.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-t-2">
                      <td className="py-3 px-4 font-semibold" colSpan={5}>Total</td>
                      <td className="py-3 px-4 text-right font-bold currency-cop">
                        {formatCurrency(totalExpenses)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No se encontraron gastos que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesReportPage;
