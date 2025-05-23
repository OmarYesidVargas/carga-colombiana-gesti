
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseReportHeaderProps {
  onExport: () => void;
  totalExpenses: number;
}

const ExpenseReportHeader: React.FC<ExpenseReportHeaderProps> = ({ onExport, totalExpenses }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reporte de Gastos</h1>
        <p className="text-muted-foreground">
          Visualiza y analiza los gastos de tus viajes
        </p>
        {totalExpenses > 0 && (
          <p className="text-lg mt-2">
            Total: <span className="font-bold">{formatCurrency(totalExpenses)}</span>
          </p>
        )}
      </div>
      
      <Button onClick={onExport} disabled={totalExpenses === 0}>
        <Download className="mr-2 h-4 w-4" />
        Exportar Datos
      </Button>
    </div>
  );
};

export default ExpenseReportHeader;
