
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toll, TollRecord, Trip, Vehicle } from '@/types';
import { formSchema, FormData } from './TollRecordFormValidation';
import TollRecordTripSection from './TollRecordTripSection';
import TollRecordTollSection from './TollRecordTollSection';
import TollRecordPaymentSection from './TollRecordPaymentSection';
import TollRecordNotesSection from './TollRecordNotesSection';

interface TollRecordFormProps {
  initialData?: Partial<TollRecord>;
  trips: Trip[];
  tolls: Toll[];
  vehicles: Vehicle[];
  selectedTripId?: string;
  onSubmit: (data: FormData & { vehicleId: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TollRecordForm = ({
  initialData,
  trips,
  tolls,
  vehicles,
  selectedTripId,
  onSubmit,
  onCancel,
  isSubmitting = false
}: TollRecordFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripId: selectedTripId || initialData?.tripId || '',
      tollId: initialData?.tollId || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      price: initialData?.price ? String(initialData.price) : '',
      paymentMethod: initialData?.paymentMethod || 'efectivo',
      receipt: initialData?.receipt || '',
      notes: initialData?.notes || '',
    },
  });

  // Auto-completar precio cuando se selecciona un peaje
  React.useEffect(() => {
    const tollId = form.watch('tollId');
    if (tollId && !initialData?.price) {
      const selectedToll = tolls.find(t => t.id === tollId);
      if (selectedToll && !form.getValues('price')) {
        form.setValue('price', String(selectedToll.price));
      }
    }
  }, [form.watch('tollId'), tolls, form, initialData?.price]);

  const handleSubmit = (data: FormData) => {
    try {
      // Validar que el viaje existe
      const selectedTrip = trips.find(trip => trip.id === data.tripId);
      if (!selectedTrip) {
        form.setError('tripId', { message: 'El viaje seleccionado no es válido' });
        return;
      }

      // Validar que el peaje existe
      const selectedToll = tolls.find(toll => toll.id === data.tollId);
      if (!selectedToll) {
        form.setError('tollId', { message: 'El peaje seleccionado no es válido' });
        return;
      }

      // Validar que el vehículo del viaje existe
      if (!selectedTrip.vehicleId) {
        form.setError('tripId', { message: 'El viaje no tiene un vehículo asignado' });
        return;
      }

      const selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedTrip.vehicleId);
      if (!selectedVehicle) {
        form.setError('tripId', { message: 'El vehículo del viaje seleccionado no es válido' });
        return;
      }

      // Enviar datos validados
      onSubmit({
        ...data,
        vehicleId: selectedTrip.vehicleId,
      });
    } catch (error) {
      console.error('Error en validación del formulario:', error);
    }
  };

  // Filtrar viajes válidos (que tengan vehículo asignado)
  const validTrips = trips.filter(trip => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    return vehicle !== null;
  });

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-2 sm:pr-4">
            <div className="space-y-3 sm:space-y-4 p-1">
              <TollRecordTripSection
                form={form}
                trips={trips}
                vehicles={vehicles}
                selectedTripId={selectedTripId}
                isSubmitting={isSubmitting}
              />

              <TollRecordTollSection
                form={form}
                tolls={tolls}
                isSubmitting={isSubmitting}
              />
              
              <TollRecordPaymentSection
                form={form}
                isSubmitting={isSubmitting}
              />
              
              <TollRecordNotesSection
                form={form}
                isSubmitting={isSubmitting}
              />
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4 pt-3 sm:pt-4 border-t flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || validTrips.length === 0 || tolls.length === 0}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm order-1 sm:order-2"
            >
              {isSubmitting ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Registrar')} Paso por Peaje
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default TollRecordForm;
