
import React from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useExpenseReport } from '@/hooks/useExpenseReport';
import ExpenseReportHeader from '@/components/reports/ExpenseReportHeader';
import ExpenseReportFilters from '@/components/reports/ExpenseReportFilters';
import ExpenseReportCharts from '@/components/reports/ExpenseReportCharts';
import ExpenseReportTable from '@/components/reports/ExpenseReportTable';

const ExpensesReportPage = () => {
  const { vehicles, trips, expenses, exportToCSV } = useData();
  
  // Use custom hook for filtering and calculations
  const {
    vehicleFilter,
    setVehicleFilter,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    resetFilters,
    filteredExpenses,
    totalExpenses,
    expensesByCategory,
    expensesByVehicle
  } = useExpenseReport(expenses);
  
  // Función para exportar datos
  const handleExportData = () => {
    if (filteredExpenses.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
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
    toast.success('Reporte exportado exitosamente');
  };
  
  // Obtener etiquetas de categorías
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
      {/* Header section */}
      <ExpenseReportHeader 
        onExport={handleExportData} 
        totalExpenses={totalExpenses}
      />
      
      {/* Filters section */}
      <ExpenseReportFilters
        vehicles={vehicles}
        vehicleFilter={vehicleFilter}
        setVehicleFilter={setVehicleFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        resetFilters={resetFilters}
      />
      
      {/* Results */}
      {filteredExpenses.length > 0 ? (
        <div className="space-y-6">
          {/* Charts and summary */}
          <ExpenseReportCharts 
            expenses={filteredExpenses}
            vehicles={vehicles}
            trips={trips}
            expensesByCategory={expensesByCategory}
            expensesByVehicle={expensesByVehicle}
          />
          
          {/* Expenses table */}
          <ExpenseReportTable
            expenses={filteredExpenses}
            vehicles={vehicles}
            trips={trips}
            totalExpenses={totalExpenses}
          />
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No se encontraron gastos que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesReportPage;
