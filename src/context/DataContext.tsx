import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';
import { useVehicles } from '@/hooks/useVehicles';
import { useTrips } from '@/hooks/useTrips';
import { useExpenses } from '@/hooks/useExpenses';
import { useTolls } from '@/hooks/useTolls';
import { useTollRecords } from '@/hooks/useTollRecords';
import { toast } from 'sonner';

/**
 * Interfaz que define las propiedades y funciones disponibles en el contexto de datos
 */
interface DataContextType {
  // Vehículos
  vehicles: Vehicle[];
  getVehicleById: (id: string) => Vehicle | undefined;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Viajes
  trips: Trip[];
  getTripById: (id: string) => Trip | undefined;
  addTrip: (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  
  // Gastos
  expenses: Expense[];
  getExpenseById: (id: string) => Expense | undefined;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Expense | void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  
  // Peajes
  tolls: Toll[];
  getTollById: (id: string) => Toll | undefined;
  addToll: (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateToll: (id: string, toll: Partial<Toll>) => Promise<void>;
  deleteToll: (id: string) => Promise<void>;
  
  // Registros de peajes
  tollRecords: TollRecord[];
  getTollRecordById: (id: string) => TollRecord | undefined;
  addTollRecord: (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTollRecord: (id: string, record: Partial<TollRecord>) => Promise<void>;
  deleteTollRecord: (id: string) => Promise<void>;
  
  // Estado de carga
  isLoading: boolean;
  
  // Exportación a CSV
  exportToCSV: (data: any[], filename: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Hook personalizado para acceder al contexto de datos
 * @returns {DataContextType} Objeto con propiedades y funciones del contexto
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de un DataProvider');
  }
  return context;
};

/**
 * Proveedor de datos para la aplicación
 * Gestiona el estado y las operaciones CRUD para vehículos, viajes, gastos, etc.
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  // Usar los hooks personalizados para cada entidad
  const vehiclesHook = useVehicles(user, setIsLoading);
  const tripsHook = useTrips(user, setIsLoading);
  const expensesHook = useExpenses(user, setIsLoading);
  const tollsHook = useTolls(user, setIsLoading);
  const tollRecordsHook = useTollRecords(user, setIsLoading);
  
  // Efecto para limpiar datos cuando no hay usuario
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * Exporta datos a un archivo CSV
   * @param {any[]} data - Datos a exportar
   * @param {string} filename - Nombre del archivo
   */
  const exportToCSV = (data: any[], filename: string) => {
    // Validar datos
    if (!data || data.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    try {
      // Obtener encabezados (claves del primer objeto)
      const headers = Object.keys(data[0]);
      
      // Crear contenido CSV
      const csvRows = [];
      
      // Añadir encabezados
      csvRows.push(headers.join(','));
      
      // Añadir filas de datos
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          // Manejar valores especiales (cadenas con comas, nulos, etc.)
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') {
            // Escapar comillas y envolver en comillas si contiene comas
            const escaped = value.replace(/"/g, '""');
            return escaped.includes(',') ? `"${escaped}"` : escaped;
          }
          return value;
        });
        csvRows.push(values.join(','));
      }
      
      // Unir filas con saltos de línea
      const csvContent = csvRows.join('\n');
      
      // Crear blob y link para descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      
      // Añadir al DOM, simular clic y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Datos exportados a ${filename}.csv`);
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      toast.error('Error al exportar datos');
    }
  };
  
  // Combinar todos los hooks en un solo contexto
  const value: DataContextType = {
    // Vehículos
    ...vehiclesHook,
    
    // Viajes
    ...tripsHook,
    
    // Gastos
    ...expensesHook,
    
    // Peajes
    ...tollsHook,
    
    // Registros de peajes
    ...tollRecordsHook,
    
    // Estado global de carga
    isLoading,
    
    // Utilidad de exportación
    exportToCSV
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
