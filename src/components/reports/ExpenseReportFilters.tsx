
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
 * Componente de filtros completamente responsivo con diseño mobile-first
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
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg md:text-xl">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
        {/* Grid adaptativo mejorado - Mobile-first */}
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {/* Filtro de vehículos */}
          <div className="space-y-2 xs:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm font-medium block">
              Vehículo
            </label>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full h-8 sm:h-9 text-sm">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los vehículos</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <span className="truncate max-w-[200px]">
                      {vehicle.plate} - {vehicle.brand} {vehicle.model}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Filtro de categorías */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium block">
              Categoría
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full h-8 sm:h-9 text-sm">
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
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium block">
              Rango de fechas
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-8 sm:h-9 text-sm",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
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
                      <span className="text-xs sm:text-sm">Seleccionar fechas</span>
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
        
        {/* Chips con filtros activos - Diseño mobile-first mejorado */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {vehicleFilter !== 'all' && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer text-xs px-2 py-1 h-auto" 
              onClick={() => setVehicleFilter('all')}
            >
              <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px]">
                {vehicles.find(v => v.id === vehicleFilter)?.plate || vehicleFilter}
              </span>
              <span className="ml-1 text-xs">×</span>
            </Badge>
          )}
          
          {categoryFilter !== 'all' && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer text-xs px-2 py-1 h-auto" 
              onClick={() => setCategoryFilter('all')}
            >
              <span className="truncate max-w-[100px]">
                {expenseCategories.find(c => c.value === categoryFilter)?.label || categoryFilter}
              </span>
              <span className="ml-1 text-xs">×</span>
            </Badge>
          )}
          
          {dateRange && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer text-xs px-2 py-1 h-auto" 
              onClick={() => setDateRange(undefined)}
            >
              <span className="truncate max-w-[80px] xs:max-w-[120px]">
                {dateRange.from && format(dateRange.from, "dd/MM/yy", { locale: es })}
                {dateRange.to && ` - ${format(dateRange.to, "dd/MM/yy", { locale: es })}`}
              </span>
              <span className="ml-1 text-xs">×</span>
            </Badge>
          )}
          
          {/* Botón para limpiar todos los filtros */}
          {(vehicleFilter !== 'all' || categoryFilter !== 'all' || dateRange) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs h-6 px-2 ml-1"
            >
              Limpiar todo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseReportFilters;
