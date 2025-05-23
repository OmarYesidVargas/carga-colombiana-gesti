
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Expense } from '@/types';

/**
 * Hook personalizado para gestionar filtros de gastos
 * @param {Expense[]} expenses - Lista de gastos a filtrar
 * @returns {Object} Estados y funciones para filtrar gastos
 */
export const useExpenseFilters = (expenses: Expense[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | 'all'>('all');
  const [selectedTripId, setSelectedTripId] = useState<string | 'all'>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Resetear filtros al cambiar de pestaña
  useEffect(() => {
    if (activeTab === 'all') {
      setSelectedVehicleId('all');
      setSelectedTripId('all');
    }
  }, [activeTab]);
  
  // Función para resetear todos los filtros
  const resetAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedVehicleId('all');
    setSelectedTripId('all');
    setActiveTab('all');
  }, []);
  
  /**
   * Filtra los gastos según los criterios seleccionados
   */
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Filtrar por búsqueda de texto
      const matchesSearch = searchTerm === '' || 
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrar por vehículo
      const matchesVehicle = selectedVehicleId === 'all' || expense.vehicleId === selectedVehicleId;
      
      // Filtrar por viaje
      const matchesTrip = selectedTripId === 'all' || expense.tripId === selectedTripId;
      
      // Si estamos en una pestaña específica, filtrar por categoría también
      const matchesCategory = activeTab === 'all' || expense.category === activeTab;
      
      return matchesSearch && matchesVehicle && matchesTrip && matchesCategory;
    });
  }, [expenses, searchTerm, selectedVehicleId, selectedTripId, activeTab]);
  
  /**
   * Agrupa los gastos por categoría
   */
  const expensesByCategory = useMemo(() => {
    const categories = ['fuel', 'toll', 'maintenance', 'lodging', 'food', 'other'];
    const result: Record<string, Expense[]> = {};
    
    categories.forEach((category) => {
      result[category] = filteredExpenses.filter((expense) => expense.category === category);
    });
    
    return result;
  }, [filteredExpenses]);

  // Indicador de si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || selectedVehicleId !== 'all' || selectedTripId !== 'all';
  }, [searchTerm, selectedVehicleId, selectedTripId]);
  
  return {
    // Estados
    searchTerm,
    selectedVehicleId,
    selectedTripId,
    activeTab,
    isFilterOpen,
    filteredExpenses,
    expensesByCategory,
    hasActiveFilters,
    
    // Acciones
    setSearchTerm,
    setSelectedVehicleId,
    setSelectedTripId,
    setActiveTab,
    setIsFilterOpen,
    resetAllFilters
  };
};
