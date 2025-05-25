
import { Trip } from '@/types';

/**
 * Mapeador para convertir datos de la DB al formato de la aplicación
 */
export const mapTripFromDB = (trip: any): Trip => {
  if (!trip || typeof trip !== 'object') {
    throw new Error('Datos de viaje inválidos');
  }

  return {
    id: trip.id,
    userId: trip.user_id,
    vehicleId: trip.vehicle_id,
    origin: trip.origin || '',
    destination: trip.destination || '',
    startDate: trip.start_date,
    endDate: trip.end_date || null,
    distance: parseFloat(trip.distance) || 0,
    notes: trip.notes || null,
    createdAt: trip.created_at,
    updatedAt: trip.updated_at
  };
};

/**
 * Mapeador para convertir datos de la aplicación al formato de la DB
 */
export const mapTripToDB = (trip: Partial<Trip>): any => {
  const mappedTrip: Record<string, any> = {};
  
  if (trip.origin) mappedTrip.origin = trip.origin.trim();
  if (trip.destination) mappedTrip.destination = trip.destination.trim();
  if (trip.startDate) mappedTrip.start_date = trip.startDate;
  if (trip.endDate !== undefined) mappedTrip.end_date = trip.endDate;
  if (trip.distance !== undefined) mappedTrip.distance = Number(trip.distance);
  if (trip.notes !== undefined) mappedTrip.notes = trip.notes?.trim() || null;
  if (trip.vehicleId) mappedTrip.vehicle_id = trip.vehicleId;
  if (trip.userId) mappedTrip.user_id = trip.userId;
  
  return mappedTrip;
};
