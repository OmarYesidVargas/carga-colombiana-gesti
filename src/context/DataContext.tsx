
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Trip, Expense } from '@/types';
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

interface DataContextType {
  vehicles: Vehicle[];
  trips: Trip[];
  expenses: Expense[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addTrip: (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'vehicleId'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getTripById: (id: string) => Trip | undefined;
  getExpenseById: (id: string) => Expense | undefined;
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Cargar datos al iniciar
  useEffect(() => {
    const loadData = () => {
      try {
        // Intenta cargar datos desde localStorage, si existen
        const storedVehicles = localStorage.getItem('vehicles');
        const storedTrips = localStorage.getItem('trips');
        const storedExpenses = localStorage.getItem('expenses');
        
        setVehicles(storedVehicles ? JSON.parse(storedVehicles) : initialVehicles);
        setTrips(storedTrips ? JSON.parse(storedTrips) : initialTrips);
        setExpenses(storedExpenses ? JSON.parse(storedExpenses) : initialExpenses);
      } catch (error) {
        console.error('Error loading data:', error);
        // Si hay error, usamos los datos iniciales
        setVehicles(initialVehicles);
        setTrips(initialTrips);
        setExpenses(initialExpenses);
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
    }
  }, [vehicles, trips, expenses, isLoading]);
  
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
  
  // Funciones para obtener elementos por ID
  const getVehicleById = (id: string) => {
    return vehicles.find((vehicle) => vehicle.id === id);
  };
  
  const getTripById = (id: string) => {
    return trips.find((trip) => trip.id === id);
  };
  
  const getExpenseById = (id: string) => {
    return expenses.find((expense) => expense.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        trips,
        expenses,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addTrip,
        updateTrip,
        deleteTrip,
        addExpense,
        updateExpense,
        deleteExpense,
        getVehicleById,
        getTripById,
        getExpenseById,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
