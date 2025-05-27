
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Expense, Vehicle, Trip } from '@/types';

/**
 * Hook optimizado para filtros de gastos con debugging avanzado
 * Incluye memoización para optimizar rendimiento
 */
export const useExpenseFilters = (
  expenses: Expense[], 
  vehicles: Vehicle[], 
  trips: Trip[]
) => {
  console.log('🔧 [useExpenseFilters] Inicializando filtros con:', {
    expenses: expenses.length,
    vehicles: vehicles.length,
    trips: trips.length
  });

  // Estados de filtros con debugging
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | 'all'>('all');
  const [selectedTripId, setSelectedTripId] = useState<string | 'all'>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debugging de cambios en filtros
  useEffect(() => {
    console.log('🔍 [useExpenseFilters] Filtros actualizados:', {
      searchTerm,
      selectedVehicleId,
      selectedTripId,
      activeTab,
      isFilterOpen
    });
  }, [searchTerm, selectedVehicleId, selectedTripId, activeTab, isFilterOpen]);

  // Gastos filtrados con optimización y debugging
  const filteredExpenses = useMemo(() => {
    const startTime = performance.now();
    
    console.log('📊 [useExpenseFilters] Aplicando filtros...');
    
    let filtered = [...expenses];
    
    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(expense => {
        const vehicle = vehicles.find(v => v.id === expense.vehicleId);
        const trip = trips.find(t => t.id === expense.tripId);
        
        const matchesDescription = expense.description?.toLowerCase().includes(searchLower);
        const matchesVehicle = vehicle?.plate?.toLowerCase().includes(searchLower) ||
                              vehicle?.brand?.toLowerCase().includes(searchLower) ||
                              vehicle?.model?.toLowerCase().includes(searchLower);
        const matchesTrip = trip?.origin?.toLowerCase().includes(searchLower) ||
                           trip?.destination?.toLowerCase().includes(searchLower);
        const matchesCategory = expense.category?.toLowerCase().includes(searchLower);
        
        return matchesDescription || matchesVehicle || matchesTrip || matchesCategory;
      });
    }
    
    // Filtro por vehículo
    if (selectedVehicleId !== 'all') {
      filtered = filtered.filter(expense => expense.vehicleId === selectedVehicleId);
    }
    
    // Filtro por viaje
    if (selectedTripId !== 'all') {
      filtered = filtered.filter(expense => expense.tripId === selectedTripId);
    }
    
    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const endTime = performance.now();
    console.log(`✅ [useExpenseFilters] Filtrado completado en ${(endTime - startTime).toFixed(2)}ms:`, {
      original: expenses.length,
      filtered: filtered.length,
      filters: { searchTerm, selectedVehicleId, selectedTripId, activeTab }
    });
    
    return filtered;
  }, [expenses, vehicles, trips, searchTerm, selectedVehicleId, selectedTripId]);

  // Gastos agrupados por categoría con optimización
  const expensesByCategory = useMemo(() => {
    console.log('📋 [useExpenseFilters] Agrupando gastos por categoría...');
    
    const grouped = filteredExpenses.reduce((acc, expense) => {
      const category = expense.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(expense);
      return acc;
    }, {} as Record<string, Expense[]>);
    
    console.log('✅ [useExpenseFilters] Agrupación completada:', 
      Object.entries(grouped).map(([cat, exps]) => `${cat}: ${exps.length}`).join(', ')
    );
    
    return grouped;
  }, [filteredExpenses]);

  // Funciones de limpieza optimizadas
  const clearFilters = useCallback(() => {
    console.log('🧹 [useExpenseFilters] Limpiando todos los filtros');
    setSearchTerm('');
    setSelectedVehicleId('all');
    setSelectedTripId('all');
    setActiveTab('all');
    setIsFilterOpen(false);
  }, []);

  const resetSearch = useCallback(() => {
    console.log('🔄 [useExpenseFilters] Reseteando búsqueda');
    setSearchTerm('');
  }, []);

  // Estadísticas optimizadas
  const filterStats = useMemo(() => {
    const stats = {
      total: expenses.length,
      filtered: filteredExpenses.length,
      categories: Object.keys(expensesByCategory).length,
      hasActiveFilters: searchTerm.trim() !== '' || selectedVehicleId !== 'all' || selectedTripId !== 'all' || activeTab !== 'all'
    };
    
    console.log('📈 [useExpenseFilters] Estadísticas de filtros:', stats);
    return stats;
  }, [expenses.length, filteredExpenses.length, expensesByCategory, searchTerm, selectedVehicleId, selectedTripId, activeTab]);

  return {
    // Estados
    searchTerm,
    setSearchTerm,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedTripId,
    setSelectedTripId,
    activeTab,
    setActiveTab,
    isFilterOpen,
    setIsFilterOpen,
    
    // Datos filtrados
    filteredExpenses,
    expensesByCategory,
    
    // Utilidades
    clearFilters,
    resetSearch,
    filterStats
  };
};
