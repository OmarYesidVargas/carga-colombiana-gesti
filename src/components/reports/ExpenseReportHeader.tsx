
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseReportHeaderProps {
  onExport: () => void;
  totalExpenses: number;
}

/**
 * Componente de encabezado responsivo para el reporte de gastos
 * Muestra el título, resumen y botón de exportación adaptándose al tamaño de pantalla
 */
const ExpenseReportHeader: React.FC<ExpenseReportHeaderProps> = ({ 
  onExport, 
  totalExpenses 
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Sección de información - Se adapta a móvil */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Reporte de Gastos
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Visualiza y analiza los gastos de tus viajes
        </p>
        {/* Mostrar total si hay gastos */}
        {totalExpenses > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-sm sm:text-base text-muted-foreground">Total:</span>
            <span className="text-lg sm:text-xl font-bold text-primary">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        )}
      </div>
      
      {/* Botón de exportación - Responsive */}
      <Button 
        onClick={onExport} 
        disabled={totalExpenses === 0}
        className="w-full sm:w-auto flex items-center justify-center gap-2"
        size={totalExpenses === 0 ? "default" : "lg"}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Exportar Datos</span>
        <span className="sm:hidden">Exportar</span>
      </Button>
    </div>
  );
};

export default ExpenseReportHeader;
