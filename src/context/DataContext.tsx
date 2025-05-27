import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Vehicle, Trip, Expense, Toll, TollRecord } from '@/types';
import { useVehicles } from '@/hooks/useVehicles';
import { useTrips } from '@/hooks/useTrips';
import { useExpenses } from '@/hooks/useExpenses';
import { useTolls } from '@/hooks/useTolls';
import { useTollRecords } from '@/hooks/useTollRecords';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
   * Exporta datos a un archivo XLSX con codificación UTF-8 para soportar caracteres especiales
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
      // Crear una nueva hoja de trabajo con los datos
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Crear un nuevo libro de trabajo
      const workbook = XLSX.utils.book_new();
      
      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      
      // Configurar opciones para XLSX con codificación UTF-8
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        compression: true
      });
      
      // Crear blob con tipo MIME correcto para XLSX
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      
      // Crear enlace de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.xlsx`);
      link.style.visibility = 'hidden';
      
      // Añadir al DOM, simular clic y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Datos exportados a ${filename}.xlsx`);
    } catch (error) {
      console.error('Error al exportar a XLSX:', error);
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
