
import { z } from 'zod';

// Métodos de pago
export const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'electrónico', label: 'Pago electrónico' },
  { value: 'tag', label: 'Tag / Telepeaje' },
  { value: 'otro', label: 'Otro' },
];

// Esquema de validación mejorado
export const formSchema = z.object({
  tripId: z.string().min(1, { message: 'Debe seleccionar un viaje' }),
  tollId: z.string().min(1, { message: 'Debe seleccionar un peaje' }),
  date: z.date({ required_error: 'La fecha es requerida' }),
  price: z.string()
    .min(1, { message: 'El precio es requerido' })
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      { message: 'El precio debe ser un número mayor a 0' }
    ),
  paymentMethod: z.string().min(1, { message: 'Debe seleccionar un método de pago' }),
  receipt: z.string().optional(),
  notes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;
