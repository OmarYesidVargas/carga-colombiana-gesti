// DataContext.tsx
// Este archivo implementa el contexto principal de datos de la aplicación,
// gestionando el estado global y las operaciones relacionadas con vehículos,
// viajes, gastos y peajes.

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';
// Importación de hooks personalizados para cada entidad
import { useVehicles } from '@/hooks/useVehicles';
import { useTrips } from '@/hooks/useTrips';
import { useExpenses } from '@/hooks/useExpenses';
import { useTolls } from '@/hooks/useTolls';
import { useTollRecords } from '@/hooks/useTollRecords';
import { Logger } from '@/utils/logger';
import { exportToCSVUtil } from '@/utils/export';
import { LoadingProvider, useLoading } from '@/hooks/useLoading';

// Interfaces que definen las operaciones disponibles para cada entidad
// Cada interface agrupa las operaciones relacionadas para mejor organización

// Operaciones relacionadas con vehículos
interface VehicleOperations {
  vehicles: Vehicle[];                      // Lista de vehículos
  getVehicleById: (id: string) => Vehicle | undefined;  // Buscar vehículo por ID
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;  // Agregar nuevo vehículo
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;  // Actualizar vehículo existente
  deleteVehicle: (id: string) => Promise<void>;  // Eliminar vehículo
}

// Operaciones relacionadas con viajes
interface TripOperations {
  trips: Trip[];
  getTripById: (id: string) => Trip | undefined;
  addTrip: (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

// Operaciones relacionadas con gastos
interface ExpenseOperations {
  expenses: Expense[];
  getExpenseById: (id: string) => Expense | undefined;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Expense | void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
}

// Operaciones relacionadas con peajes
interface TollOperations {
  tolls: Toll[];
  getTollById: (id: string) => Toll | undefined;
  addToll: (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateToll: (id: string, toll: Partial<Toll>) => Promise<void>;
  deleteToll: (id: string) => Promise<void>;
}

// Operaciones relacionadas con registros de peajes
interface TollRecordOperations {
  tollRecords: TollRecord[];
  getTollRecordById: (id: string) => TollRecord | undefined;
  addTollRecord: (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTollRecord: (id: string, record: Partial<TollRecord>) => Promise<void>;
  deleteTollRecord: (id: string) => Promise<void>;
}

// Interface principal que combina todas las operaciones
interface DataContextType extends 
  VehicleOperations,
  TripOperations,
  ExpenseOperations,
  TollOperations,
  TollRecordOperations {
  isLoading: boolean;  // Estado de carga global
  exportToCSV: (data: any[], filename: string) => void;  // Utilidad de exportación
}

// Creación del contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto de datos
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    Logger.error('useData debe usarse dentro de un DataProvider');
    throw new Error('useData debe usarse dentro de un DataProvider');
  }
  return context;
};

// Proveedor principal de datos de la aplicación
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();  // Obtiene el usuario autenticado
  const { isLoading, setLoading } = useLoading();  // Estado de carga global

  Logger.info('Inicializando DataProvider', { user: user?.email });

  // Inicialización de hooks para cada entidad
  const vehiclesHook = useVehicles(user, setLoading);
  const tripsHook = useTrips(user, setLoading);
  const expensesHook = useExpenses(user, setLoading);
  const tollsHook = useTolls(user, setLoading);
  const tollRecordsHook = useTollRecords(user, setLoading);

  // Funciones memorizadas para obtener entidades por ID
  // Se utiliza useMemo para evitar recálculos innecesarios
  const getVehicleById = useMemo(() => 
    (id: string) => vehiclesHook.vehicles.find(v => v.id === id),
    [vehiclesHook.vehicles]
  );

  const getTripById = useMemo(() => 
    (id: string) => tripsHook.trips.find(t => t.id === id),
    [tripsHook.trips]
  );

  const getExpenseById = useMemo(() => 
    (id: string) => expensesHook.expenses.find(e => e.id === id),
    [expensesHook.expenses]
  );

  const getTollById = useMemo(() => 
    (id: string) => tollsHook.tolls.find(t => t.id === id),
    [tollsHook.tolls]
  );

  const getTollRecordById = useMemo(() => 
    (id: string) => tollRecordsHook.tollRecords.find(t => t.id === id),
    [tollRecordsHook.tollRecords]
  );

  // Memorización del valor del contexto para evitar renderizados innecesarios
  const contextValue = useMemo(() => ({
    // Agrupación de todas las operaciones y estados
    // Vehículos
    vehicles: vehiclesHook.vehicles,
    getVehicleById,
    addVehicle: vehiclesHook.addVehicle,
    updateVehicle: vehiclesHook.updateVehicle,
    deleteVehicle: vehiclesHook.deleteVehicle,

    // Viajes
    trips: tripsHook.trips,
    getTripById,
    addTrip: tripsHook.addTrip,
    updateTrip: tripsHook.updateTrip,
    deleteTrip: tripsHook.deleteTrip,

    // Gastos
    expenses: expensesHook.expenses,
    getExpenseById,
    addExpense: expensesHook.addExpense,
    updateExpense: expensesHook.updateExpense,
    deleteExpense: expensesHook.deleteExpense,

    // Peajes
    tolls: tollsHook.tolls,
    getTollById,
    addToll: tollsHook.addToll,
    updateToll: tollsHook.updateToll,
    deleteToll: tollsHook.deleteToll,

    // Registros de peajes
    tollRecords: tollRecordsHook.tollRecords,
    getTollRecordById,
    addTollRecord: tollRecordsHook.addTollRecord,
    updateTollRecord: tollRecordsHook.updateTollRecord,
    deleteTollRecord: tollRecordsHook.deleteTollRecord,

    // Estado y utilidades
    isLoading,
    exportToCSV: exportToCSVUtil
  }), [
    // Dependencias para la memorización
    vehiclesHook,
    tripsHook,
    expensesHook,
    tollsHook,
    tollRecordsHook,
    isLoading,
    getVehicleById,
    getTripById,
    getExpenseById,
    getTollById,
    getTollRecordById
  ]);

  // Registro de debug para monitoreo del estado
  Logger.debug('Actualización del estado del DataProvider', {
    vehicles: vehiclesHook.vehicles.length,
    trips: tripsHook.trips.length,
    expenses: expensesHook.expenses.length,
    tolls: tollsHook.tolls.length,
    tollRecords: tollRecordsHook.tollRecords.length,
    isLoading
  });

  return (
    <LoadingProvider>
      <DataContext.Provider value={contextValue}>
        {children}
      </DataContext.Provider>
    </LoadingProvider>
  );
};
