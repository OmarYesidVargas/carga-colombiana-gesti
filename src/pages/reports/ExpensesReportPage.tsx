
import React from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { useExpenseReport } from '@/hooks/useExpenseReport';
import ExpenseReportHeader from '@/components/reports/ExpenseReportHeader';
import ExpenseReportFilters from '@/components/reports/ExpenseReportFilters';
import ExpenseReportCharts from '@/components/reports/ExpenseReportCharts';
import ExpenseReportTable from '@/components/reports/ExpenseReportTable';

const ExpensesReportPage = () => {
  const { vehicles, trips, expenses } = useData();
  
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
    totalExpenses
  } = useExpenseReport(expenses);
  
  // Función para simular la exportación de datos
  const handleExportData = () => {
    toast.success('Reporte exportado exitosamente a tu dispositivo');
    // En una implementación real, aquí se generaría un archivo CSV o PDF
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <ExpenseReportHeader onExport={handleExportData} />
      
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
