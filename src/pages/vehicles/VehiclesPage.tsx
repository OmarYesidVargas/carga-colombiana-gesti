import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleForm from '@/components/vehicles/VehicleForm';
import VehicleDetailDialog from '@/components/vehicles/VehicleDetailDialog';
import { Vehicle } from '@/types';
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

/**
 * Página principal de gestión de vehículos
 * 
 * Características:
 * - Listado de vehículos con búsqueda
 * - Creación y edición de vehículos
 * - Eliminación con confirmación
 * - Gestión de documentación colombiana (SOAT, tecnomecánica)
 * - Alertas de vencimiento
 * - Diseño responsivo
 */
const VehiclesPage = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleOpenForm = (vehicle?: Vehicle) => {
    if (vehicle) {
      setCurrentVehicle(vehicle);
    } else {
      setCurrentVehicle(null);
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentVehicle(null);
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    console.log('🚗 Seleccionando vehículo para ver detalles:', vehicle.id);
    setSelectedVehicle(vehicle);
    setIsDetailDialogOpen(true);
  };
  
  const handleSubmitVehicle = (vehicleData: any) => {
    setIsSubmitting(true);
    
    try {
      vehicleData.year = parseInt(vehicleData.year, 10);
      
      if (currentVehicle) {
        updateVehicle(currentVehicle.id, vehicleData);
      } else {
        addVehicle(vehicleData);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete);
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const query = searchQuery.toLowerCase().trim();
    return (
      vehicle.plate.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4 p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">Vehículos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus vehículos de transporte
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> 
              <span className="hidden xs:inline">Nuevo Vehículo</span>
              <span className="xs:hidden">Nuevo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[98vw] max-w-2xl h-[95vh] max-h-[700px] p-0 gap-0 mx-auto">
            <DialogHeader className="p-3 sm:p-4 pb-2">
              <DialogTitle className="text-base sm:text-lg">
                {currentVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {currentVehicle 
                  ? 'Modifica la información del vehículo seleccionado.' 
                  : 'Completa la información para registrar un nuevo vehículo.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden px-3 sm:px-4 pb-3 sm:pb-4">
              <VehicleForm
                initialData={currentVehicle || undefined}
                onSubmit={handleSubmitVehicle}
                onCancel={handleCloseForm}
                isSubmitting={isSubmitting}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Búsqueda */}
      <div className="w-full">
        <Input
          placeholder="Buscar por placa, marca o modelo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm h-8 text-sm"
        />
      </div>
      
      {/* Lista de vehículos */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleOpenForm}
              onDelete={handleDeleteClick}
              onSelect={handleSelectVehicle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-10">
          {searchQuery ? (
            <p className="text-sm text-muted-foreground px-4">No se encontraron vehículos que coincidan con tu búsqueda.</p>
          ) : (
            <p className="text-sm text-muted-foreground px-4">
              No hay vehículos registrados. Haz clic en "Nuevo Vehículo" para agregar uno.
            </p>
          )}
        </div>
      )}

      {/* Diálogo de detalles del vehículo */}
      <VehicleDetailDialog
        vehicle={selectedVehicle}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Esta acción no se puede deshacer. El vehículo será eliminado permanentemente.
              <br />
              <br />
              Nota: No se pueden eliminar vehículos que tengan viajes asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VehiclesPage;
