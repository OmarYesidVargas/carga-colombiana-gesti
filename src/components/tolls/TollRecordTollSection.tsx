
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toll } from '@/types';
import { FormData } from './TollRecordFormValidation';

interface TollRecordTollSectionProps {
  form: UseFormReturn<FormData>;
  tolls: Toll[];
  isSubmitting: boolean;
}

const TollRecordTollSection = ({
  form,
  tolls,
  isSubmitting
}: TollRecordTollSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
        Información del Peaje
      </h3>
      
      <FormField
        control={form.control}
        name="tollId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">Peaje *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Seleccionar peaje" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="z-50">
                {tolls.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    No hay peajes disponibles
                  </div>
                ) : (
                  tolls.map((toll) => (
                    <SelectItem key={toll.id} value={toll.id} className="text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium">{toll.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {toll.route} - ${toll.price.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TollRecordTollSection;
