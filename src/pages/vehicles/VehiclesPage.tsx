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

const VehiclesPage = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vehículos</h1>
          <p className="text-muted-foreground">
            Gestiona tus vehículos de transporte
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="mr-2 h-4 w-4" /> 
              Nuevo Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {currentVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
              </DialogTitle>
              <DialogDescription>
                {currentVehicle 
                  ? 'Modifica la información del vehículo seleccionado.' 
                  : 'Completa la información para registrar un nuevo vehículo.'}
              </DialogDescription>
            </DialogHeader>
            
            <VehicleForm
              initialData={currentVehicle || undefined}
              onSubmit={handleSubmitVehicle}
              onCancel={handleCloseForm}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Búsqueda */}
      <div>
        <Input
          placeholder="Buscar por placa, marca o modelo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Lista de vehículos */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleOpenForm}
              onDelete={handleDeleteClick}
              onSelect={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          {searchQuery ? (
            <p className="text-muted-foreground">No se encontraron vehículos que coincidan con tu búsqueda.</p>
          ) : (
            <p className="text-muted-foreground">
              No hay vehículos registrados. Haz clic en "Nuevo Vehículo" para agregar uno.
            </p>
          )}
        </div>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El vehículo será eliminado permanentemente.
              <br />
              <br />
              Nota: No se pueden eliminar vehículos que tengan viajes asociados.
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

export default VehiclesPage;
