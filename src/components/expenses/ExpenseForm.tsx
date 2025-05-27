
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
import { Expense, ExpenseCategory, Trip, Vehicle } from '@/types';
import { DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Categorías de gastos
const expenseCategories = [
  { value: 'fuel', label: 'Combustible' },
  { value: 'toll', label: 'Peaje' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'lodging', label: 'Alojamiento' },
  { value: 'food', label: 'Comida' },
  { value: 'other', label: 'Otros' },
];

// Esquema de validación mejorado
const formSchema = z.object({
  tripId: z.string().min(1, 'Debe seleccionar un viaje'),
  category: z.string().refine(
    (val) => ['fuel', 'toll', 'maintenance', 'lodging', 'food', 'other'].includes(val),
    { message: 'Debe seleccionar una categoría válida' }
  ),
  date: z.date({
    required_error: 'La fecha es requerida',
  }),
  amount: z.string()
    .min(1, 'El monto es requerido')
    .refine(
      (val) => !isNaN(Number(val)),
      { message: 'El monto debe ser un número válido' }
    )
    .refine(
      (val) => Number(val) > 0,
      { message: 'El monto debe ser mayor a 0' }
    ),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  trips: Trip[];
  vehicles: Vehicle[];
  selectedTripId?: string;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ExpenseForm = ({ 
  initialData, 
  trips, 
  vehicles, 
  selectedTripId, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: ExpenseFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripId: selectedTripId || initialData?.tripId || '',
      category: initialData?.category || 'fuel',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      amount: initialData?.amount ? String(initialData.amount) : '',
      description: initialData?.description || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    try {
      console.log('📝 [ExpenseForm] Enviando datos del formulario:', data);
      
      // Validar que el viaje existe
      const selectedTrip = trips.find(trip => trip.id === data.tripId);
      if (!selectedTrip) {
        form.setError('tripId', { message: 'El viaje seleccionado no es válido' });
        return;
      }

      // Validar que el vehículo del viaje existe
      const selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedTrip.vehicleId);
      if (!selectedVehicle) {
        form.setError('tripId', { message: 'El vehículo del viaje seleccionado no es válido' });
        return;
      }

      // Validar monto
      const amount = Number(data.amount);
      if (isNaN(amount) || amount <= 0) {
        form.setError('amount', { message: 'El monto debe ser un número válido mayor a 0' });
        return;
      }

      console.log('✅ [ExpenseForm] Validaciones pasadas, enviando datos');
      onSubmit(data);
    } catch (error) {
      console.error('❌ [ExpenseForm] Error en validación del formulario:', error);
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
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
        </div>
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto (COP) *</FormLabel>
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
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Detalles adicionales sobre el gasto"
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
            disabled={isSubmitting || validTrips.length === 0}
          >
            {isSubmitting ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Registrar')} Gasto
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ExpenseForm;
