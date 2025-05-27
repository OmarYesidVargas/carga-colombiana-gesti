
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Expense, Trip, Vehicle } from '@/types';
import { useMobile } from '@/hooks/use-mobile';

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
  const isMobile = useMobile();

  /**
   * Renderiza el contenido vacío cuando no hay gastos
   */
  const renderEmptyContent = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-6">
        <Plus className="h-12 w-12 text-violet-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        No se encontraron gastos
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {activeTab === 'all' 
          ? 'Agrega tu primer gasto para comenzar a llevar el control de tus gastos'
          : `No hay gastos en la categoría ${getCategoryLabel(activeTab)}`
        }
      </p>
      <Button 
        onClick={onAdd} 
        className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 h-auto"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" /> 
        Agregar Gasto
      </Button>
    </div>
  );

  /**
   * Renderiza la lista de gastos
   */
  const renderExpenseGrid = (expenses: Expense[]) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      fuel: 'Combustible',
      toll: 'Peajes',
      maintenance: 'Mantenimiento',
      lodging: 'Alojamiento',
      food: 'Comida',
      other: 'Otros'
    };
    return labels[category] || category;
  };

  const getCategoryCount = (category: string) => {
    if (category === 'all') return filteredExpenses.length;
    return expensesByCategory[category]?.length || 0;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Tabs mejoradas */}
      <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 pt-4">
        <div className="relative mb-4 -mx-1">
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <TabsList className="flex flex-nowrap min-w-max p-1 bg-white/80 backdrop-blur border border-violet-200">
              <TabsTrigger 
                value="all" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
              >
                Todos ({getCategoryCount('all')})
              </TabsTrigger>
              <TabsTrigger 
                value="fuel" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
              >
                Combustible ({getCategoryCount('fuel')})
              </TabsTrigger>
              <TabsTrigger 
                value="toll" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
              >
                Peajes ({getCategoryCount('toll')})
              </TabsTrigger>
              <TabsTrigger 
                value="maintenance" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
              >
                Mantenimiento ({getCategoryCount('maintenance')})
              </TabsTrigger>
              <TabsTrigger 
                value="lodging" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
              >
                Alojamiento ({getCategoryCount('lodging')})
              </TabsTrigger>
              <TabsTrigger 
                value="food" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
              >
                Comida ({getCategoryCount('food')})
              </TabsTrigger>
              <TabsTrigger 
                value="other" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
              >
                Otros ({getCategoryCount('other')})
              </TabsTrigger>
            </TabsList>
          </div>
          {isMobile && (
            <div className="absolute inset-y-0 right-0 w-8 pointer-events-none bg-gradient-to-l from-violet-50 to-transparent" />
          )}
        </div>
      </div>
      
      <div className="p-6">
        <TabsContent value="all" className="mt-0">
          {filteredExpenses.length > 0 
            ? renderExpenseGrid(filteredExpenses) 
            : renderEmptyContent()
          }
        </TabsContent>
        
        {Object.keys(expensesByCategory).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            {expensesByCategory[category].length > 0 
              ? renderExpenseGrid(expensesByCategory[category]) 
              : renderEmptyContent()
            }
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default ExpensesList;
