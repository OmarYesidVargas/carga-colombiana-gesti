
import { Toll, TollRecord } from '@/types';

/**
 * Mapeador para convertir datos de peaje de la DB al formato de la aplicación
 */
export const mapTollFromDB = (toll: any): Toll => {
  if (!toll || typeof toll !== 'object') {
    throw new Error('Datos de peaje inválidos');
  }

  return {
    id: toll.id,
    userId: toll.user_id,
    name: toll.name || '',
    location: toll.location || '',
    price: parseFloat(toll.price) || 0,
    category: toll.category || '',
    route: toll.route || '',
    coordinates: toll.coordinates || undefined,
    description: toll.description || undefined,
    createdAt: toll.created_at,
    updatedAt: toll.updated_at
  };
};

/**
 * Mapeador para convertir datos de peaje de la aplicación al formato de la DB
 */
export const mapTollToDB = (toll: Partial<Toll>): any => {
  const mappedToll: Record<string, any> = {};
  
  if (toll.name) mappedToll.name = toll.name.trim();
  if (toll.location) mappedToll.location = toll.location.trim();
  if (toll.price !== undefined) mappedToll.price = Number(toll.price);
  if (toll.category) mappedToll.category = toll.category.trim();
  if (toll.route) mappedToll.route = toll.route.trim();
  if (toll.coordinates !== undefined) mappedToll.coordinates = toll.coordinates?.trim() || null;
  if (toll.description !== undefined) mappedToll.description = toll.description?.trim() || null;
  if (toll.userId) mappedToll.user_id = toll.userId;
  
  return mappedToll;
};

/**
 * Mapeador para convertir datos de registro de peaje de la DB al formato de la aplicación
 */
export const mapTollRecordFromDB = (record: any): TollRecord => {
  if (!record || typeof record !== 'object') {
    throw new Error('Registro de peaje inválido');
  }

  return {
    id: record.id,
    userId: record.user_id,
    tripId: record.trip_id,
    vehicleId: record.vehicle_id,
    tollId: record.toll_id,
    date: record.date,
    price: parseFloat(record.price) || 0,
    amount: parseFloat(record.price) || 0, // amount es igual a price para compatibilidad
    paymentMethod: record.payment_method || 'efectivo',
    receipt: record.receipt || undefined,
    notes: record.notes || undefined,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
};

/**
 * Mapeador para convertir datos de registro de peaje de la aplicación al formato de la DB
 */
export const mapTollRecordToDB = (record: Partial<TollRecord>): any => {
  const mappedRecord: Record<string, any> = {};
  
  if (record.tripId) mappedRecord.trip_id = record.tripId;
  if (record.vehicleId) mappedRecord.vehicle_id = record.vehicleId;
  if (record.tollId) mappedRecord.toll_id = record.tollId;
  if (record.date) mappedRecord.date = record.date;
  if (record.price !== undefined) mappedRecord.price = Number(record.price);
  if (record.paymentMethod) mappedRecord.payment_method = record.paymentMethod;
  if (record.receipt !== undefined) mappedRecord.receipt = record.receipt;
  if (record.notes !== undefined) mappedRecord.notes = record.notes;
  if (record.userId) mappedRecord.user_id = record.userId;
  
  return mappedRecord;
};
