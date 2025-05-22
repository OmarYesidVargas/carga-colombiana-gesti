
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

/**
 * Props para el componente de encabezado de gastos
 */
interface ExpenseHeaderProps {
  onAddClick: () => void;
  onExportClick: () => void;
  canExport: boolean;
}

/**
 * Componente de encabezado para la página de gastos
 * Muestra el título y los botones de acción principales
 */
const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({ 
  onAddClick, 
  onExportClick,
  canExport
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Gastos</h1>
        <p className="text-muted-foreground">
          Administra los gastos de tus viajes
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAddClick} className="flex-1 sm:flex-none">
          <Plus className="mr-2 h-4 w-4" /> 
          Agregar Gasto
        </Button>
        
        <Button 
          onClick={onExportClick} 
          variant="outline"
          className="flex-1 sm:flex-none"
          disabled={!canExport}
        >
          <Download className="mr-2 h-4 w-4" /> 
          Exportar CSV
        </Button>
      </div>
    </div>
  );
};

export default ExpenseHeader;
