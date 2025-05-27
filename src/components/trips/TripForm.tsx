
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
import { Trip, Vehicle } from '@/types';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import TripDateFields from './TripDateFields';

// Esquema de validación corregido para el formulario
const formSchema = z.object({
  vehicleId: z.string().min(1, 'Debe seleccionar un vehículo'),
  startDate: z.date({
    required_error: 'La fecha de inicio es requerida',
  }).refine((date) => {
    // Permitir desde hace 30 días hasta hoy
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const checkDate = new Date(date);
    checkDate.setHours(12, 0, 0, 0); // Mediodía para evitar problemas de timezone
    
    return checkDate >= thirtyDaysAgo && checkDate <= today;
  }, {
    message: "La fecha de inicio debe estar entre 30 días atrás y hoy"
  }),
  endDate: z.date().optional(),
  origin: z.string().min(3, 'El origen debe tener al menos 3 caracteres'),
  destination: z.string().min(3, 'El destino debe tener al menos 3 caracteres'),
  distance: z.string()
    .refine(
      (val) => !isNaN(Number(val)),
      { message: 'La distancia debe ser un número' }
    )
    .refine(
      (val) => Number(val) > 0,
      { message: 'La distancia debe ser mayor a 0' }
    ),
  notes: z.string().optional(),
})
.refine(
  (data) => {
    if (!data.endDate) return true;
    
    // Comparar solo las fechas, no las horas
    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(data.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    return endDate >= startDate;
  },
  {
    message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
    path: ["endDate"],
  }
);

type FormData = z.infer<typeof formSchema>;

interface TripFormProps {
  initialData?: Partial<Trip>;
  vehicles: Vehicle[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TripForm = ({ initialData, vehicles, onSubmit, onCancel, isSubmitting = false }: TripFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: initialData?.vehicleId || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      origin: initialData?.origin || '',
      destination: initialData?.destination || '',
      distance: initialData?.distance ? String(initialData.distance) : '',
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    console.log('Submitting trip form with data:', data);
    onSubmit({
      ...data,
      distance: data.distance,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <ScrollArea className="flex-1 max-h-[60vh] pr-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Vehículo *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Seleccionar vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} - {vehicle.brand} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <TripDateFields form={form} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Origen *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lugar de origen" className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Destino *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lugar de destino" className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Distancia (km) *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="Distancia en kilómetros"
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Notas adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Escriba cualquier información adicional sobre el viaje"
                      className="h-16 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-4 border-t">
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
            {initialData?.id ? 'Actualizar' : 'Registrar'} Viaje
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TripForm;
