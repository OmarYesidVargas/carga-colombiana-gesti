
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
import { ScrollArea } from '@/components/ui/scroll-area';
import TollBasicInfo from './TollBasicInfo';
import TollLocationInfo from './TollLocationInfo';

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

/**
 * Componente de formulario para crear y editar peajes
 * 
 * Características:
 * - Validación con Zod y React Hook Form
 * - Campos organizados por secciones
 * - Formateo automático de precio en COP
 * - Diseño responsivo y compacto
 * - ScrollArea para evitar desbordamiento
 * 
 * @param initialData - Datos iniciales para edición
 * @param onSubmit - Función ejecutada al enviar el formulario
 * @param onCancel - Función ejecutada al cancelar
 * @param isSubmitting - Estado de envío del formulario
 */
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <ScrollArea className="flex-1 max-h-[60vh] pr-4">
          <div className="space-y-4">
            <TollBasicInfo form={form} />
            <TollLocationInfo form={form} />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Información adicional sobre el peaje"
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
            {initialData?.id ? 'Actualizar' : 'Registrar'} Peaje
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TollForm;
