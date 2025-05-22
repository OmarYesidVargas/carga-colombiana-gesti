
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Expense, Trip, Vehicle } from '@/types';

/**
 * Props para el componente de lista de gastos
 */
interface ExpensesListProps {
  filteredExpenses: Expense[];
  expensesByCategory: Record<string, Expense[]>;
  trips: Trip[];
  vehicles: Vehicle[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  onAdd: () => void;
}

/**
 * Componente que muestra la lista de gastos agrupados por categorías
 */
const ExpensesList: React.FC<ExpensesListProps> = ({
  filteredExpenses,
  expensesByCategory,
  trips,
  vehicles,
  activeTab,
  setActiveTab,
  onEdit,
  onDelete,
  onAdd
}) => {
  /**
   * Renderiza el contenido vacío cuando no hay gastos
   */
  const renderEmptyContent = () => (
    <Card>
      <CardContent className="py-10 text-center">
        <p className="text-muted-foreground">
          No se encontraron gastos con los filtros seleccionados.
        </p>
        <Button onClick={onAdd} className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> 
          Agregar Gasto
        </Button>
      </CardContent>
    </Card>
  );

  /**
   * Renderiza la lista de gastos
   */
  const renderExpenseGrid = (expenses: Expense[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          trip={trips.find(t => t.id === expense.tripId)}
          vehicle={vehicles.find(v => v.id === expense.vehicleId)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full overflow-x-auto">
      <TabsList className="mb-4 flex flex-nowrap overflow-x-auto pb-1 scrollbar-thin">
        <TabsTrigger value="all" className="flex-shrink-0">Todos</TabsTrigger>
        <TabsTrigger value="fuel" className="flex-shrink-0">Combustible</TabsTrigger>
        <TabsTrigger value="toll" className="flex-shrink-0">Peajes</TabsTrigger>
        <TabsTrigger value="maintenance" className="flex-shrink-0">Mantenimiento</TabsTrigger>
        <TabsTrigger value="lodging" className="flex-shrink-0">Alojamiento</TabsTrigger>
        <TabsTrigger value="food" className="flex-shrink-0">Comida</TabsTrigger>
        <TabsTrigger value="other" className="flex-shrink-0">Otros</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        {filteredExpenses.length > 0 
          ? renderExpenseGrid(filteredExpenses) 
          : renderEmptyContent()
        }
      </TabsContent>
      
      {Object.keys(expensesByCategory).map((category) => (
        <TabsContent key={category} value={category}>
          {expensesByCategory[category].length > 0 
            ? renderExpenseGrid(expensesByCategory[category]) 
            : renderEmptyContent()
          }
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ExpensesList;
