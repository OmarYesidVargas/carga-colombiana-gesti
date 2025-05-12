
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin, Truck, Plus, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { Trip, Expense } from '@/types';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import TripForm from '@/components/trips/TripForm';
import ExpensesChart from '@/components/reports/ExpensesChart';

const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    trips, vehicles, expenses, 
    getTripById, getVehicleById, 
    updateTrip, deleteTrip, 
    addExpense, updateExpense, deleteExpense 
  } = useData();
  
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteExpenseDialogOpen, setIsDeleteExpenseDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Obtener el viaje y el vehículo
  const trip = getTripById(id || '');
  const vehicle = trip ? getVehicleById(trip.vehicleId) : undefined;
  
  // Obtener los gastos del viaje
  const tripExpenses = expenses.filter(expense => expense.tripId === id);
  
  // Calcular el total de gastos
  const totalExpenses = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Formatear moneda colombiana
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  const handleGoBack = () => {
    navigate('/trips');
  };
  
  const handleEditTrip = () => {
    setIsTripFormOpen(true);
  };
  
  const handleDeleteTrip = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteTrip = () => {
    if (trip) {
      deleteTrip(trip.id);
      setIsDeleteDialogOpen(false);
      navigate('/trips');
    }
  };
  
  const handleTripFormSubmit = (tripData: any) => {
    setIsSubmitting(true);
    
    try {
      // Convertir distance a número
      tripData.distance = parseFloat(tripData.distance);
      
      if (trip) {
        updateTrip(trip.id, tripData);
        setIsTripFormOpen(false);
      }
    } catch (error) {
      console.error('Error al actualizar viaje:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenExpenseForm = (expense?: Expense) => {
    if (expense) {
      setCurrentExpense(expense);
    } else {
      setCurrentExpense(null);
    }
    setIsExpenseFormOpen(true);
  };
  
  const handleCloseExpenseForm = () => {
    setIsExpenseFormOpen(false);
    setCurrentExpense(null);
  };
  
  const handleExpenseFormSubmit = (expenseData: any) => {
    setIsSubmitting(true);
    
    try {
      // Convertir amount a número
      expenseData.amount = parseFloat(expenseData.amount);
      
      if (currentExpense) {
        updateExpense(currentExpense.id, expenseData);
      } else {
        addExpense({
          ...expenseData,
          tripId: trip?.id || '',
        });
      }
      
      handleCloseExpenseForm();
    } catch (error) {
      console.error('Error al guardar gasto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteExpense = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setIsDeleteExpenseDialogOpen(true);
  };
  
  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setIsDeleteExpenseDialogOpen(false);
      setExpenseToDelete(null);
    }
  };
  
  // Si no se encuentra el viaje, mostrar mensaje de error
  if (!trip) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Viaje no encontrado</h1>
        <p className="text-muted-foreground mb-4">
          El viaje que estás buscando no existe o ha sido eliminado.
        </p>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Viajes
        </Button>
      </div>
    );
  }
  
  // Determinar si el viaje está activo
  const isActive = !trip.endDate || new Date() <= new Date(trip.endDate);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button onClick={handleGoBack} variant="ghost" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {trip.origin} → {trip.destination}
              </h1>
              {isActive && (
                <Badge variant="outline" className="bg-primary/20">
                  Activo
                </Badge>
              )}
            </div>
            {vehicle && (
              <p className="text-sm text-muted-foreground">
                {vehicle.plate} • {vehicle.brand} {vehicle.model}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditTrip}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDeleteTrip}>
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de detalles */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del viaje */}
            <Card>
              <CardHeader>
                <CardTitle>Información del viaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {format(new Date(trip.startDate), 'PPP', { locale: es })}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de fin</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {trip.endDate 
                          ? format(new Date(trip.endDate), 'PPP', { locale: es })
                          : 'No definida'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Origen</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{trip.origin}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Destino</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{trip.destination}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Distancia</p>
                  <p className="font-medium">{trip.distance} km</p>
                </div>
                
                {trip.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notas</p>
                    <p className="mt-1">{trip.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Información del vehículo */}
            {vehicle && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Vehículo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-sm text-muted-foreground vehicle-plate">{vehicle.plate}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Año</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    
                    {vehicle.color && (
                      <div>
                        <p className="text-sm text-muted-foreground">Color</p>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: vehicle.color }}></div>
                          <p className="font-medium">{vehicle.color}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.fuelType && (
                      <div>
                        <p className="text-sm text-muted-foreground">Combustible</p>
                        <p className="font-medium">{vehicle.fuelType === 'diesel' ? 'Diésel' : 
                          vehicle.fuelType === 'gasoline' ? 'Gasolina' : 
                          vehicle.fuelType === 'gas' ? 'Gas Natural' : 
                          vehicle.fuelType === 'hybrid' ? 'Híbrido' : 
                          vehicle.fuelType === 'electric' ? 'Eléctrico' : 
                          vehicle.fuelType}
                        </p>
                      </div>
                    )}
                    
                    {vehicle.capacity && (
                      <div>
                        <p className="text-sm text-muted-foreground">Capacidad</p>
                        <p className="font-medium">{vehicle.capacity}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Resumen de gastos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resumen de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold currency-cop">
                  {formatCurrency(totalExpenses)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total de gastos ({tripExpenses.length} registros)
                </p>
              </div>
              
              {tripExpenses.length > 0 ? (
                <ExpensesChart expenses={tripExpenses} />
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Aún no hay gastos registrados para este viaje.
                  </p>
                  <Button 
                    onClick={() => handleOpenExpenseForm()} 
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> 
                    Agregar Gasto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pestaña de gastos */}
        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gastos del Viaje</CardTitle>
              <Button onClick={() => handleOpenExpenseForm()}>
                <Plus className="mr-2 h-4 w-4" /> 
                Agregar Gasto
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total de gastos */}
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                <span className="font-medium">Total de gastos:</span>
                <span className="text-xl font-bold currency-cop">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
              
              <Separator />
              
              {/* Lista de gastos */}
              {tripExpenses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tripExpenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      trip={trip}
                      vehicle={vehicle}
                      onEdit={handleOpenExpenseForm}
                      onDelete={handleDeleteExpense}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Aún no hay gastos registrados para este viaje.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogos */}
      <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentExpense ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}
            </DialogTitle>
            <DialogDescription>
              {currentExpense 
                ? 'Modifica los detalles del gasto seleccionado.' 
                : 'Registra un nuevo gasto para este viaje.'}
            </DialogDescription>
          </DialogHeader>
          
          <ExpenseForm
            initialData={currentExpense || undefined}
            trips={[trip]}
            vehicles={vehicles}
            selectedTripId={trip.id}
            onSubmit={handleExpenseFormSubmit}
            onCancel={handleCloseExpenseForm}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTripFormOpen} onOpenChange={setIsTripFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Viaje</DialogTitle>
            <DialogDescription>
              Modifica los detalles del viaje
            </DialogDescription>
          </DialogHeader>
          
          <TripForm
            initialData={trip}
            vehicles={vehicles}
            onSubmit={handleTripFormSubmit}
            onCancel={() => setIsTripFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El viaje será eliminado permanentemente junto con todos sus gastos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTrip}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isDeleteExpenseDialogOpen} onOpenChange={setIsDeleteExpenseDialogOpen}>
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
              onClick={confirmDeleteExpense}
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

export default TripDetailPage;
