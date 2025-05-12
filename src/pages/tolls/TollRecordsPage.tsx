
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
import TollRecordCard from '@/components/tolls/TollRecordCard';
import TollRecordForm from '@/components/tolls/TollRecordForm';
import TollSummary from '@/components/tolls/TollSummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TollRecord } from '@/types';

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
  
  // Función para filtrar registros de peaje
  const filteredRecords = tollRecords.filter((record) => {
    // Filtrar por búsqueda (en las notas)
    const matchesSearch = 
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.receipt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tolls.find(t => t.id === record.tollId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por viaje
    const matchesTrip = selectedTripId === 'all' || record.tripId === selectedTripId;
    
    // Filtrar por vehículo
    const matchesVehicle = selectedVehicleId === 'all' || record.vehicleId === selectedVehicleId;
    
    return matchesSearch && matchesTrip && matchesVehicle;
  });
  
  // Ordenar registros por fecha (más recientes primero)
  const sortedRecords = [...filteredRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleOpenForm = (record?: TollRecord) => {
    if (record) {
      setCurrentRecord(record);
    } else {
      setCurrentRecord(null);
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentRecord(null);
  };
  
  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Convertir price a número
      data.price = parseFloat(data.price);
      
      if (currentRecord) {
        updateTollRecord(currentRecord.id, data);
      } else {
        addTollRecord(data);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error al guardar registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (recordId: string) => {
    setRecordToDelete(recordId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (recordToDelete) {
      deleteTollRecord(recordToDelete);
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Registro de Peajes</h1>
          <p className="text-muted-foreground">
            Gestiona los registros de paso por peajes
          </p>
        </div>
        
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" /> 
          Registrar Peaje
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Resumen de peajes */}
        <div className="md:col-span-1">
          <TollSummary 
            tollRecords={tollRecords} 
            tolls={tolls}
            vehicles={vehicles}
            trips={trips}
          />
        </div>
        
        {/* Lista de registros de peaje */}
        <div className="md:col-span-3 space-y-4">
          {/* Búsqueda y filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
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
                      {vehicle.plate} - {vehicle.brand} {vehicle.model}
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
                      {trip.origin} → {trip.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Lista de registros */}
          {sortedRecords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedRecords.map((record) => (
                <TollRecordCard
                  key={record.id}
                  record={record}
                  toll={tolls.find(t => t.id === record.tollId)}
                  trip={trips.find(t => t.id === record.tripId)}
                  vehicle={vehicles.find(v => v.id === record.vehicleId)}
                  onEdit={handleOpenForm}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No se encontraron registros de peaje con los filtros seleccionados.
                </p>
                <Button 
                  onClick={() => handleOpenForm()} 
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  Registrar Peaje
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Diálogo de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
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
