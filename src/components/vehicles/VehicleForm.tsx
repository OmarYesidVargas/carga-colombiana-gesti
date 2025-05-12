
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
import { Vehicle } from '@/types';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Esquema de validación para el formulario
const formSchema = z.object({
  plate: z.string().min(6, 'La placa debe tener al menos 6 caracteres').max(7, 'La placa no debe exceder 7 caracteres'),
  brand: z.string().min(2, 'La marca es requerida'),
  model: z.string().min(2, 'El modelo es requerido'),
  year: z.string()
    .refine(
      (val) => !isNaN(Number(val)),
      { message: 'El año debe ser un número' }
    )
    .refine(
      (val) => {
        const year = Number(val);
        return year >= 1950 && year <= new Date().getFullYear() + 1;
      },
      { message: `El año debe estar entre 1950 y ${new Date().getFullYear() + 1}` }
    ),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  capacity: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const fuelTypes = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'gas', label: 'Gas Natural' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'electric', label: 'Eléctrico' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 74 }, (_, i) => (currentYear + 1 - i).toString());

const VehicleForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }: VehicleFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: initialData?.plate || '',
      brand: initialData?.brand || '',
      model: initialData?.model || '',
      year: initialData?.year ? String(initialData.year) : '',
      color: initialData?.color || '',
      fuelType: initialData?.fuelType || '',
      capacity: initialData?.capacity || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      year: data.year,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="ABC123" 
                  className="uppercase vehicle-plate"
                  maxLength={7}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Marca del vehículo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Modelo del vehículo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
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
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Color (opcional)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Combustible</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad de Carga</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 5 Toneladas (opcional)" />
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
            {initialData?.id ? 'Actualizar' : 'Guardar'} Vehículo
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default VehicleForm;
