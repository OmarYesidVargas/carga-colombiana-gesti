
import React from 'react';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

// Categorías de gastos con etiquetas en español
export const expenseCategories = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'fuel', label: 'Combustible' },
  { value: 'toll', label: 'Peaje' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'lodging', label: 'Alojamiento' },
  { value: 'food', label: 'Comida' },
  { value: 'other', label: 'Otros' },
];

interface ExpenseReportFiltersProps {
  vehicles: Vehicle[];
  vehicleFilter: string;
  setVehicleFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  resetFilters: () => void;
}

const ExpenseReportFilters: React.FC<ExpenseReportFiltersProps> = ({
  vehicles,
  vehicleFilter,
  setVehicleFilter,
  categoryFilter,
  setCategoryFilter,
  dateRange,
  setDateRange,
  resetFilters
}) => {
  const isMobile = useMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    numberOfMonths={isMobile ? 1 : 2}
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
              onClick={resetFilters}
              className="text-xs h-6"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseReportFilters;
