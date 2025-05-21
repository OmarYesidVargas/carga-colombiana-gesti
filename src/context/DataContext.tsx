import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  vehicles: Vehicle[];
  trips: Trip[];
  expenses: Expense[];
  tolls: Toll[];
  tollRecords: TollRecord[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addTrip: (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'vehicleId'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addToll: (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateToll: (id: string, toll: Partial<Toll>) => Promise<void>;
  deleteToll: (id: string) => Promise<void>;
  addTollRecord: (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTollRecord: (id: string, record: Partial<TollRecord>) => Promise<void>;
  deleteTollRecord: (id: string) => Promise<void>;
  getVehicleById: (id: string) => Vehicle | undefined;
  getTripById: (id: string) => Trip | undefined;
  getExpenseById: (id: string) => Expense | undefined;
  getTollById: (id: string) => Toll | undefined;
  getTollRecordById: (id: string) => TollRecord | undefined;
  isLoading: boolean;
  reloadData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// Helper para convertir fechas de string a Date
const convertDatesToDateObjects = <T extends object>(item: T): T => {
  const result = { ...item } as any;
  
  for (const key in result) {
    if (key.includes('date') || key.includes('Date') || key === 'createdAt' || key === 'updatedAt') {
      if (result[key] && typeof result[key] === 'string') {
        result[key] = new Date(result[key]);
      }
    }
  }
  
  return result as T;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tolls, setTolls] = useState<Toll[]>([]);
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cargar datos cuando el usuario está autenticado
  const loadData = async () => {
    if (!isAuthenticated || !userId) {
      setVehicles([]);
      setTrips([]);
      setExpenses([]);
      setTolls([]);
      setTollRecords([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Cargar vehículos
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', userId);
        
      if (vehiclesError) throw vehiclesError;
      const processedVehicles = vehiclesData.map((vehicle: any) => convertDatesToDateObjects({
        ...vehicle,
        id: vehicle.id,
        userId: vehicle.user_id,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        fuelType: vehicle.fuel_type,
        capacity: vehicle.capacity,
        imageUrl: vehicle.image_url,
        createdAt: new Date(vehicle.created_at),
        updatedAt: new Date(vehicle.updated_at)
      }));
      setVehicles(processedVehicles);
      
      // Cargar viajes
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId);
        
      if (tripsError) throw tripsError;
      const processedTrips = tripsData.map((trip: any) => convertDatesToDateObjects({
        ...trip,
        id: trip.id,
        vehicleId: trip.vehicle_id,
        userId: trip.user_id,
        startDate: new Date(trip.start_date),
        endDate: new Date(trip.end_date),
        origin: trip.origin,
        destination: trip.destination,
        distance: Number(trip.distance),
        notes: trip.notes,
        createdAt: new Date(trip.created_at),
        updatedAt: new Date(trip.updated_at)
      }));
      setTrips(processedTrips);
      
      // Cargar gastos
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);
        
      if (expensesError) throw expensesError;
      const processedExpenses = expensesData.map((expense: any) => convertDatesToDateObjects({
        ...expense,
        id: expense.id,
        tripId: expense.trip_id,
        userId: expense.user_id,
        vehicleId: expense.vehicle_id,
        category: expense.category,
        date: new Date(expense.date),
        amount: Number(expense.amount),
        description: expense.description,
        receiptUrl: expense.receipt_url,
        createdAt: new Date(expense.created_at),
        updatedAt: new Date(expense.updated_at)
      }));
      setExpenses(processedExpenses);
      
      // Cargar peajes
      const { data: tollsData, error: tollsError } = await supabase
        .from('tolls')
        .select('*')
        .eq('user_id', userId);
        
      if (tollsError) throw tollsError;
      const processedTolls = tollsData.map((toll: any) => convertDatesToDateObjects({
        ...toll,
        id: toll.id,
        userId: toll.user_id,
        name: toll.name,
        location: toll.location,
        category: toll.category,
        price: Number(toll.price),
        route: toll.route,
        coordinates: toll.coordinates,
        description: toll.description,
        createdAt: new Date(toll.created_at),
        updatedAt: new Date(toll.updated_at)
      }));
      setTolls(processedTolls);
      
      // Cargar registros de peajes
      const { data: tollRecordsData, error: tollRecordsError } = await supabase
        .from('toll_records')
        .select('*')
        .eq('user_id', userId);
        
      if (tollRecordsError) throw tollRecordsError;
      const processedTollRecords = tollRecordsData.map((record: any) => convertDatesToDateObjects({
        ...record,
        id: record.id,
        userId: record.user_id,
        tripId: record.trip_id,
        vehicleId: record.vehicle_id,
        tollId: record.toll_id,
        date: new Date(record.date),
        price: Number(record.price),
        paymentMethod: record.payment_method,
        receipt: record.receipt,
        notes: record.notes,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at)
      }));
      setTollRecords(processedTollRecords);
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error(`Error cargando datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efecto para cargar datos cuando cambia el usuario
  useEffect(() => {
    loadData();
  }, [userId, isAuthenticated]);
  
  // Funciones para gestionar vehículos
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          user_id: userId,
          plate: vehicle.plate,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          fuel_type: vehicle.fuelType,
          capacity: vehicle.capacity,
          image_url: vehicle.imageUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newVehicle: Vehicle = {
        id: data.id,
        userId: data.user_id,
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        fuelType: data.fuel_type,
        capacity: data.capacity,
        imageUrl: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setVehicles([...vehicles, newVehicle]);
      toast.success('Vehículo agregado exitosamente');
    } catch (error: any) {
      console.error('Error al agregar vehículo:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const updateData: any = {};
      
      if (vehicleData.plate) updateData.plate = vehicleData.plate;
      if (vehicleData.brand) updateData.brand = vehicleData.brand;
      if (vehicleData.model) updateData.model = vehicleData.model;
      if (vehicleData.year) updateData.year = vehicleData.year;
      if (vehicleData.color !== undefined) updateData.color = vehicleData.color;
      if (vehicleData.fuelType !== undefined) updateData.fuel_type = vehicleData.fuelType;
      if (vehicleData.capacity !== undefined) updateData.capacity = vehicleData.capacity;
      if (vehicleData.imageUrl !== undefined) updateData.image_url = vehicleData.imageUrl;
      
      const { data, error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedVehicle: Vehicle = {
        id: data.id,
        userId: data.user_id,
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        fuelType: data.fuel_type,
        capacity: data.capacity,
        imageUrl: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setVehicles(vehicles.map(vehicle => vehicle.id === id ? updatedVehicle : vehicle));
      toast.success('Vehículo actualizado exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar vehículo:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const deleteVehicle = async (id: string) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    // Verificar si hay viajes relacionados
    const relatedTrips = trips.filter((trip) => trip.vehicleId === id);
    
    if (relatedTrips.length > 0) {
      toast.error('No se puede eliminar el vehículo porque tiene viajes asociados');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      toast.success('Vehículo eliminado exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar vehículo:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Función para obtener un vehículo por ID
  const getVehicleById = (id: string): Vehicle | undefined => {
    return vehicles.find(vehicle => vehicle.id === id);
  };
  
  // Funciones para gestionar viajes
  const addTrip = async (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id: userId,
          vehicle_id: trip.vehicleId,
          start_date: trip.startDate.toISOString(),
          end_date: trip.endDate.toISOString(),
          origin: trip.origin,
          destination: trip.destination,
          distance: trip.distance,
          notes: trip.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newTrip: Trip = {
        id: data.id,
        userId: data.user_id,
        vehicleId: data.vehicle_id,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        origin: data.origin,
        destination: data.destination,
        distance: Number(data.distance),
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setTrips([...trips, newTrip]);
      toast.success('Viaje agregado exitosamente');
    } catch (error: any) {
      console.error('Error al agregar viaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const updateData: any = {};
      
      if (tripData.vehicleId) updateData.vehicle_id = tripData.vehicleId;
      if (tripData.startDate) updateData.start_date = tripData.startDate.toISOString();
      if (tripData.endDate) updateData.end_date = tripData.endDate.toISOString();
      if (tripData.origin) updateData.origin = tripData.origin;
      if (tripData.destination) updateData.destination = tripData.destination;
      if (tripData.distance !== undefined) updateData.distance = tripData.distance;
      if (tripData.notes !== undefined) updateData.notes = tripData.notes;
      
      const { data, error } = await supabase
        .from('trips')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedTrip: Trip = {
        id: data.id,
        userId: data.user_id,
        vehicleId: data.vehicle_id,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        origin: data.origin,
        destination: data.destination,
        distance: Number(data.distance),
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setTrips(trips.map(trip => trip.id === id ? updatedTrip : trip));
      toast.success('Viaje actualizado exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar viaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const deleteTrip = async (id: string) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      // Eliminar gastos relacionados primero
      await supabase
        .from('expenses')
        .delete()
        .eq('trip_id', id)
        .eq('user_id', userId);
      
      // Eliminar registros de peajes relacionados
      await supabase
        .from('toll_records')
        .delete()
        .eq('trip_id', id)
        .eq('user_id', userId);
      
      // Eliminar el viaje
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Actualizar el estado local
      setExpenses(expenses.filter(expense => expense.tripId !== id));
      setTollRecords(tollRecords.filter(record => record.tripId !== id));
      setTrips(trips.filter(trip => trip.id !== id));
      
      toast.success('Viaje eliminado exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar viaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Función para obtener un viaje por ID
  const getTripById = (id: string): Trip | undefined => {
    return trips.find(trip => trip.id === id);
  };
  
  // Funciones para gestionar gastos
  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'vehicleId'>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      // Obtener el vehicleId del viaje
      const trip = await getTripById(expense.tripId);
      if (!trip) {
        toast.error('El viaje seleccionado no existe');
        return;
      }
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          trip_id: expense.tripId,
          vehicle_id: trip.vehicleId,
          category: expense.category,
          date: expense.date.toISOString(),
          amount: expense.amount,
          description: expense.description,
          receipt_url: expense.receiptUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newExpense: Expense = {
        id: data.id,
        userId: data.user_id,
        tripId: data.trip_id,
        vehicleId: data.vehicle_id,
        category: data.category,
        date: new Date(data.date),
        amount: Number(data.amount),
        description: data.description,
        receiptUrl: data.receipt_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setExpenses([...expenses, newExpense]);
      toast.success('Gasto agregado exitosamente');
    } catch (error: any) {
      console.error('Error al agregar gasto:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const updateData: any = {};
      
      if (expenseData.tripId) {
        updateData.trip_id = expenseData.tripId;
        // Si se cambia el tripId, actualizar vehicleId
        const trip = await getTripById(expenseData.tripId);
        if (trip) {
          updateData.vehicle_id = trip.vehicleId;
        }
      }
      
      if (expenseData.category) updateData.category = expenseData.category;
      if (expenseData.date) updateData.date = expenseData.date.toISOString();
      if (expenseData.amount !== undefined) updateData.amount = expenseData.amount;
      if (expenseData.description !== undefined) updateData.description = expenseData.description;
      if (expenseData.receiptUrl !== undefined) updateData.receipt_url = expenseData.receiptUrl;
      
      const { data, error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedExpense: Expense = {
        id: data.id,
        userId: data.user_id,
        tripId: data.trip_id,
        vehicleId: data.vehicle_id,
        category: data.category,
        date: new Date(data.date),
        amount: Number(data.amount),
        description: data.description,
        receiptUrl: data.receipt_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setExpenses(expenses.map(expense => expense.id === id ? updatedExpense : expense));
      toast.success('Gasto actualizado exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar gasto:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const deleteExpense = async (id: string) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setExpenses(expenses.filter(expense => expense.id !== id));
      toast.success('Gasto eliminado exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar gasto:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Función para obtener un gasto por ID
  const getExpenseById = (id: string): Expense | undefined => {
    return expenses.find(expense => expense.id === id);
  };
  
  // Funciones para gestionar peajes
  const addToll = async (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('tolls')
        .insert({
          user_id: userId,
          name: toll.name,
          location: toll.location,
          category: toll.category,
          price: toll.price,
          route: toll.route,
          coordinates: toll.coordinates,
          description: toll.description
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newToll: Toll = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        location: data.location,
        category: data.category,
        price: Number(data.price),
        route: data.route,
        coordinates: data.coordinates,
        description: data.description,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setTolls([...tolls, newToll]);
      toast.success('Peaje agregado exitosamente');
    } catch (error: any) {
      console.error('Error al agregar peaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const updateToll = async (id: string, tollData: Partial<Toll>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const updateData: any = {};
      
      if (tollData.name) updateData.name = tollData.name;
      if (tollData.location) updateData.location = tollData.location;
      if (tollData.category) updateData.category = tollData.category;
      if (tollData.price !== undefined) updateData.price = tollData.price;
      if (tollData.route) updateData.route = tollData.route;
      if (tollData.coordinates !== undefined) updateData.coordinates = tollData.coordinates;
      if (tollData.description !== undefined) updateData.description = tollData.description;
      
      const { data, error } = await supabase
        .from('tolls')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedToll: Toll = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        location: data.location,
        category: data.category,
        price: Number(data.price),
        route: data.route,
        coordinates: data.coordinates,
        description: data.description,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setTolls(tolls.map(toll => toll.id === id ? updatedToll : toll));
      toast.success('Peaje actualizado exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar peaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const deleteToll = async (id: string) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    // Verificar si hay registros de peajes relacionados
    const relatedRecords = tollRecords.filter(record => record.tollId === id);
    
    if (relatedRecords.length > 0) {
      toast.error('No se puede eliminar el peaje porque tiene registros asociados');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tolls')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setTolls(tolls.filter(toll => toll.id !== id));
      toast.success('Peaje eliminado exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar peaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Función para obtener un peaje por ID
  const getTollById = (id: string): Toll | undefined => {
    return tolls.find(toll => toll.id === id);
  };
  
  // Funciones para gestionar registros de peajes
  const addTollRecord = async (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('toll_records')
        .insert({
          user_id: userId,
          trip_id: record.tripId,
          vehicle_id: record.vehicleId,
          toll_id: record.tollId,
          date: record.date.toISOString(),
          price: record.price,
          payment_method: record.paymentMethod,
          receipt: record.receipt,
          notes: record.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newRecord: TollRecord = {
        id: data.id,
        userId: data.user_id,
        tripId: data.trip_id,
        vehicleId: data.vehicle_id,
        tollId: data.toll_id,
        date: new Date(data.date),
        price: Number(data.price),
        paymentMethod: data.payment_method,
        receipt: data.receipt,
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setTollRecords([...tollRecords, newRecord]);
      toast.success('Registro de peaje agregado exitosamente');
    } catch (error: any) {
      console.error('Error al agregar registro de peaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const updateTollRecord = async (id: string, recordData: Partial<TollRecord>) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const updateData: any = {};
      
      if (recordData.tripId) updateData.trip_id = recordData.tripId;
      if (recordData.vehicleId) updateData.vehicle_id = recordData.vehicleId;
      if (recordData.tollId) updateData.toll_id = recordData.tollId;
      if (recordData.date) updateData.date = recordData.date.toISOString();
      if (recordData.price !== undefined) updateData.price = recordData.price;
      if (recordData.paymentMethod) updateData.payment_method = recordData.paymentMethod;
      if (recordData.receipt !== undefined) updateData.receipt = recordData.receipt;
      if (recordData.notes !== undefined) updateData.notes = recordData.notes;
      
      const { data, error } = await supabase
        .from('toll_records')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedRecord: TollRecord = {
        id: data.id,
        userId: data.user_id,
        tripId: data.trip_id,
        vehicleId: data.vehicle_id,
        tollId: data.toll_id,
        date: new Date(data.date),
        price: Number(data.price),
        paymentMethod: data.payment_method,
        receipt: data.receipt,
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setTollRecords(tollRecords.map(record => record.id === id ? updatedRecord : record));
      toast.success('Registro de peaje actualizado exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar registro de peaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const deleteTollRecord = async (id: string) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setTollRecords(tollRecords.filter(record => record.id !== id));
      toast.success('Registro de peaje eliminado exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar registro de peaje:', error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Función para obtener un registro de peaje por ID
  const getTollRecordById = (id: string): TollRecord | undefined => {
    return tollRecords.find(record => record.id === id);
  };
  
  // Función para recargar datos
  const reloadData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        trips,
        expenses,
        tolls,
        tollRecords,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addTrip,
        updateTrip,
        deleteTrip,
        addExpense,
        updateExpense,
        deleteExpense,
        addToll,
        updateToll,
        deleteToll,
        addTollRecord,
        updateTollRecord,
        deleteTollRecord,
        getVehicleById,
        getTripById,
        getExpenseById,
        getTollById,
        getTollRecordById,
        isLoading,
        reloadData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
