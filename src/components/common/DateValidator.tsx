
import React from 'react';
import { format, isValid, isBefore, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateValidatorProps {
  date: Date | string | null;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  onValidation?: (isValid: boolean, error?: string) => void;
  children?: React.ReactNode;
}

/**
 * Componente para validación avanzada de fechas
 * Maneja rangos, formatos y casos edge
 */
export const DateValidator: React.FC<DateValidatorProps> = ({
  date,
  minDate,
  maxDate = new Date(),
  required = false,
  onValidation,
  children
}) => {
  const validateDate = React.useCallback(() => {
    console.log('🔍 [DateValidator] Validating date:', date);
    
    // Si no es requerido y está vacío, es válido
    if (!required && (!date || date === '')) {
      onValidation?.(true);
      return { isValid: true };
    }
    
    // Si es requerido y está vacío
    if (required && (!date || date === '')) {
      const error = 'La fecha es requerida';
      onValidation?.(false, error);
      return { isValid: false, error };
    }
    
    // Convertir a Date si es string
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      const error = 'Formato de fecha inválido';
      onValidation?.(false, error);
      return { isValid: false, error };
    }
    
    // Verificar si la fecha es válida
    if (!isValid(dateObj)) {
      const error = 'Fecha inválida';
      onValidation?.(false, error);
      return { isValid: false, error };
    }
    
    // Verificar fecha mínima
    if (minDate && isBefore(startOfDay(dateObj), startOfDay(minDate))) {
      const error = `La fecha debe ser posterior a ${format(minDate, 'dd/MM/yyyy', { locale: es })}`;
      onValidation?.(false, error);
      return { isValid: false, error };
    }
    
    // Verificar fecha máxima
    if (maxDate && isAfter(startOfDay(dateObj), startOfDay(maxDate))) {
      const error = `La fecha debe ser anterior a ${format(maxDate, 'dd/MM/yyyy', { locale: es })}`;
      onValidation?.(false, error);
      return { isValid: false, error };
    }
    
    console.log('✅ [DateValidator] Date is valid');
    onValidation?.(true);
    return { isValid: true };
  }, [date, minDate, maxDate, required, onValidation]);
  
  React.useEffect(() => {
    validateDate();
  }, [validateDate]);
  
  return <>{children}</>;
};

export default DateValidator;
