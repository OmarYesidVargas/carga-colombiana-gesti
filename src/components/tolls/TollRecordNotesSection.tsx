
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from './TollRecordFormValidation';

interface TollRecordNotesSectionProps {
  form: UseFormReturn<FormData>;
  isSubmitting: boolean;
}

const TollRecordNotesSection = ({
  form,
  isSubmitting
}: TollRecordNotesSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs sm:text-sm">Notas (opcional)</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Información adicional sobre el paso por el peaje"
              className="h-16 sm:h-20 resize-none text-sm"
              disabled={isSubmitting}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default TollRecordNotesSection;
