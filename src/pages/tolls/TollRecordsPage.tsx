import React, { useState } from 'react';
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
import TollRecordCard from '@/components/tolls/TollRecordCard';
import TollRecordForm from '@/components/tolls/TollRecordForm';
import TollSummary from '@/components/tolls/TollSummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TollRecord } from '@/types';
import { toast } from 'sonner';

const TollRecordsPage = () => {
  const { tollRecords, tolls, trips, vehicles, addTollRecord, updateTollRecord, deleteTollRecord } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [currentRecord, setCurrentRecord] = useState<TollRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | 'all'>('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | 'all'>('all');
  
  // Verificar si hay datos necesarios para crear registros
  const canCreateRecord = trips.length > 0 && tolls.length > 0 && vehicles.length > 0;
  
  // Función para filtrar registros de peaje
  const filteredRecords = tollRecords.filter((record) => {
    if (!record) return false;
    
    try {
      // Filtrar por búsqueda
      const searchMatches = !searchTerm || [
        record.notes,
        record.receipt,
        record.paymentMethod,
        tolls.find(t => t.id === record.tollId)?.name
      ].some(field => 
        field && field.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Filtrar por viaje
      const tripMatches = selectedTripId === 'all' || record.tripId === selectedTripId;
      
      // Filtrar por vehículo
      const vehicleMatches = selectedVehicleId === 'all' || record.vehicleId === selectedVehicleId;
      
      return searchMatches && tripMatches && vehicleMatches;
    } catch (error) {
      console.error('Error al filtrar registro:', error, record);
      return false;
    }
  });
  
  // Ordenar registros por fecha (más recientes primero)
  const sortedRecords = [...filteredRecords].sort(
    (a, b) => {
      try {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } catch (error) {
        console.error('Error al ordenar registros:', error);
        return 0;
      }
    }
  );
  
  const handleOpenForm = (record?: TollRecord) => {
    if (!canCreateRecord && !record) {
      if (trips.length === 0) {
        toast.error('Primero debe crear al menos un viaje');
      } else if (tolls.length === 0) {
        toast.error('Primero debe crear al menos un peaje');
      } else if (vehicles.length === 0) {
        toast.error('Primero debe crear al menos un vehículo');
      }
      return;
    }
    
    setCurrentRecord(record || null);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentRecord(null);
    setIsSubmitting(false);
  };
  
  const handleFormSubmit = async (data: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validar datos antes de enviar
      if (!data.vehicleId) {
        toast.error('Error: No se pudo determinar el vehículo');
        return;
      }
      
      if (!data.tripId || !data.tollId) {
        toast.error('Error: Datos de viaje o peaje faltantes');
        return;
      }
      
      // Convertir precio a número
      const submitData = {
        ...data,
        price: parseFloat(data.price) || 0
      };
      
      // Validar precio
      if (submitData.price <= 0) {
        toast.error('El precio debe ser mayor a 0');
        return;
      }
      
      if (currentRecord) {
        await updateTollRecord(currentRecord.id, submitData);
      } else {
        await addTollRecord(submitData);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error al procesar formulario:', error);
      toast.error('Error al procesar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (recordId: string) => {
    if (!recordId) {
      toast.error('ID de registro inválido');
      return;
    }
    setRecordToDelete(recordId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!recordToDelete) return;
    
    try {
      await deleteTollRecord(recordToDelete);
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      toast.error('Error al eliminar el registro');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      {/* Header responsivo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold">Registro de Peajes</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestiona los registros de paso por peajes
          </p>
        </div>
        
        <Button 
          onClick={() => handleOpenForm()}
          disabled={!canCreateRecord}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> 
          Registrar Peaje
        </Button>
      </div>

      {!canCreateRecord && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="font-medium text-orange-800">Configuración requerida</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Para registrar peajes necesita tener:
                </p>
                <ul className="list-disc list-inside text-sm text-orange-700 mt-2 space-y-1">
                  {vehicles.length === 0 && <li>Al menos un vehículo registrado</li>}
                  {trips.length === 0 && <li>Al menos un viaje registrado</li>}
                  {tolls.length === 0 && <li>Al menos un peaje registrado</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Layout responsivo mejorado */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
        {/* Resumen de peajes - responsive */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <TollSummary 
            tollRecords={tollRecords} 
            tolls={tolls}
            vehicles={vehicles}
            trips={trips}
          />
        </div>
        
        {/* Lista de registros de peaje - responsive */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-4">
          {/* Búsqueda y filtros responsivos */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar registros..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Select 
                value={selectedVehicleId} 
                onValueChange={setSelectedVehicleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por vehículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vehículos</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <span className="truncate">
                        {vehicle.plate} - {vehicle.brand} {vehicle.model}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={selectedTripId} 
                onValueChange={setSelectedTripId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por viaje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los viajes</SelectItem>
                  {trips.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      <span className="truncate">
                        {trip.origin} → {trip.destination}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Lista de registros con grid responsivo */}
          {sortedRecords.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedRecords.map((record) => {
                try {
                  return (
                    <TollRecordCard
                      key={record.id}
                      record={record}
                      toll={tolls.find(t => t.id === record.tollId)}
                      trip={trips.find(t => t.id === record.tripId)}
                      vehicle={vehicles.find(v => v.id === record.vehicleId)}
                      onEdit={handleOpenForm}
                      onDelete={handleDeleteClick}
                    />
                  );
                } catch (error) {
                  console.error('Error al renderizar registro:', error, record);
                  return null;
                }
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 sm:py-10 text-center">
                <p className="text-muted-foreground text-sm sm:text-base">
                  {tollRecords.length === 0 
                    ? 'No hay registros de peaje.' 
                    : 'No se encontraron registros con los filtros seleccionados.'}
                </p>
                {canCreateRecord && (
                  <Button 
                    onClick={() => handleOpenForm()} 
                    className="mt-4 w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> 
                    Registrar Peaje
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Diálogo de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {currentRecord ? 'Editar Registro' : 'Registrar Peaje'}
            </DialogTitle>
            <DialogDescription>
              {currentRecord 
                ? 'Modifica los detalles del registro de peaje.' 
                : 'Registra un nuevo paso por peaje durante un viaje.'}
            </DialogDescription>
          </DialogHeader>
          
          <TollRecordForm
            initialData={currentRecord || undefined}
            trips={trips}
            tolls={tolls}
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
              Esta acción no se puede deshacer. El registro será eliminado permanentemente.
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

export default TollRecordsPage;
