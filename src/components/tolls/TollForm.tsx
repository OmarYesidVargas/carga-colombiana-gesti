
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
import { Toll } from '@/types';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Esquema de validación para el formulario
const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre del peaje debe tener al menos 2 caracteres' }),
  location: z.string().min(2, { message: 'La ubicación debe tener al menos 2 caracteres' }),
  category: z.string().min(1, { message: 'Debe ingresar la categoría del peaje' }),
  price: z.string()
    .refine(
      (val) => !isNaN(Number(val)),
      { message: 'El precio debe ser un número' }
    )
    .refine(
      (val) => Number(val) >= 0,
      { message: 'El precio no puede ser negativo' }
    ),
  route: z.string().min(2, { message: 'La ruta debe tener al menos 2 caracteres' }),
  coordinates: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TollFormProps {
  initialData?: Partial<Toll>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TollForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: TollFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      category: initialData?.category || '',
      price: initialData?.price ? String(initialData.price) : '',
      route: initialData?.route || '',
      coordinates: initialData?.coordinates || '',
      description: initialData?.description || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      price: data.price,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Peaje *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Peaje Chusacá" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Cundinamarca" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ruta *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Bogotá-Girardot" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: I, II, III, etc." />
                </FormControl>
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
                      step="100"
                      placeholder="0"
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="coordinates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordenadas (opcional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 4.5371, -74.2861" />
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
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Información adicional sobre el peaje"
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
            {initialData?.id ? 'Actualizar' : 'Registrar'} Peaje
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TollForm;
