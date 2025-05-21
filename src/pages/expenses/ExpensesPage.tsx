
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { Expense } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseSummary from '@/components/reports/ExpenseSummary';
import { toast } from 'sonner';

const ExpensesPage = () => {
  const { expenses, trips, vehicles, addExpense, updateExpense, deleteExpense } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | 'all'>('all');
  const [selectedTripId, setSelectedTripId] = useState<string | 'all'>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Reset filters when changing tabs
    if (activeTab === 'all') {
      setSelectedVehicleId('all');
      setSelectedTripId('all');
    }
  }, [activeTab]);
  
  // Función para filtrar gastos
  const filteredExpenses = expenses.filter((expense) => {
    // Filtrar por búsqueda de texto
    const matchesSearch = 
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por vehículo
    const matchesVehicle = selectedVehicleId === 'all' || expense.vehicleId === selectedVehicleId;
    
    // Filtrar por viaje
    const matchesTrip = selectedTripId === 'all' || expense.tripId === selectedTripId;
    
    return matchesSearch && matchesVehicle && matchesTrip;
  });
  
  // Agrupar gastos por categoría
  const expensesByCategory = React.useMemo(() => {
    const categories = ['fuel', 'toll', 'maintenance', 'lodging', 'food', 'other'];
    const result: Record<string, Expense[]> = {};
    
    categories.forEach((category) => {
      result[category] = filteredExpenses.filter((expense) => expense.category === category);
    });
    
    return result;
  }, [filteredExpenses]);
  
  const handleOpenForm = (expense?: Expense) => {
    if (expense) {
      setCurrentExpense(expense);
    } else {
      setCurrentExpense(null);
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentExpense(null);
  };
  
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Convertir amount a número
      const expenseData = {
        ...data,
        amount: parseFloat(data.amount),
        // Añadir vehicleId del viaje seleccionado
        vehicleId: trips.find(trip => trip.id === data.tripId)?.vehicleId
      };
      
      if (currentExpense) {
        await updateExpense(currentExpense.id, expenseData);
        toast.success('Gasto actualizado correctamente');
      } else {
        await addExpense(expenseData);
        toast.success('Gasto agregado correctamente');
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      toast.error('Error al guardar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete);
        toast.success('Gasto eliminado correctamente');
        setIsDeleteDialogOpen(false);
        setExpenseToDelete(null);
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
        toast.error('Error al eliminar el gasto');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gastos</h1>
          <p className="text-muted-foreground">
            Administra los gastos de tus viajes
          </p>
        </div>
        
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" /> 
          Agregar Gasto
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Resumen de gastos */}
        <div className="md:col-span-1">
          <ExpenseSummary 
            expenses={expenses} 
            vehicles={vehicles}
            trips={trips}
            title="Resumen general"
          />
        </div>
        
        {/* Lista de gastos */}
        <div className="md:col-span-3 space-y-4">
          {/* Búsqueda y filtros */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar gastos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Tabs de categorías */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="fuel">Combustible</TabsTrigger>
              <TabsTrigger value="toll">Peajes</TabsTrigger>
              <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
              <TabsTrigger value="other">Otros</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {filteredExpenses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExpenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      trip={trips.find(t => t.id === expense.tripId)}
                      vehicle={vehicles.find(v => v.id === expense.vehicleId)}
                      onEdit={handleOpenForm}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">
                      No se encontraron gastos con los filtros seleccionados.
                    </p>
                    <Button 
                      onClick={() => handleOpenForm()} 
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" /> 
                      Agregar Gasto
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {Object.keys(expensesByCategory).map((category) => (
              <TabsContent key={category} value={category}>
                {expensesByCategory[category].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expensesByCategory[category].map((expense) => (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        trip={trips.find(t => t.id === expense.tripId)}
                        vehicle={vehicles.find(v => v.id === expense.vehicleId)}
                        onEdit={handleOpenForm}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">
                        No se encontraron gastos en esta categoría.
                      </p>
                      <Button 
                        onClick={() => handleOpenForm()} 
                        className="mt-4"
                      >
                        <Plus className="mr-2 h-4 w-4" /> 
                        Agregar Gasto
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Diálogo de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentExpense ? 'Editar Gasto' : 'Agregar Gasto'}
            </DialogTitle>
            <DialogDescription>
              {currentExpense 
                ? 'Modifica los detalles del gasto seleccionado.' 
                : 'Registra un nuevo gasto para un viaje.'}
            </DialogDescription>
          </DialogHeader>
          
          <ExpenseForm
            initialData={currentExpense || undefined}
            trips={trips}
            vehicles={vehicles}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El gasto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesPage;
