
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FormData, paymentMethods } from './TollRecordFormValidation';

interface TollRecordPaymentSectionProps {
  form: UseFormReturn<FormData>;
  isSubmitting: boolean;
}

const TollRecordPaymentSection = ({
  form,
  isSubmitting
}: TollRecordPaymentSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
        Información del Pago
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-xs sm:text-sm">Fecha *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal h-9 sm:h-10 text-sm",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={es}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Precio (COP) *</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-gray-500">$</span>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="100"
                    placeholder="0"
                    className="pl-6 sm:pl-8 h-9 sm:h-10 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">Método de pago *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="z-50">
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value} className="text-sm">
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="receipt"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">Recibo/Factura (opcional)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Número de recibo o factura"
                className="h-9 sm:h-10 text-sm"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TollRecordPaymentSection;
