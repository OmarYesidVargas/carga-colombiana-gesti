
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
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
 * Interfaz optimizada que define las propiedades y funciones disponibles en el contexto de datos
 * Incluye debugging y optimizaciones de rendimiento
 */
interface DataContextType {
  // Vehículos - Optimizado con memoización
  vehicles: Vehicle[];
  getVehicleById: (id: string) => Vehicle | undefined;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Viajes - Con validación mejorada
  trips: Trip[];
  getTripById: (id: string) => Trip | undefined;
  addTrip: (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  
  // Gastos - Con debugging mejorado
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
  
  // Estado optimizado
  isLoading: boolean;
  
  // Exportación optimizada
  exportToCSV: (data: any[], filename: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Hook optimizado para acceder al contexto de datos con debugging
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    console.error('🚨 [DataContext] useData debe usarse dentro de un DataProvider');
    throw new Error('useData debe usarse dentro de un DataProvider');
  }
  return context;
};

/**
 * Proveedor de datos optimizado con debugging avanzado y manejo de errores mejorado
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  console.log('🔄 [DataProvider] Inicializando DataProvider');
  
  // Manejo optimizado de autenticación con debugging
  let user;
  try {
    const authContext = useAuth();
    user = authContext.user;
    console.log('✅ [DataProvider] Usuario obtenido:', user?.email || 'No autenticado');
  } catch (error) {
    console.error('🚨 [DataProvider] Error al obtener AuthContext:', error);
    user = null;
  }
  
  // Hooks optimizados con debugging mejorado
  const vehiclesHook = useVehicles(user, setIsLoading);
  const tripsHook = useTrips(user, setIsLoading);
  const expensesHook = useExpenses(user, setIsLoading);
  const tollsHook = useTolls(user, setIsLoading);
  const tollRecordsHook = useTollRecords(user, setIsLoading);
  
  // Memoización de funciones getter para optimizar rendimiento
  const getVehicleById = useCallback((id: string) => {
    console.log('🔍 [DataProvider] Buscando vehículo:', id);
    const vehicle = vehiclesHook.vehicles.find(v => v.id === id);
    console.log(vehicle ? '✅ Vehículo encontrado' : '❌ Vehículo no encontrado');
    return vehicle;
  }, [vehiclesHook.vehicles]);
  
  const getTripById = useCallback((id: string) => {
    console.log('🔍 [DataProvider] Buscando viaje:', id);
    const trip = tripsHook.trips.find(t => t.id === id);
    console.log(trip ? '✅ Viaje encontrado' : '❌ Viaje no encontrado');
    return trip;
  }, [tripsHook.trips]);
  
  const getExpenseById = useCallback((id: string) => {
    console.log('🔍 [DataProvider] Buscando gasto:', id);
    const expense = expensesHook.expenses.find(e => e.id === id);
    console.log(expense ? '✅ Gasto encontrado' : '❌ Gasto no encontrado');
    return expense;
  }, [expensesHook.expenses]);
  
  const getTollById = useCallback((id: string) => {
    console.log('🔍 [DataProvider] Buscando peaje:', id);
    const toll = tollsHook.tolls.find(t => t.id === id);
    console.log(toll ? '✅ Peaje encontrado' : '❌ Peaje no encontrado');
    return toll;
  }, [tollsHook.tolls]);
  
  const getTollRecordById = useCallback((id: string) => {
    console.log('🔍 [DataProvider] Buscando registro de peaje:', id);
    const record = tollRecordsHook.tollRecords.find(r => r.id === id);
    console.log(record ? '✅ Registro encontrado' : '❌ Registro no encontrado');
    return record;
  }, [tollRecordsHook.tollRecords]);
  
  // Efecto optimizado para limpiar datos
  useEffect(() => {
    if (!user) {
      console.log('🧹 [DataProvider] Limpiando datos - usuario no autenticado');
      setIsLoading(false);
    } else {
      console.log('👤 [DataProvider] Usuario autenticado, cargando datos...');
    }
  }, [user]);
  
  /**
   * Función optimizada de exportación con manejo de errores mejorado y debugging
   */
  const exportToCSV = useCallback((data: any[], filename: string) => {
    console.log('📊 [DataProvider] Iniciando exportación:', { filename, recordCount: data.length });
    
    // Validación mejorada
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('🚨 [DataProvider] Error en exportación: Datos inválidos o vacíos');
      toast.error('No hay datos válidos para exportar');
      return;
    }
    
    try {
      const startTime = performance.now();
      
      // Procesamiento optimizado de datos
      const processedData = data.map((item, index) => {
        try {
          // Limpiar valores undefined/null para mejor compatibilidad
          const cleanItem = Object.keys(item).reduce((acc, key) => {
            const value = item[key];
            acc[key] = value === null || value === undefined ? '' : value;
            return acc;
          }, {} as any);
          
          return cleanItem;
        } catch (itemError) {
          console.error(`🚨 [DataProvider] Error procesando item ${index}:`, itemError);
          return item; // Usar item original como fallback
        }
      });
      
      // Crear worksheet con opciones optimizadas
      const worksheet = XLSX.utils.json_to_sheet(processedData, {
        header: Object.keys(processedData[0] || {}),
        skipHeader: false
      });
      
      // Configurar anchos de columna automáticos
      const colWidths = Object.keys(processedData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15) // Ancho mínimo de 15 caracteres
      }));
      worksheet['!cols'] = colWidths;
      
      // Crear workbook optimizado
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      
      // Escribir con compresión
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        compression: true,
        Props: {
          Title: filename,
          CreatedDate: new Date()
        }
      });
      
      // Crear y descargar blob
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.xlsx`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const endTime = performance.now();
      console.log(`✅ [DataProvider] Exportación completada en ${(endTime - startTime).toFixed(2)}ms`);
      toast.success(`Datos exportados exitosamente: ${filename}.xlsx`);
      
    } catch (error) {
      console.error('🚨 [DataProvider] Error crítico en exportación:', error);
      toast.error('Error al exportar datos. Inténtalo de nuevo.');
    }
  }, []);
  
  // Memoización del valor del contexto para optimizar re-renders
  const contextValue = useMemo(() => ({
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
    
    // Estado
    isLoading,
    
    // Utilidades
    exportToCSV
  }), [
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
    getTollRecordById,
    exportToCSV
  ]);
  
  console.log('🎯 [DataProvider] Renderizando con datos:', {
    vehicles: vehiclesHook.vehicles.length,
    trips: tripsHook.trips.length,
    expenses: expensesHook.expenses.length,
    tolls: tollsHook.tolls.length,
    tollRecords: tollRecordsHook.tollRecords.length,
    isLoading
  });
  
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
