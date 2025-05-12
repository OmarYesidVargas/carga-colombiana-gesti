import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Datos iniciales
const initialVehicles: Vehicle[] = [
  {
    id: '1',
    userId: '1',
    plate: 'ABC123',
    brand: 'Kenworth',
    model: 'T800',
    year: 2020,
    color: 'Azul',
    fuelType: 'diesel',
    capacity: '30 Toneladas',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    userId: '1',
    plate: 'XYZ789',
    brand: 'Freightliner',
    model: 'Cascadia',
    year: 2021,
    color: 'Blanco',
    fuelType: 'diesel',
    capacity: '25 Toneladas',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-20'),
  },
];

const initialTrips: Trip[] = [
  {
    id: '1',
    vehicleId: '1',
    userId: '1',
    startDate: new Date('2023-05-10'),
    endDate: new Date('2023-05-15'),
    origin: 'Bogotá',
    destination: 'Medellín',
    distance: 415,
    notes: 'Entrega de mercancía para Almacenes Éxito',
    createdAt: new Date('2023-05-09'),
    updatedAt: new Date('2023-05-09'),
  },
  {
    id: '2',
    vehicleId: '2',
    userId: '1',
    startDate: new Date('2023-06-05'),
    endDate: new Date('2023-06-08'),
    origin: 'Cali',
    destination: 'Barranquilla',
    distance: 1050,
    notes: 'Transporte de materiales de construcción',
    createdAt: new Date('2023-06-04'),
    updatedAt: new Date('2023-06-04'),
  },
  {
    id: '3',
    vehicleId: '1',
    userId: '1',
    startDate: new Date('2023-07-12'),
    endDate: new Date('2023-07-15'),
    origin: 'Bogotá',
    destination: 'Bucaramanga',
    distance: 398,
    notes: 'Entrega urgente',
    createdAt: new Date('2023-07-11'),
    updatedAt: new Date('2023-07-11'),
  },
];

const initialExpenses: Expense[] = [
  {
    id: '1',
    tripId: '1',
    userId: '1',
    vehicleId: '1',
    category: 'fuel',
    date: new Date('2023-05-10'),
    amount: 450000,
    description: 'Tanque completo al inicio del viaje',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10'),
  },
  {
    id: '2',
    tripId: '1',
    userId: '1',
    vehicleId: '1',
    category: 'toll',
    date: new Date('2023-05-11'),
    amount: 65000,
    description: 'Peajes en la ruta Bogotá-Medellín',
    createdAt: new Date('2023-05-11'),
    updatedAt: new Date('2023-05-11'),
  },
  {
    id: '3',
    tripId: '1',
    userId: '1',
    vehicleId: '1',
    category: 'maintenance',
    date: new Date('2023-05-12'),
    amount: 120000,
    description: 'Cambio de aceite y filtros',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-05-12'),
  },
  {
    id: '4',
    tripId: '2',
    userId: '1',
    vehicleId: '2',
    category: 'fuel',
    date: new Date('2023-06-05'),
    amount: 520000,
    description: 'Combustible para el viaje',
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-05'),
  },
  {
    id: '5',
    tripId: '2',
    userId: '1',
    vehicleId: '2',
    category: 'lodging',
    date: new Date('2023-06-06'),
    amount: 150000,
    description: 'Hotel en Montería',
    createdAt: new Date('2023-06-06'),
    updatedAt: new Date('2023-06-06'),
  },
  {
    id: '6',
    tripId: '3',
    userId: '1',
    vehicleId: '1',
    category: 'fuel',
    date: new Date('2023-07-12'),
    amount: 400000,
    description: 'Combustible',
    createdAt: new Date('2023-07-12'),
    updatedAt: new Date('2023-07-12'),
  },
  {
    id: '7',
    tripId: '3',
    userId: '1',
    vehicleId: '1',
    category: 'food',
    date: new Date('2023-07-13'),
    amount: 85000,
    description: 'Alimentación durante el viaje',
    createdAt: new Date('2023-07-13'),
    updatedAt: new Date('2023-07-13'),
  },
  {
    id: '8',
    tripId: '3',
    userId: '1',
    vehicleId: '1',
    category: 'toll',
    date: new Date('2023-07-13'),
    amount: 75000,
    description: 'Peajes en la ruta',
    createdAt: new Date('2023-07-13'),
    updatedAt: new Date('2023-07-13'),
  },
];

// Datos iniciales para peajes
const initialTolls: Toll[] = [
  {
    id: '1',
    userId: '1',
    name: 'Peaje Chusacá',
    location: 'Cundinamarca',
    category: 'I',
    price: 8500,
    route: 'Bogotá-Girardot',
    coordinates: '4.5371, -74.2861',
    description: 'Peaje ubicado en la vía Bogotá-Girardot',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
  {
    id: '2',
    userId: '1',
    name: 'Peaje Chinauta',
    location: 'Cundinamarca',
    category: 'I',
    price: 10500,
    route: 'Bogotá-Girardot',
    coordinates: '4.3149, -74.4514',
    description: 'Peaje ubicado en la vía Bogotá-Girardot',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
  {
    id: '3',
    userId: '1',
    name: 'Peaje Túnel de La Línea',
    location: 'Quindío',
    category: 'II',
    price: 15800,
    route: 'Armenia-Ibagué',
    coordinates: '4.5131, -75.5576',
    description: 'Peaje del Túnel de La Línea, vía Armenia-Ibagué',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
];

// Datos iniciales para registros de peajes
const initialTollRecords: TollRecord[] = [
  {
    id: '1',
    userId: '1',
    tripId: '1',
    vehicleId: '1',
    tollId: '1',
    date: new Date('2023-05-10'),
    price: 8500,
    paymentMethod: 'efectivo',
    receipt: '12345678',
    notes: 'Paso por peaje Chusacá',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10'),
  },
  {
    id: '2',
    userId: '1',
    tripId: '1',
    vehicleId: '1',
    tollId: '2',
    date: new Date('2023-05-10'),
    price: 10500,
    paymentMethod: 'electrónico',
    receipt: '87654321',
    notes: 'Paso por peaje Chinauta',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10'),
  },
  {
    id: '3',
    userId: '1',
    tripId: '2',
    vehicleId: '2',
    tollId: '3',
    date: new Date('2023-06-05'),
    price: 15800,
    paymentMethod: 'tag',
    notes: 'Paso por peaje Túnel de La Línea',
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-05'),
  },
];

interface DataContextType {
  vehicles: Vehicle[];
  trips: Trip[];
  expenses: Expense[];
  tolls: Toll[];
  tollRecords: TollRecord[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addTrip: (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'vehicleId'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addToll: (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateToll: (id: string, toll: Partial<Toll>) => void;
  deleteToll: (id: string) => void;
  addTollRecord: (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTollRecord: (id: string, record: Partial<TollRecord>) => void;
  deleteTollRecord: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getTripById: (id: string) => Trip | undefined;
  getExpenseById: (id: string) => Expense | undefined;
  getTollById: (id: string) => Toll | undefined;
  getTollRecordById: (id: string) => TollRecord | undefined;
  isLoading: boolean;
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

export const DataProvider = ({ children }: DataProviderProps) => {
  const { user } = useAuth();
  const userId = user?.id || '1'; // Usamos un ID predeterminado si no hay usuario
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tolls, setTolls] = useState<Toll[]>([]);
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cargar datos al iniciar
  useEffect(() => {
    const loadData = () => {
      try {
        // Intenta cargar datos desde localStorage, si existen
        const storedVehicles = localStorage.getItem('vehicles');
        const storedTrips = localStorage.getItem('trips');
        const storedExpenses = localStorage.getItem('expenses');
        const storedTolls = localStorage.getItem('tolls');
        const storedTollRecords = localStorage.getItem('tollRecords');
        
        setVehicles(storedVehicles ? JSON.parse(storedVehicles) : initialVehicles);
        setTrips(storedTrips ? JSON.parse(storedTrips) : initialTrips);
        setExpenses(storedExpenses ? JSON.parse(storedExpenses) : initialExpenses);
        setTolls(storedTolls ? JSON.parse(storedTolls) : initialTolls);
        setTollRecords(storedTollRecords ? JSON.parse(storedTollRecords) : initialTollRecords);
      } catch (error) {
        console.error('Error loading data:', error);
        // Si hay error, usamos los datos iniciales
        setVehicles(initialVehicles);
        setTrips(initialTrips);
        setExpenses(initialExpenses);
        setTolls(initialTolls);
        setTollRecords(initialTollRecords);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('vehicles', JSON.stringify(vehicles));
      localStorage.setItem('trips', JSON.stringify(trips));
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('tolls', JSON.stringify(tolls));
      localStorage.setItem('tollRecords', JSON.stringify(tollRecords));
    }
  }, [vehicles, trips, expenses, tolls, tollRecords, isLoading]);
  
  // Funciones para gestionar vehículos
  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `v-${Date.now()}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    setVehicles([...vehicles, newVehicle]);
    toast.success('Vehículo agregado exitosamente');
  };
  
  const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, ...vehicleData, updatedAt: new Date() }
          : vehicle
      )
    );
    toast.success('Vehículo actualizado exitosamente');
  };
  
  const deleteVehicle = (id: string) => {
    // Verificar si hay viajes relacionados
    const relatedTrips = trips.filter((trip) => trip.vehicleId === id);
    
    if (relatedTrips.length > 0) {
      toast.error('No se puede eliminar el vehículo porque tiene viajes asociados');
      return;
    }
    
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    toast.success('Vehículo eliminado exitosamente');
  };
  
  // Funciones para gestionar viajes
  const addTrip = (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTrip: Trip = {
      ...trip,
      id: `t-${Date.now()}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    setTrips([...trips, newTrip]);
    toast.success('Viaje agregado exitosamente');
  };
  
  const updateTrip = (id: string, tripData: Partial<Trip>) => {
    setTrips(
      trips.map((trip) =>
        trip.id === id
          ? { ...trip, ...tripData, updatedAt: new Date() }
          : trip
      )
    );
    toast.success('Viaje actualizado exitosamente');
  };
  
  const deleteTrip = (id: string) => {
    // Verificar si hay gastos relacionados
    const relatedExpenses = expenses.filter((expense) => expense.tripId === id);
    
    // Si hay gastos relacionados, también los eliminamos
    if (relatedExpenses.length > 0) {
      setExpenses(expenses.filter((expense) => expense.tripId !== id));
    }
    
    setTrips(trips.filter((trip) => trip.id !== id));
    toast.success('Viaje eliminado exitosamente');
  };
  
  // Funciones para gestionar gastos
  const addExpense = (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'vehicleId'>) => {
    const trip = trips.find((t) => t.id === expense.tripId);
    
    if (!trip) {
      toast.error('El viaje seleccionado no existe');
      return;
    }
    
    const now = new Date();
    const newExpense: Expense = {
      ...expense,
      id: `e-${Date.now()}`,
      userId,
      vehicleId: trip.vehicleId, // Obtenemos el vehicleId desde el viaje
      createdAt: now,
      updatedAt: now,
    };
    
    setExpenses([...expenses, newExpense]);
    toast.success('Gasto agregado exitosamente');
  };
  
  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    // Si se está cambiando el tripId, actualizamos también el vehicleId
    if (expenseData.tripId) {
      const trip = trips.find((t) => t.id === expenseData.tripId);
      if (trip) {
        expenseData.vehicleId = trip.vehicleId;
      }
    }
    
    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? { ...expense, ...expenseData, updatedAt: new Date() }
          : expense
      )
    );
    toast.success('Gasto actualizado exitosamente');
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast.success('Gasto eliminado exitosamente');
  };
  
  // Funciones para gestionar peajes
  const addToll = (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newToll: Toll = {
      ...toll,
      id: `toll-${Date.now()}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    setTolls([...tolls, newToll]);
    toast.success('Peaje agregado exitosamente');
  };
  
  const updateToll = (id: string, tollData: Partial<Toll>) => {
    setTolls(
      tolls.map((toll) =>
        toll.id === id
          ? { ...toll, ...tollData, updatedAt: new Date() }
          : toll
      )
    );
    toast.success('Peaje actualizado exitosamente');
  };
  
  const deleteToll = (id: string) => {
    // Verificar si hay registros de peaje relacionados
    const relatedRecords = tollRecords.filter((record) => record.tollId === id);
    
    if (relatedRecords.length > 0) {
      toast.error('No se puede eliminar el peaje porque tiene registros asociados');
      return;
    }
    
    setTolls(tolls.filter((toll) => toll.id !== id));
    toast.success('Peaje eliminado exitosamente');
  };
  
  const getTollById = (id: string) => {
    return tolls.find((toll) => toll.id === id);
  };
  
  // Funciones para gestionar registros de peaje
  const addTollRecord = (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newRecord: TollRecord = {
      ...record,
      id: `tollRec-${Date.now()}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    setTollRecords([...tollRecords, newRecord]);
    toast.success('Registro de peaje agregado exitosamente');
  };
  
  const updateTollRecord = (id: string, recordData: Partial<TollRecord>) => {
    setTollRecords(
      tollRecords.map((record) =>
        record.id === id
          ? { ...record, ...recordData, updatedAt: new Date() }
          : record
      )
    );
    toast.success('Registro de peaje actualizado exitosamente');
  };
  
  const deleteTollRecord = (id: string) => {
    setTollRecords(tollRecords.filter((record) => record.id !== id));
    toast.success('Registro de peaje eliminado exitosamente');
  };
  
  const getTollRecordById = (id: string) => {
    return tollRecords.find((record) => record.id === id);
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
