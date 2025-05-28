
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
    <div className="flex flex-col h-full max-h-[85vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          <ScrollArea className="flex-1 max-h-[65vh] pr-2 sm:pr-4">
            <div className="space-y-3 sm:space-y-4 p-1">
              {/* Sección de vehículo */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Vehículo
                </h3>
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Vehículo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger className="h-8 sm:h-9 text-sm">
                            <SelectValue placeholder="Seleccionar vehículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id} className="text-sm">
                              <span className="truncate">
                                {vehicle.plate} - {vehicle.brand} {vehicle.model}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Sección de fechas */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Fechas del Viaje
                </h3>
                <TripDateFields form={form} isSubmitting={isSubmitting} />
              </div>
              
              {/* Sección de ubicaciones - Grid completamente responsivo */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Ubicaciones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Origen *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Lugar de origen" 
                            className="h-8 sm:h-9 text-sm" 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Destino *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Lugar de destino" 
                            className="h-8 sm:h-9 text-sm" 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Sección de distancia */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Información Adicional
                </h3>
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Distancia (km) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Distancia en kilómetros"
                          className="h-8 sm:h-9 text-sm"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Notas adicionales</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Escriba cualquier información adicional sobre el viaje"
                          className="h-16 sm:h-20 resize-none text-sm"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4 pt-3 sm:pt-4 border-t flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-8 sm:h-9 text-sm order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto h-8 sm:h-9 text-sm order-1 sm:order-2"
            >
              {isSubmitting ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Registrar')} Viaje
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default TripForm;
