
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
    <div className="text-center py-12 sm:py-16">
      <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-violet-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <Plus className="h-8 w-8 sm:h-12 sm:w-12 text-violet-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
        No se encontraron gastos
      </h3>
      <p className="text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
        {activeTab === 'all' 
          ? 'Agrega tu primer gasto para comenzar a llevar el control de tus gastos'
          : `No hay gastos en la categoría ${getCategoryLabel(activeTab)}`
        }
      </p>
      <Button 
        onClick={onAdd} 
        className="bg-violet-500 hover:bg-violet-600 text-white px-4 sm:px-6 py-2 sm:py-3 h-auto text-sm sm:text-base"
        size="lg"
      >
        <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
        Agregar Gasto
      </Button>
    </div>
  );

  /**
   * Renderiza la lista de gastos
   */
  const renderExpenseGrid = (expenses: Expense[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
      {/* Tabs mejoradas para móvil */}
      <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-3 sm:px-6 pt-4">
        <div className="relative mb-4 -mx-1">
          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-transparent">
            <TabsList className="flex flex-nowrap w-max min-w-full p-1 bg-white/80 backdrop-blur border border-violet-200 gap-1">
              <TabsTrigger 
                value="all" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                Todos ({getCategoryCount('all')})
              </TabsTrigger>
              <TabsTrigger 
                value="fuel" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                {isMobile ? 'Combustible' : 'Combustible'} ({getCategoryCount('fuel')})
              </TabsTrigger>
              <TabsTrigger 
                value="toll" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                Peajes ({getCategoryCount('toll')})
              </TabsTrigger>
              <TabsTrigger 
                value="maintenance" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                {isMobile ? 'Mant.' : 'Mantenimiento'} ({getCategoryCount('maintenance')})
              </TabsTrigger>
              <TabsTrigger 
                value="lodging" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                {isMobile ? 'Hotel' : 'Alojamiento'} ({getCategoryCount('lodging')})
              </TabsTrigger>
              <TabsTrigger 
                value="food" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                Comida ({getCategoryCount('food')})
              </TabsTrigger>
              <TabsTrigger 
                value="other" 
                className="flex-shrink-0 data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                Otros ({getCategoryCount('other')})
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Gradiente para indicar scroll horizontal en móvil */}
          {isMobile && (
            <div className="absolute inset-y-0 right-0 w-6 pointer-events-none bg-gradient-to-l from-violet-50 via-violet-50/80 to-transparent" />
          )}
        </div>
      </div>
      
      <div className="p-3 sm:p-6">
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
