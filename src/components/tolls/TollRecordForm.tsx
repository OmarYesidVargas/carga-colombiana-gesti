
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toll, TollRecord, Trip, Vehicle } from '@/types';

// Métodos de pago
const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'electrónico', label: 'Pago electrónico' },
  { value: 'tag', label: 'Tag / Telepeaje' },
  { value: 'otro', label: 'Otro' },
];

// Esquema de validación mejorado
const formSchema = z.object({
  tripId: z.string().min(1, { message: 'Debe seleccionar un viaje' }),
  tollId: z.string().min(1, { message: 'Debe seleccionar un peaje' }),
  date: z.date({ required_error: 'La fecha es requerida' }),
  price: z.string()
    .min(1, { message: 'El precio es requerido' })
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      { message: 'El precio debe ser un número mayor a 0' }
    ),
  paymentMethod: z.string().min(1, { message: 'Debe seleccionar un método de pago' }),
  receipt: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TollRecordFormProps {
  initialData?: Partial<TollRecord>;
  trips: Trip[];
  tolls: Toll[];
  vehicles: Vehicle[];
  selectedTripId?: string;
  onSubmit: (data: FormData & { vehicleId: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TollRecordForm = ({
  initialData,
  trips,
  tolls,
  vehicles,
  selectedTripId,
  onSubmit,
  onCancel,
  isSubmitting = false
}: TollRecordFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripId: selectedTripId || initialData?.tripId || '',
      tollId: initialData?.tollId || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      price: initialData?.price ? String(initialData.price) : '',
      paymentMethod: initialData?.paymentMethod || 'efectivo',
      receipt: initialData?.receipt || '',
      notes: initialData?.notes || '',
    },
  });

  // Auto-completar precio cuando se selecciona un peaje
  React.useEffect(() => {
    const tollId = form.watch('tollId');
    if (tollId && !initialData?.price) {
      const selectedToll = tolls.find(t => t.id === tollId);
      if (selectedToll && !form.getValues('price')) {
        form.setValue('price', String(selectedToll.price));
      }
    }
  }, [form.watch('tollId'), tolls, form, initialData?.price]);

  const handleSubmit = (data: FormData) => {
    try {
      // Validar que el viaje existe
      const selectedTrip = trips.find(trip => trip.id === data.tripId);
      if (!selectedTrip) {
        form.setError('tripId', { message: 'El viaje seleccionado no es válido' });
        return;
      }

      // Validar que el peaje existe
      const selectedToll = tolls.find(toll => toll.id === data.tollId);
      if (!selectedToll) {
        form.setError('tollId', { message: 'El peaje seleccionado no es válido' });
        return;
      }

      // Validar que el vehículo del viaje existe
      if (!selectedTrip.vehicleId) {
        form.setError('tripId', { message: 'El viaje no tiene un vehículo asignado' });
        return;
      }

      const selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedTrip.vehicleId);
      if (!selectedVehicle) {
        form.setError('tripId', { message: 'El vehículo del viaje seleccionado no es válido' });
        return;
      }

      // Enviar datos validados
      onSubmit({
        ...data,
        vehicleId: selectedTrip.vehicleId,
      });
    } catch (error) {
      console.error('Error en validación del formulario:', error);
    }
  };

  // Encontrar vehículos para los viajes
  const getTripVehicle = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return null;
    return vehicles.find(v => v.id === trip.vehicleId);
  };

  // Filtrar viajes válidos (que tengan vehículo asignado)
  const validTrips = trips.filter(trip => {
    const vehicle = getTripVehicle(trip.id);
    return vehicle !== null;
  });

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-2 sm:pr-4">
            <div className="space-y-3 sm:space-y-4 p-1">
              {/* Información del viaje */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Información del Viaje
                </h3>
                
                <FormField
                  control={form.control}
                  name="tripId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Viaje *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!!selectedTripId || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 sm:h-10 text-sm">
                            <SelectValue placeholder="Seleccionar viaje" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-50">
                          {validTrips.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              No hay viajes disponibles
                            </div>
                          ) : (
                            validTrips.map((trip) => {
                              const vehicle = getTripVehicle(trip.id);
                              return (
                                <SelectItem key={trip.id} value={trip.id} className="text-sm">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {trip.origin} → {trip.destination}
                                    </span>
                                    {vehicle && (
                                      <span className="text-xs text-muted-foreground">
                                        {vehicle.plate} - {vehicle.brand} {vehicle.model}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Información del peaje */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Información del Peaje
                </h3>
                
                <FormField
                  control={form.control}
                  name="tollId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Peaje *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 sm:h-10 text-sm">
                            <SelectValue placeholder="Seleccionar peaje" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-50">
                          {tolls.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              No hay peajes disponibles
                            </div>
                          ) : (
                            tolls.map((toll) => (
                              <SelectItem key={toll.id} value={toll.id} className="text-sm">
                                <div className="flex flex-col">
                                  <span className="font-medium">{toll.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {toll.route} - ${toll.price.toLocaleString()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Información del pago */}
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
              
              {/* Notas adicionales */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Notas (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Información adicional sobre el paso por el peaje"
                        className="h-16 sm:h-20 resize-none text-sm"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4 pt-3 sm:pt-4 border-t flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || validTrips.length === 0 || tolls.length === 0}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm order-1 sm:order-2"
            >
              {isSubmitting ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Registrar')} Paso por Peaje
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default TollRecordForm;
