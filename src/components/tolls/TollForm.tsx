/**
 * TollForm Component
 * 
 * Formulario para crear y editar peajes
 * Incluye validación y manejo de estados
 * 
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:33:58
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Toll } from '@/types';

/**
 * Esquema de validación para el formulario
 */
const tollFormSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  ubicacion: z.string()
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .max(100, 'La ubicación no puede exceder 100 caracteres'),
  tarifa: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'La tarifa debe ser un número mayor a 0'
    }),
  categoria: z.string()
    .min(1, 'Debe seleccionar una categoría'),
  estado: z.string()
    .min(1, 'Debe seleccionar un estado'),
  coordenadas: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }).optional()
});

/**
 * Categorías de peajes disponibles
 */
const CATEGORIAS_PEAJE = [
  { value: '1', label: 'Categoría I - Automóviles' },
  { value: '2', label: 'Categoría II - Camiones pequeños' },
  { value: '3', label: 'Categoría III - Camiones medianos' },
  { value: '4', label: 'Categoría IV - Camiones grandes' },
  { value: '5', label: 'Categoría V - Vehículos especiales' }
];

/**
 * Estados posibles para un peaje
 */
const ESTADOS_PEAJE = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'mantenimiento', label: 'En mantenimiento' },
  { value: 'construccion', label: 'En construcción' }
];

interface TollFormProps {
  toll?: Toll | null;
  onSubmit: (data: Toll) => void;
  onCancel: () => void;
}

/**
 * Componente TollForm
 * @param {TollFormProps} props - Propiedades del componente
 * @returns {JSX.Element} Formulario de peaje
 */
export const TollForm: React.FC<TollFormProps> = ({
  toll,
  onSubmit,
  onCancel
}) => {
  const form = useForm<z.infer<typeof tollFormSchema>>({
    resolver: zodResolver(tollFormSchema),
    defaultValues: {
      nombre: toll?.nombre || '',
      ubicacion: toll?.ubicacion || '',
      tarifa: toll?.tarifa?.toString() || '',
      categoria: toll?.categoria || '',
      estado: toll?.estado || 'activo',
      coordenadas: toll?.coordenadas || { lat: 0, lng: 0 }
    }
  });

  const handleSubmit = (values: z.infer<typeof tollFormSchema>) => {
    onSubmit({
      id: toll?.id || crypto.randomUUID(),
      nombre: values.nombre,
      ubicacion: values.ubicacion,
      tarifa: Number(values.tarifa),
      categoria: values.categoria,
      estado: values.estado,
      coordenadas: values.coordenadas
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Peaje</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Peaje Los Andes" {...field} />
              </FormControl>
              <FormDescription>
                Nombre identificativo del peaje
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ubicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Km 45 Autopista Norte" {...field} />
              </FormControl>
              <FormDescription>
                Ubicación física del peaje
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tarifa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarifa Base</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ej: 15000"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tarifa base en pesos colombianos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIAS_PEAJE.map(categoria => (
                    <SelectItem
                      key={categoria.value}
                      value={categoria.value}
                    >
                      {categoria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Categoría principal del peaje
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ESTADOS_PEAJE.map(estado => (
                    <SelectItem
                      key={estado.value}
                      value={estado.value}
                    >
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Estado actual del peaje
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {toll ? 'Actualizar' : 'Crear'} Peaje
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TollForm;
