
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface TripDateFieldsProps {
  form: UseFormReturn<any>;
}

/**
 * Componente optimizado para campos de fecha con validación corregida
 * Permite seleccionar fechas desde 30 días atrás hasta hoy (incluido) para fecha de inicio
 * Y hasta 1 año en el futuro para fecha de fin
 */
const TripDateFields = ({ form }: TripDateFieldsProps) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  React.useEffect(() => {
    console.log('Date fields initialized', {
      today: today.toISOString(),
      thirtyDaysAgo: thirtyDaysAgo.toISOString(),
      oneYearFromNow: oneYearFromNow.toISOString()
    });
  }, []);

  const handleStartDateChange = (date: Date | undefined, onChange: (date: Date | undefined) => void) => {
    console.log('Start date changed', { newDate: date?.toISOString() });
    onChange(date);
    
    // Si la fecha de fin es anterior a la nueva fecha de inicio, limpiarla
    const endDate = form.getValues('endDate');
    if (date && endDate && endDate < date) {
      console.log('Clearing end date because it\'s before new start date');
      form.setValue('endDate', undefined);
    }
  };

  const handleEndDateChange = (date: Date | undefined, onChange: (date: Date | undefined) => void) => {
    console.log('End date changed', { newDate: date?.toISOString() });
    onChange(date);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-sm">Fecha de inicio *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal h-9",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => handleStartDateChange(date, field.onChange)}
                  disabled={(date) => {
                    // Normalizar fechas para comparar solo el día (sin horas)
                    const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const thirtyDaysAgoNormalized = new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate());
                    
                    // Permitir desde hace 30 días hasta HOY (incluido)
                    return dateToCheck < thirtyDaysAgoNormalized || dateToCheck > todayNormalized;
                  }}
                  initialFocus
                  locale={es}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-sm">Fecha de fin</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal h-9",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? field.value : undefined}
                  onSelect={(date) => handleEndDateChange(date, field.onChange)}
                  disabled={(date) => {
                    const startDate = form.getValues('startDate');
                    
                    // Normalizar fechas para comparar solo el día
                    const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    const oneYearFromNowNormalized = new Date(oneYearFromNow.getFullYear(), oneYearFromNow.getMonth(), oneYearFromNow.getDate());
                    
                    if (startDate) {
                      const startDateNormalized = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                      
                      // La fecha de fin debe ser posterior o igual a la fecha de inicio
                      return dateToCheck < startDateNormalized || dateToCheck > oneYearFromNowNormalized;
                    }
                    
                    // Si no hay fecha de inicio, permitir desde hoy hasta 1 año en el futuro
                    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    
                    return dateToCheck < todayNormalized || dateToCheck > oneYearFromNowNormalized;
                  }}
                  initialFocus
                  locale={es}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TripDateFields;
