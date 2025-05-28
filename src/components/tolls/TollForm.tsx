
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

// Esquema de validación optimizado
const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre del peaje debe tener al menos 2 caracteres' }),
  location: z.string().min(2, { message: 'La ubicación debe tener al menos 2 caracteres' }),
  category: z.string().min(1, { message: 'Debe ingresar la categoría del peaje' }),
  price: z.string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      { message: 'El precio debe ser un número válido mayor o igual a 0' }
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
 * Componente de formulario completamente responsive con diseño mobile-first
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
    console.log('📝 [TollForm] Enviando datos del formulario:', data);
    onSubmit({
      ...data,
      price: data.price,
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-2 sm:pr-4">
            <div className="space-y-3 sm:space-y-4 p-1">
              {/* Información básica del peaje */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Información del Peaje
                </h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Nombre del Peaje *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: Peaje Chusacá" 
                          className="h-8 sm:h-9 text-sm" 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                {/* Grid responsivo mejorado para categoría y precio */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Categoría *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ej: I, II, III" 
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
                              className="pl-6 sm:pl-8 h-8 sm:h-9 text-sm"
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Información de ubicación */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Ubicación
                </h3>
                
                {/* Grid responsivo mejorado para ubicación y ruta */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Ubicación *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ej: Cundinamarca" 
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
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Ruta *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ej: Bogotá-Girardot" 
                            className="h-8 sm:h-9 text-sm" 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="coordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Coordenadas (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: 4.5371, -74.2861" 
                          className="h-8 sm:h-9 text-sm" 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Descripción */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Información adicional sobre el peaje"
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
              className="w-full sm:w-auto h-8 sm:h-9 text-sm order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto h-8 sm:h-9 text-sm order-1 sm:order-2"
            >
              {isSubmitting ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Registrar')} Peaje
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default TollForm;
