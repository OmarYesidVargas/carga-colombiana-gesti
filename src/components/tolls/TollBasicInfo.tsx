
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
import { FileText } from 'lucide-react';

interface TollBasicInfoProps {
  form: UseFormReturn<any>;
}

/**
 * Componente para la información básica del peaje
 * 
 * Incluye:
 * - Nombre del peaje
 * - Categoría vehicular
 * - Precio en COP
 * 
 * @param form - Instancia del formulario de React Hook Form
 */
const TollBasicInfo = ({ form }: TollBasicInfoProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Información del Peaje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Nombre del Peaje *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Peaje Chusacá" className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Categoría *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: I, II, III, etc." className="h-9" />
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
                <FormLabel className="text-sm">Precio (COP) *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">$</span>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="100"
                      placeholder="0"
                      className="pl-8 h-9"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TollBasicInfo;
