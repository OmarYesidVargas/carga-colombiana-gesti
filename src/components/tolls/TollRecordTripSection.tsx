
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
import { Trip, Vehicle } from '@/types';
import { FormData } from './TollRecordFormValidation';

interface TollRecordTripSectionProps {
  form: UseFormReturn<FormData>;
  trips: Trip[];
  vehicles: Vehicle[];
  selectedTripId?: string;
  isSubmitting: boolean;
}

const TollRecordTripSection = ({
  form,
  trips,
  vehicles,
  selectedTripId,
  isSubmitting
}: TollRecordTripSectionProps) => {
  // Encontrar vehículos para los viajes
  const getTripVehicle = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return null;
    return vehicles.find(v => v.id === trip.vehicleId);
  };

  // Filtrar viajes válidos (que tengan vehículo asignado)
  const validTrips = trips.filter(trip => {
    const vehicle = getTripVehicle(trip.id);
    return vehicle !== null;
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
        Información del Viaje
      </h3>
      
      <FormField
        control={form.control}
        name="tripId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">Viaje *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={!!selectedTripId || isSubmitting}
            >
              <FormControl>
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Seleccionar viaje" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="z-50">
                {validTrips.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    No hay viajes disponibles
                  </div>
                ) : (
                  validTrips.map((trip) => {
                    const vehicle = getTripVehicle(trip.id);
                    return (
                      <SelectItem key={trip.id} value={trip.id} className="text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {trip.origin} → {trip.destination}
                          </span>
                          {vehicle && (
                            <span className="text-xs text-muted-foreground">
                              {vehicle.plate} - {vehicle.brand} {vehicle.model}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })
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

export default TollRecordTripSection;
