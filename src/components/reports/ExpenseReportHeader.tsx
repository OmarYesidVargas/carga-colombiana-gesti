
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseReportHeaderProps {
  onExport: () => void;
}

const ExpenseReportHeader: React.FC<ExpenseReportHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reporte de Gastos</h1>
        <p className="text-muted-foreground">
          Visualiza y analiza los gastos de tus viajes
        </p>
      </div>
      
      <Button onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Exportar Datos
      </Button>
    </div>
  );
};

export default ExpenseReportHeader;
