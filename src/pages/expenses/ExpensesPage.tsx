
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Expense } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

// Componentes
import ExpenseSummary from '@/components/reports/ExpenseSummary';
import ExpenseHeader from '@/components/expenses/ExpenseHeader';
import ExpenseFilters from '@/components/expenses/ExpenseFilters';
import ExpensesList from '@/components/expenses/ExpensesList';
import ExpenseDialogs from '@/components/expenses/ExpenseDialogs';

// Hooks
import { useExpenseFilters } from '@/hooks/useExpenseFilters';

/**
 * Página de gestión de gastos
 * Permite visualizar, crear, editar y eliminar gastos
 */
const ExpensesPage = () => {
  const { expenses, trips, vehicles, addExpense, updateExpense, deleteExpense, exportToCSV } = useData();
  
  // Estados para el formulario y diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Usar el hook personalizado para filtros
  const {
    searchTerm,
    selectedVehicleId,
    selectedTripId,
    activeTab,
    isFilterOpen,
    filteredExpenses,
    expensesByCategory,
    setSearchTerm,
    setSelectedVehicleId,
    setSelectedTripId,
    setActiveTab,
    setIsFilterOpen
  } = useExpenseFilters(expenses);
  
  /**
   * Abre el formulario para crear o editar un gasto
   * @param {Expense} [expense] - Gasto a editar (si aplica)
   */
  const handleOpenForm = (expense?: Expense) => {
    if (expense) {
      setCurrentExpense(expense);
    } else {
      setCurrentExpense(null);
    }
    setIsFormOpen(true);
  };
  
  /**
   * Cierra el formulario de gastos
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentExpense(null);
  };
  
  /**
   * Maneja el envío del formulario de gastos
   * @param {any} data - Datos del formulario
   */
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Convertir amount a número
      const expenseData = {
        ...data,
        amount: parseFloat(data.amount),
        // Añadir vehicleId del viaje seleccionado
        vehicleId: trips.find(trip => trip.id === data.tripId)?.vehicleId
      };
      
      if (currentExpense) {
        await updateExpense(currentExpense.id, expenseData);
        toast.success('Gasto actualizado correctamente');
      } else {
        await addExpense(expenseData);
        toast.success('Gasto agregado correctamente');
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      toast.error('Error al guardar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Muestra el diálogo de confirmación para eliminar un gasto
   * @param {string} expenseId - ID del gasto a eliminar
   */
  const handleDeleteClick = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setIsDeleteDialogOpen(true);
  };
  
  /**
   * Confirma la eliminación de un gasto
   */
  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete);
        toast.success('Gasto eliminado correctamente');
        setIsDeleteDialogOpen(false);
        setExpenseToDelete(null);
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
        toast.error('Error al eliminar el gasto');
      }
    }
  };

  /**
   * Exporta los gastos filtrados a un archivo CSV
   */
  const handleExportCSV = () => {
    // Preparar datos para exportar (formato más legible)
    const dataToExport = filteredExpenses.map(expense => {
      const trip = trips.find(t => t.id === expense.tripId);
      const vehicle = vehicles.find(v => v.id === expense.vehicleId);
      
      return {
        Fecha: format(new Date(expense.date), 'dd/MM/yyyy', { locale: es }),
        Categoría: getCategoryLabel(expense.category),
        Monto: expense.amount,
        Descripción: expense.description || '',
        Vehículo: vehicle ? `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}` : '',
        Viaje: trip ? `${trip.origin} - ${trip.destination}` : '',
      };
    });
    
    exportToCSV(dataToExport, `gastos_${format(new Date(), 'yyyy-MM-dd')}`);
  };
  
  /**
   * Obtiene la etiqueta en español para una categoría
   * @param {string} category - Categoría de gasto
   * @returns {string} Etiqueta en español
   */
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      fuel: 'Combustible',
      toll: 'Peaje',
      maintenance: 'Mantenimiento',
      lodging: 'Alojamiento',
      food: 'Comida',
      other: 'Otros'
    };
    
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <ExpenseHeader 
        onAddClick={() => handleOpenForm()} 
        onExportClick={handleExportCSV}
        canExport={filteredExpenses.length > 0}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Resumen de gastos */}
        <div className="lg:col-span-1">
          <ExpenseSummary 
            expenses={expenses} 
            vehicles={vehicles}
            trips={trips}
            title="Resumen general"
          />
        </div>
        
        {/* Lista de gastos */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filtros de búsqueda */}
          <ExpenseFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedVehicleId={selectedVehicleId}
            setSelectedVehicleId={setSelectedVehicleId}
            selectedTripId={selectedTripId}
            setSelectedTripId={setSelectedTripId}
            vehicles={vehicles}
            trips={trips}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />
          
          {/* Lista de gastos por categorías */}
          <ExpensesList
            filteredExpenses={filteredExpenses}
            expensesByCategory={expensesByCategory}
            trips={trips}
            vehicles={vehicles}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onEdit={handleOpenForm}
            onDelete={handleDeleteClick}
            onAdd={() => handleOpenForm()}
          />
        </div>
      </div>
      
      {/* Diálogos */}
      <ExpenseDialogs
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        currentExpense={currentExpense}
        trips={trips}
        vehicles={vehicles}
        isSubmitting={isSubmitting}
        onFormSubmit={handleFormSubmit}
        onCloseForm={handleCloseForm}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ExpensesPage;
