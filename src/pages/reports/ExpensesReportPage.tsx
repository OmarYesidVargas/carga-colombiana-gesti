
import React from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useExpenseReport } from '@/hooks/useExpenseReport';
import { getCategoryLabel } from '@/utils/chartColors';
import ExpenseReportHeader from '@/components/reports/ExpenseReportHeader';
import ExpenseReportFilters from '@/components/reports/ExpenseReportFilters';
import ExpenseReportCharts from '@/components/reports/ExpenseReportCharts';
import ExpenseReportTable from '@/components/reports/ExpenseReportTable';

/**
 * Página principal del reporte de gastos con diseño completamente responsivo
 * Organiza y presenta toda la información de gastos de manera adaptativa
 */
const ExpensesReportPage = () => {
  const { vehicles, trips, expenses, exportToCSV } = useData();
  
  // Utilizar hook personalizado para filtrado y cálculos de gastos
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
  
  /**
   * Función para exportar datos a CSV con formato legible
   * Prepara los datos con información completa para exportación
   */
  const handleExportData = () => {
    if (filteredExpenses.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    // Preparar datos para exportar con formato más legible
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sección de encabezado - Responsivo con título y botón de exportación */}
      <ExpenseReportHeader 
        onExport={handleExportData} 
        totalExpenses={totalExpenses}
      />
      
      {/* Sección de filtros - Se adapta a diferentes pantallas */}
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
      
      {/* Resultados del reporte */}
      {filteredExpenses.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Gráficos y resúmenes - Layout responsivo */}
          <ExpenseReportCharts 
            expenses={filteredExpenses}
            vehicles={vehicles}
            trips={trips}
            expensesByCategory={expensesByCategory}
            expensesByVehicle={expensesByVehicle}
          />
          
          {/* Tabla de gastos - Vista responsiva */}
          <ExpenseReportTable
            expenses={filteredExpenses}
            vehicles={vehicles}
            trips={trips}
            totalExpenses={totalExpenses}
          />
        </div>
      ) : (
        // Mensaje cuando no hay datos - Centrado y responsivo
        <div className="text-center py-10 sm:py-16">
          <p className="text-muted-foreground text-sm sm:text-base">
            No se encontraron gastos que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesReportPage;
