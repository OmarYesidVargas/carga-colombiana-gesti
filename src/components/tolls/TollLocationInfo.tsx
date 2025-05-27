
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface TollLocationInfoProps {
  form: UseFormReturn<any>;
}

/**
 * Componente para la información de ubicación del peaje
 * 
 * Incluye:
 * - Ubicación geográfica
 * - Ruta donde se encuentra
 * - Coordenadas GPS (opcional)
 * 
 * @param form - Instancia del formulario de React Hook Form
 */
const TollLocationInfo = ({ form }: TollLocationInfoProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Ubicación *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Cundinamarca" className="h-9" />
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
                <FormLabel className="text-sm">Ruta *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Bogotá-Girardot" className="h-9" />
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
              <FormLabel className="text-sm">Coordenadas (opcional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 4.5371, -74.2861" className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default TollLocationInfo;
