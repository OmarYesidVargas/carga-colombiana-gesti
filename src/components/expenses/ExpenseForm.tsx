
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

// Esquema de validación para el formulario
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
    .refine(
      (val) => !isNaN(Number(val)),
      { message: 'El monto debe ser un número' }
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
    onSubmit({
      ...data,
      amount: data.amount,
    });
  };

  // Filtrar viajes por vehículo (si es necesario)
  const filteredTrips = trips;

  // Encontrar vehículos para los viajes
  const getTripVehicle = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return null;
    return vehicles.find(v => v.id === trip.vehicleId);
  };

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
                disabled={!!selectedTripId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar viaje" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredTrips.map((trip) => {
                    const vehicle = getTripVehicle(trip.id);
                    return (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.origin} → {trip.destination} 
                        {vehicle && ` (${vehicle.plate})`}
                      </SelectItem>
                    );
                  })}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      className={cn("p-3 pointer-events-auto")}
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
                    step="1000"
                    placeholder="0"
                    className="pl-8"
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
            disabled={isSubmitting}
          >
            {initialData?.id ? 'Actualizar' : 'Registrar'} Gasto
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ExpenseForm;
