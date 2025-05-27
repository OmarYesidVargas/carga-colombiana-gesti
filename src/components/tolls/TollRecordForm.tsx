
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tripId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Viaje *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!!selectedTripId || isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar viaje" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {validTrips.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No hay viajes disponibles
                    </div>
                  ) : (
                    validTrips.map((trip) => {
                      const vehicle = getTripVehicle(trip.id);
                      return (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.origin} → {trip.destination} 
                          {vehicle && ` (${vehicle.plate})`}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tollId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peaje *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar peaje" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tolls.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No hay peajes disponibles
                    </div>
                  ) : (
                    tolls.map((toll) => (
                      <SelectItem key={toll.id} value={toll.id}>
                        {toll.name} - {toll.route} (${toll.price})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
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
                      onSelect={field.onChange}
                      initialFocus
                      locale={es}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (COP) *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      className="pl-8"
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pago *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="receipt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recibo/Factura (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Número de recibo o factura"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Información adicional sobre el paso por el peaje"
                  className="h-20"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || validTrips.length === 0 || tolls.length === 0}
          >
            {isSubmitting ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Registrar')} Paso por Peaje
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TollRecordForm;
