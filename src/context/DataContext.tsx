
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Datos
  vehicles: Vehicle[];
  trips: Trip[];
  expenses: Expense[];
  tolls: Toll[];
  tollRecords: TollRecord[];
  
  // Cargando estados
  isLoading: {
    vehicles: boolean;
    trips: boolean;
    expenses: boolean;
    tolls: boolean;
    tollRecords: boolean;
  };
  
  // Funciones para vehículos
  getVehicleById: (id: string) => Vehicle | undefined;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Funciones para viajes
  getTripById: (id: string) => Trip | undefined;
  addTrip: (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  
  // Funciones para gastos
  getExpenseById: (id: string) => Expense | undefined;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  // Funciones para peajes
  getTollById: (id: string) => Toll | undefined;
  addToll: (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateToll: (id: string, toll: Partial<Toll>) => Promise<void>;
  deleteToll: (id: string) => Promise<void>;
  
  // Funciones para registros de peajes
  getTollRecordById: (id: string) => TollRecord | undefined;
  addTollRecord: (tollRecord: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTollRecord: (id: string, tollRecord: Partial<TollRecord>) => Promise<void>;
  deleteTollRecord: (id: string) => Promise<void>;
  
  // Recargar datos
  reloadData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser utilizado dentro de un DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const { isAuthenticated, user } = useAuth();
  
  // Estados para los datos
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tolls, setTolls] = useState<Toll[]>([]);
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  
  // Estados de carga
  const [isLoading, setIsLoading] = useState({
    vehicles: false,
    trips: false,
    expenses: false,
    tolls: false,
    tollRecords: false
  });
  
  // Cargar datos iniciales cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      loadInitialData();
    } else {
      // Limpiar datos si el usuario no está autenticado
      clearAllData();
    }
  }, [isAuthenticated, user]);
  
  // Función para cargar todos los datos iniciales
  const loadInitialData = async () => {
    loadVehicles();
    loadTrips();
    loadExpenses();
    loadTolls();
    loadTollRecords();
  };
  
  // Función para recargar todos los datos
  const reloadData = async () => {
    await loadInitialData();
  };
  
  // Limpiar todos los datos
  const clearAllData = () => {
    setVehicles([]);
    setTrips([]);
    setExpenses([]);
    setTolls([]);
    setTollRecords([]);
  };
  
  // Funciones de carga para cada tipo de dato
  const loadVehicles = async () => {
    try {
      setIsLoading(prev => ({ ...prev, vehicles: true }));
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar vehículos:', error);
        toast.error('Error al cargar vehículos');
      } else {
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error en loadVehicles:', error);
      toast.error('Error al cargar vehículos');
    } finally {
      setIsLoading(prev => ({ ...prev, vehicles: false }));
    }
  };
  
  const loadTrips = async () => {
    try {
      setIsLoading(prev => ({ ...prev, trips: true }));
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar viajes:', error);
        toast.error('Error al cargar viajes');
      } else {
        setTrips(data);
      }
    } catch (error) {
      console.error('Error en loadTrips:', error);
      toast.error('Error al cargar viajes');
    } finally {
      setIsLoading(prev => ({ ...prev, trips: false }));
    }
  };
  
  const loadExpenses = async () => {
    try {
      setIsLoading(prev => ({ ...prev, expenses: true }));
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error al cargar gastos:', error);
        toast.error('Error al cargar gastos');
      } else {
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error en loadExpenses:', error);
      toast.error('Error al cargar gastos');
    } finally {
      setIsLoading(prev => ({ ...prev, expenses: false }));
    }
  };
  
  const loadTolls = async () => {
    try {
      setIsLoading(prev => ({ ...prev, tolls: true }));
      
      const { data, error } = await supabase
        .from('tolls')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error al cargar peajes:', error);
        toast.error('Error al cargar peajes');
      } else {
        setTolls(data);
      }
    } catch (error) {
      console.error('Error en loadTolls:', error);
      toast.error('Error al cargar peajes');
    } finally {
      setIsLoading(prev => ({ ...prev, tolls: false }));
    }
  };
  
  const loadTollRecords = async () => {
    try {
      setIsLoading(prev => ({ ...prev, tollRecords: true }));
      
      const { data, error } = await supabase
        .from('toll_records')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error al cargar registros de peajes:', error);
        toast.error('Error al cargar registros de peajes');
      } else {
        setTollRecords(data);
      }
    } catch (error) {
      console.error('Error en loadTollRecords:', error);
      toast.error('Error al cargar registros de peajes');
    } finally {
      setIsLoading(prev => ({ ...prev, tollRecords: false }));
    }
  };

  // Funciones get por ID - CORREGIDAS para no devolver Promise
  const getVehicleById = (id: string): Vehicle | undefined => {
    return vehicles.find(vehicle => vehicle.id === id);
  };
  
  const getTripById = (id: string): Trip | undefined => {
    return trips.find(trip => trip.id === id);
  };
  
  const getExpenseById = (id: string): Expense | undefined => {
    return expenses.find(expense => expense.id === id);
  };
  
  const getTollById = (id: string): Toll | undefined => {
    return tolls.find(toll => toll.id === id);
  };
  
  const getTollRecordById = (id: string): TollRecord | undefined => {
    return tollRecords.find(record => record.id === id);
  };
  
  // Funciones CRUD para vehículos
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar un vehículo');
      return;
    }
    
    try {
      const newVehicle = {
        ...vehicle,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert(newVehicle)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al agregar vehículo:', error);
        toast.error('Error al agregar vehículo');
      } else {
        setVehicles(prev => [data, ...prev]);
        toast.success('Vehículo agregado correctamente');
      }
    } catch (error) {
      console.error('Error en addVehicle:', error);
      toast.error('Error al agregar vehículo');
    }
  };
  
  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicle)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al actualizar vehículo:', error);
        toast.error('Error al actualizar vehículo');
      } else {
        setVehicles(prev => prev.map(v => (v.id === id ? data : v)));
        toast.success('Vehículo actualizado correctamente');
      }
    } catch (error) {
      console.error('Error en updateVehicle:', error);
      toast.error('Error al actualizar vehículo');
    }
  };
  
  const deleteVehicle = async (id: string) => {
    try {
      // Verificar si hay viajes asociados a este vehículo
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('id')
        .eq('vehicle_id', id);
      
      if (tripsError) {
        console.error('Error al verificar viajes:', tripsError);
        toast.error('Error al verificar viajes asociados');
        return;
      }
      
      if (tripsData && tripsData.length > 0) {
        toast.error('No se puede eliminar el vehículo porque tiene viajes asociados');
        return;
      }
      
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar vehículo:', error);
        toast.error('Error al eliminar vehículo');
      } else {
        setVehicles(prev => prev.filter(v => v.id !== id));
        toast.success('Vehículo eliminado correctamente');
      }
    } catch (error) {
      console.error('Error en deleteVehicle:', error);
      toast.error('Error al eliminar vehículo');
    }
  };
  
  // Funciones CRUD para viajes
  const addTrip = async (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar un viaje');
      return;
    }
    
    try {
      const newTrip = {
        ...trip,
        user_id: user.id,
        start_date: trip.startDate,
        end_date: trip.endDate,
        vehicle_id: trip.vehicleId
      };
      
      const { data, error } = await supabase
        .from('trips')
        .insert(newTrip)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al agregar viaje:', error);
        toast.error('Error al agregar viaje');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedTrip: Trip = {
          id: data.id,
          vehicleId: data.vehicle_id,
          userId: data.user_id,
          startDate: data.start_date,
          endDate: data.end_date,
          origin: data.origin,
          destination: data.destination,
          distance: data.distance,
          notes: data.notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setTrips(prev => [formattedTrip, ...prev]);
        toast.success('Viaje agregado correctamente');
      }
    } catch (error) {
      console.error('Error en addTrip:', error);
      toast.error('Error al agregar viaje');
    }
  };
  
  const updateTrip = async (id: string, trip: Partial<Trip>) => {
    try {
      // Convertir campos de camelCase a snake_case para la base de datos
      const dbTrip: any = { ...trip };
      
      if (trip.startDate) dbTrip.start_date = trip.startDate;
      if (trip.endDate) dbTrip.end_date = trip.endDate;
      if (trip.vehicleId) dbTrip.vehicle_id = trip.vehicleId;
      
      // Eliminar propiedades camelCase
      delete dbTrip.startDate;
      delete dbTrip.endDate;
      delete dbTrip.vehicleId;
      
      const { data, error } = await supabase
        .from('trips')
        .update(dbTrip)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al actualizar viaje:', error);
        toast.error('Error al actualizar viaje');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedTrip: Trip = {
          id: data.id,
          vehicleId: data.vehicle_id,
          userId: data.user_id,
          startDate: data.start_date,
          endDate: data.end_date,
          origin: data.origin,
          destination: data.destination,
          distance: data.distance,
          notes: data.notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setTrips(prev => prev.map(t => (t.id === id ? formattedTrip : t)));
        toast.success('Viaje actualizado correctamente');
      }
    } catch (error) {
      console.error('Error en updateTrip:', error);
      toast.error('Error al actualizar viaje');
    }
  };
  
  const deleteTrip = async (id: string) => {
    try {
      // Eliminar primero los gastos asociados
      const { error: expenseError } = await supabase
        .from('expenses')
        .delete()
        .eq('trip_id', id);
      
      if (expenseError) {
        console.error('Error al eliminar gastos asociados:', expenseError);
        toast.error('Error al eliminar gastos asociados');
        return;
      }
      
      // Eliminar cualquier registro de peaje asociado
      const { error: tollRecordError } = await supabase
        .from('toll_records')
        .delete()
        .eq('trip_id', id);
      
      if (tollRecordError) {
        console.error('Error al eliminar registros de peaje asociados:', tollRecordError);
        toast.error('Error al eliminar registros de peaje asociados');
        return;
      }
      
      // Finalmente eliminar el viaje
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar viaje:', error);
        toast.error('Error al eliminar viaje');
      } else {
        setTrips(prev => prev.filter(t => t.id !== id));
        
        // Actualizar las listas de gastos y registros de peajes
        setExpenses(prev => prev.filter(e => e.tripId !== id));
        setTollRecords(prev => prev.filter(r => r.tripId !== id));
        
        toast.success('Viaje eliminado correctamente');
      }
    } catch (error) {
      console.error('Error en deleteTrip:', error);
      toast.error('Error al eliminar viaje');
    }
  };
  
  // Funciones CRUD para gastos
  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar un gasto');
      return;
    }
    
    try {
      // Convertir campos de camelCase a snake_case para la base de datos
      const newExpense = {
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
        receipt_url: expense.receiptUrl,
        trip_id: expense.tripId,
        vehicle_id: expense.vehicleId,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('expenses')
        .insert(newExpense)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al agregar gasto:', error);
        toast.error('Error al agregar gasto');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedExpense: Expense = {
          id: data.id,
          tripId: data.trip_id,
          vehicleId: data.vehicle_id,
          userId: data.user_id,
          category: data.category,
          date: data.date,
          amount: data.amount,
          description: data.description,
          receiptUrl: data.receipt_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setExpenses(prev => [formattedExpense, ...prev]);
        toast.success('Gasto agregado correctamente');
      }
    } catch (error) {
      console.error('Error en addExpense:', error);
      toast.error('Error al agregar gasto');
    }
  };
  
  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      // Convertir campos de camelCase a snake_case para la base de datos
      const dbExpense: any = { ...expense };
      
      if (expense.tripId) dbExpense.trip_id = expense.tripId;
      if (expense.vehicleId) dbExpense.vehicle_id = expense.vehicleId;
      if (expense.receiptUrl) dbExpense.receipt_url = expense.receiptUrl;
      
      // Eliminar propiedades camelCase
      delete dbExpense.tripId;
      delete dbExpense.vehicleId;
      delete dbExpense.receiptUrl;
      
      const { data, error } = await supabase
        .from('expenses')
        .update(dbExpense)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al actualizar gasto:', error);
        toast.error('Error al actualizar gasto');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedExpense: Expense = {
          id: data.id,
          tripId: data.trip_id,
          vehicleId: data.vehicle_id,
          userId: data.user_id,
          category: data.category,
          date: data.date,
          amount: data.amount,
          description: data.description,
          receiptUrl: data.receipt_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setExpenses(prev => prev.map(e => (e.id === id ? formattedExpense : e)));
        toast.success('Gasto actualizado correctamente');
      }
    } catch (error) {
      console.error('Error en updateExpense:', error);
      toast.error('Error al actualizar gasto');
    }
  };
  
  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar gasto:', error);
        toast.error('Error al eliminar gasto');
      } else {
        setExpenses(prev => prev.filter(e => e.id !== id));
        toast.success('Gasto eliminado correctamente');
      }
    } catch (error) {
      console.error('Error en deleteExpense:', error);
      toast.error('Error al eliminar gasto');
    }
  };
  
  // Funciones CRUD para peajes
  const addToll = async (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar un peaje');
      return;
    }
    
    try {
      const newToll = {
        ...toll,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('tolls')
        .insert(newToll)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al agregar peaje:', error);
        toast.error('Error al agregar peaje');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedToll: Toll = {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          location: data.location,
          category: data.category,
          price: data.price,
          route: data.route,
          coordinates: data.coordinates,
          description: data.description,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setTolls(prev => [formattedToll, ...prev]);
        toast.success('Peaje agregado correctamente');
      }
    } catch (error) {
      console.error('Error en addToll:', error);
      toast.error('Error al agregar peaje');
    }
  };
  
  const updateToll = async (id: string, toll: Partial<Toll>) => {
    try {
      const { data, error } = await supabase
        .from('tolls')
        .update(toll)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al actualizar peaje:', error);
        toast.error('Error al actualizar peaje');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedToll: Toll = {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          location: data.location,
          category: data.category,
          price: data.price,
          route: data.route,
          coordinates: data.coordinates,
          description: data.description,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setTolls(prev => prev.map(t => (t.id === id ? formattedToll : t)));
        toast.success('Peaje actualizado correctamente');
      }
    } catch (error) {
      console.error('Error en updateToll:', error);
      toast.error('Error al actualizar peaje');
    }
  };
  
  const deleteToll = async (id: string) => {
    try {
      // Verificar si hay registros de peaje asociados
      const { data: recordsData, error: recordsError } = await supabase
        .from('toll_records')
        .select('id')
        .eq('toll_id', id);
      
      if (recordsError) {
        console.error('Error al verificar registros de peaje:', recordsError);
        toast.error('Error al verificar registros asociados');
        return;
      }
      
      if (recordsData && recordsData.length > 0) {
        toast.error('No se puede eliminar el peaje porque tiene registros asociados');
        return;
      }
      
      const { error } = await supabase
        .from('tolls')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar peaje:', error);
        toast.error('Error al eliminar peaje');
      } else {
        setTolls(prev => prev.filter(t => t.id !== id));
        toast.success('Peaje eliminado correctamente');
      }
    } catch (error) {
      console.error('Error en deleteToll:', error);
      toast.error('Error al eliminar peaje');
    }
  };
  
  // Funciones CRUD para registros de peajes
  const addTollRecord = async (tollRecord: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar un registro de peaje');
      return;
    }
    
    try {
      // Convertir campos de camelCase a snake_case para la base de datos
      const newTollRecord = {
        toll_id: tollRecord.tollId,
        trip_id: tollRecord.tripId,
        vehicle_id: tollRecord.vehicleId,
        user_id: user.id,
        date: tollRecord.date,
        price: tollRecord.price,
        payment_method: tollRecord.paymentMethod,
        receipt: tollRecord.receipt,
        notes: tollRecord.notes
      };
      
      const { data, error } = await supabase
        .from('toll_records')
        .insert(newTollRecord)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al agregar registro de peaje:', error);
        toast.error('Error al agregar registro de peaje');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedTollRecord: TollRecord = {
          id: data.id,
          tollId: data.toll_id,
          tripId: data.trip_id,
          vehicleId: data.vehicle_id,
          userId: data.user_id,
          date: data.date,
          price: data.price,
          paymentMethod: data.payment_method,
          receipt: data.receipt,
          notes: data.notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setTollRecords(prev => [formattedTollRecord, ...prev]);
        toast.success('Registro de peaje agregado correctamente');
      }
    } catch (error) {
      console.error('Error en addTollRecord:', error);
      toast.error('Error al agregar registro de peaje');
    }
  };
  
  const updateTollRecord = async (id: string, tollRecord: Partial<TollRecord>) => {
    try {
      // Convertir campos de camelCase a snake_case para la base de datos
      const dbTollRecord: any = { ...tollRecord };
      
      if (tollRecord.tollId) dbTollRecord.toll_id = tollRecord.tollId;
      if (tollRecord.tripId) dbTollRecord.trip_id = tollRecord.tripId;
      if (tollRecord.vehicleId) dbTollRecord.vehicle_id = tollRecord.vehicleId;
      if (tollRecord.paymentMethod) dbTollRecord.payment_method = tollRecord.paymentMethod;
      
      // Eliminar propiedades camelCase
      delete dbTollRecord.tollId;
      delete dbTollRecord.tripId;
      delete dbTollRecord.vehicleId;
      delete dbTollRecord.paymentMethod;
      
      const { data, error } = await supabase
        .from('toll_records')
        .update(dbTollRecord)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error al actualizar registro de peaje:', error);
        toast.error('Error al actualizar registro de peaje');
      } else {
        // Convertir los nombres de campos de snake_case a camelCase
        const formattedTollRecord: TollRecord = {
          id: data.id,
          tollId: data.toll_id,
          tripId: data.trip_id,
          vehicleId: data.vehicle_id,
          userId: data.user_id,
          date: data.date,
          price: data.price,
          paymentMethod: data.payment_method,
          receipt: data.receipt,
          notes: data.notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setTollRecords(prev => prev.map(r => (r.id === id ? formattedTollRecord : r)));
        toast.success('Registro de peaje actualizado correctamente');
      }
    } catch (error) {
      console.error('Error en updateTollRecord:', error);
      toast.error('Error al actualizar registro de peaje');
    }
  };
  
  const deleteTollRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('toll_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar registro de peaje:', error);
        toast.error('Error al eliminar registro de peaje');
      } else {
        setTollRecords(prev => prev.filter(r => r.id !== id));
        toast.success('Registro de peaje eliminado correctamente');
      }
    } catch (error) {
      console.error('Error en deleteTollRecord:', error);
      toast.error('Error al eliminar registro de peaje');
    }
  };
  
  const contextValue: DataContextType = {
    // Datos
    vehicles,
    trips,
    expenses,
    tolls,
    tollRecords,
    
    // Estados de carga
    isLoading,
    
    // Funciones para vehículos
    getVehicleById,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    // Funciones para viajes
    getTripById,
    addTrip,
    updateTrip,
    deleteTrip,
    
    // Funciones para gastos
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Funciones para peajes
    getTollById,
    addToll,
    updateToll,
    deleteToll,
    
    // Funciones para registros de peajes
    getTollRecordById,
    addTollRecord,
    updateTollRecord,
    deleteTollRecord,
    
    // Recargar datos
    reloadData
  };
  
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
