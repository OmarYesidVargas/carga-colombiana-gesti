
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
 * Página de gestión de gastos con manejo de errores mejorado
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
  } = useExpenseFilters(expenses, vehicles, trips);
  
  /**
   * Abre el formulario para crear o editar un gasto
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
   * Maneja el envío del formulario de gastos con validación completa
   */
  const handleFormSubmit = async (data: any) => {
    console.log('📝 [ExpensesPage] Iniciando guardado de gasto:', data);
    setIsSubmitting(true);
    
    try {
      // Validar que los datos estén completos
      if (!data.tripId) {
        toast.error('Debe seleccionar un viaje');
        return;
      }

      if (!data.category) {
        toast.error('Debe seleccionar una categoría');
        return;
      }

      if (!data.amount || isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
        toast.error('Debe ingresar un monto válido mayor a 0');
        return;
      }

      if (!data.date) {
        toast.error('Debe seleccionar una fecha');
        return;
      }

      // Buscar el viaje para obtener el vehicleId
      const selectedTrip = trips.find(trip => trip.id === data.tripId);
      if (!selectedTrip) {
        toast.error('El viaje seleccionado no es válido');
        return;
      }

      // Buscar el vehículo
      const selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedTrip.vehicleId);
      if (!selectedVehicle) {
        toast.error('El vehículo del viaje seleccionado no es válido');
        return;
      }

      // Preparar datos del gasto
      const expenseData = {
        tripId: data.tripId,
        vehicleId: selectedTrip.vehicleId,
        category: data.category,
        amount: Number(data.amount), // Convertir explícitamente a número
        date: data.date.toISOString(), // Convertir fecha a ISO string
        description: data.description || ''
      };

      console.log('✅ [ExpensesPage] Datos preparados para guardar:', expenseData);
      
      if (currentExpense) {
        // Actualizar gasto existente
        console.log('🔄 [ExpensesPage] Actualizando gasto existente:', currentExpense.id);
        const success = await updateExpense(currentExpense.id, expenseData);
        if (success) {
          toast.success('Gasto actualizado correctamente');
          handleCloseForm();
        } else {
          toast.error('Error al actualizar el gasto');
        }
      } else {
        // Crear nuevo gasto
        console.log('✨ [ExpensesPage] Creando nuevo gasto');
        const newExpense = await addExpense(expenseData);
        if (newExpense) {
          toast.success('Gasto agregado correctamente');
          handleCloseForm();
        } else {
          toast.error('Error al agregar el gasto');
        }
      }
    } catch (error: any) {
      console.error('❌ [ExpensesPage] Error al guardar gasto:', error);
      toast.error(`Error al guardar el gasto: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Muestra el diálogo de confirmación para eliminar un gasto
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
        console.log('🗑️ [ExpensesPage] Eliminando gasto:', expenseToDelete);
        const success = await deleteExpense(expenseToDelete);
        if (success) {
          toast.success('Gasto eliminado correctamente');
          setIsDeleteDialogOpen(false);
          setExpenseToDelete(null);
        } else {
          toast.error('Error al eliminar el gasto');
        }
      } catch (error: any) {
        console.error('❌ [ExpensesPage] Error al eliminar gasto:', error);
        toast.error(`Error al eliminar el gasto: ${error.message || 'Error desconocido'}`);
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
        {/* Encabezado mejorado y responsivo */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between lg:space-x-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Gestión de Gastos
              </h1>
              <p className="text-violet-100 text-sm sm:text-base lg:text-lg">
                Administra los gastos de tus viajes de manera eficiente
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                  <span>{expenses.length} gastos registrados</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                  <span>{filteredExpenses.length} gastos filtrados</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
              <ExpenseHeader 
                onAddClick={() => handleOpenForm()} 
                onExportClick={handleExportCSV}
                canExport={filteredExpenses.length > 0}
              />
            </div>
          </div>
        </div>
        
        {/* Layout responsivo mejorado */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-6">
          {/* Resumen de gastos - responsive */}
          <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <div className="bg-white/90 backdrop-blur rounded-xl border border-violet-100 shadow-lg h-fit">
              <ExpenseSummary 
                expenses={filteredExpenses} 
                vehicles={vehicles}
                trips={trips}
                title="Resumen de gastos filtrados"
              />
            </div>
          </div>
          
          {/* Lista de gastos - responsive */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2 space-y-4 sm:space-y-6">
            {/* Filtros de búsqueda mejorados y responsivos */}
            <div className="bg-white/90 backdrop-blur rounded-xl border border-violet-100 shadow-lg p-4 sm:p-6">
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
            </div>
            
            {/* Lista de gastos por categorías - responsive */}
            <div className="bg-white/90 backdrop-blur rounded-xl border border-violet-100 shadow-lg overflow-hidden">
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
    </div>
  );
};

export default ExpensesPage;
