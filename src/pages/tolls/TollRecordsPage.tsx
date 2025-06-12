
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
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
import TollRecordForm from '@/components/tolls/TollRecordForm';
import TollSummary from '@/components/tolls/TollSummary';
import TollRecordsHeader from '@/components/tolls/TollRecordsHeader';
import TollRecordsConfigWarning from '@/components/tolls/TollRecordsConfigWarning';
import TollRecordsFilters from '@/components/tolls/TollRecordsFilters';
import TollRecordsList from '@/components/tolls/TollRecordsList';
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
      <TollRecordsHeader 
        canCreateRecord={canCreateRecord}
        onOpenForm={() => handleOpenForm()}
      />

      <TollRecordsConfigWarning 
        trips={trips}
        tolls={tolls}
        vehicles={vehicles}
      />
      
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
          <TollRecordsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTripId={selectedTripId}
            setSelectedTripId={setSelectedTripId}
            selectedVehicleId={selectedVehicleId}
            setSelectedVehicleId={setSelectedVehicleId}
            trips={trips}
            vehicles={vehicles}
          />
          
          <TollRecordsList
            tollRecords={sortedRecords}
            tolls={tolls}
            trips={trips}
            vehicles={vehicles}
            canCreateRecord={canCreateRecord}
            onEdit={handleOpenForm}
            onDelete={handleDeleteClick}
            onOpenForm={() => handleOpenForm()}
          />
        </div>
      </div>
      
      {/* Diálogo de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[95vh] p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg sm:text-xl">
              {currentRecord ? 'Editar Registro' : 'Registrar Peaje'}
            </DialogTitle>
            <DialogDescription className="text-sm">
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
