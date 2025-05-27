
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        onClick={onAddClick} 
        className="bg-white text-violet-700 hover:bg-violet-50 font-semibold px-6 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" /> 
        Agregar Gasto
      </Button>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button 
                onClick={onExportClick} 
                variant="outline"
                className="bg-white/80 border-white/50 text-white hover:bg-white/90 hover:text-violet-700 font-semibold px-6 py-3 h-auto shadow-lg transition-all duration-200"
                size="lg"
                disabled={!canExport}
              >
                <Download className="mr-2 h-5 w-5" /> 
                Exportar CSV
              </Button>
            </div>
          </TooltipTrigger>
          {!canExport && (
            <TooltipContent>
              <p>Agrega gastos para poder exportarlos</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ExpenseHeader;
