
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

// Categorías de gastos con etiquetas traducidas al español
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

/**
 * Componente de filtros responsivo para reportes de gastos
 * Se adapta automáticamente a dispositivos móviles y desktop
 */
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
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid responsivo de filtros - 1 columna en móvil, 2 en tablet, 3 en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Filtro de vehículos */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Vehículo
            </label>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los vehículos</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <span className="truncate">
                      {vehicle.plate} - {vehicle.brand} {vehicle.model}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Filtro de categorías */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Categoría
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
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
          
          {/* Filtro de rango de fechas */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-medium block">
              Rango de fechas
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yy", { locale: es })} -{" "}
                          {format(dateRange.to, "dd/MM/yy", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: es })
                      )
                    ) : (
                      <span>Seleccionar fechas</span>
                    )}
                  </span>
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
        
        {/* Chips con los filtros activos - Se apilan en móvil */}
        <div className="flex flex-wrap gap-2">
          {vehicleFilter !== 'all' && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer text-xs" 
              onClick={() => setVehicleFilter('all')}
            >
              <span className="truncate max-w-[100px] sm:max-w-[150px]">
                {vehicles.find(v => v.id === vehicleFilter)?.plate || vehicleFilter}
              </span>
              <span className="ml-1">×</span>
            </Badge>
          )}
          
          {categoryFilter !== 'all' && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer text-xs" 
              onClick={() => setCategoryFilter('all')}
            >
              {expenseCategories.find(c => c.value === categoryFilter)?.label || categoryFilter}
              <span className="ml-1">×</span>
            </Badge>
          )}
          
          {dateRange && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer text-xs" 
              onClick={() => setDateRange(undefined)}
            >
              <span className="truncate max-w-[120px]">
                {dateRange.from && format(dateRange.from, "dd/MM/yy", { locale: es })}
                {dateRange.to && ` - ${format(dateRange.to, "dd/MM/yy", { locale: es })}`}
              </span>
              <span className="ml-1">×</span>
            </Badge>
          )}
          
          {/* Botón para limpiar todos los filtros */}
          {(vehicleFilter !== 'all' || categoryFilter !== 'all' || dateRange) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs h-6 px-2"
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
