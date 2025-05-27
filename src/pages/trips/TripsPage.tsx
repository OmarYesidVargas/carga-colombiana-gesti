
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
import TripCard from '@/components/trips/TripCard';
import TripForm from '@/components/trips/TripForm';
import { Trip } from '@/types';
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
import { useNavigate } from 'react-router-dom';
import TripsFilters from '@/components/trips/TripsFilters';
import TripsHeader from '@/components/trips/TripsHeader';

/**
 * Página principal de gestión de viajes
 * 
 * Características:
 * - Listado de viajes con filtros avanzados
 * - Creación y edición de viajes
 * - Eliminación con confirmación
 * - Navegación a detalles de viaje
 * - Diseño responsivo
 * 
 * Filtros disponibles:
 * - Búsqueda por origen/destino
 * - Filtro por vehículo
 * - Filtro por estado (activo/completado)
 */
const TripsPage = () => {
  const { vehicles, trips, addTrip, updateTrip, deleteTrip } = useData();
  const navigate = useNavigate();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const handleOpenForm = (trip?: Trip) => {
    if (trip) {
      setCurrentTrip(trip);
    } else {
      setCurrentTrip(null);
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentTrip(null);
  };
  
  const handleSubmitTrip = (tripData: any) => {
    setIsSubmitting(true);
    
    try {
      tripData.distance = parseFloat(tripData.distance);
      
      if (currentTrip) {
        updateTrip(currentTrip.id, tripData);
      } else {
        addTrip(tripData);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error al guardar viaje:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (tripId: string) => {
    setTripToDelete(tripId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete);
      setIsDeleteDialogOpen(false);
      setTripToDelete(null);
    }
  };
  
  const handleViewTrip = (trip: Trip) => {
    navigate(`/trips/${trip.id}`);
  };
  
  // Filtrar viajes según la búsqueda y filtros
  const filteredTrips = trips.filter(trip => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      trip.origin.toLowerCase().includes(query) ||
      trip.destination.toLowerCase().includes(query);
    
    const matchesVehicle = 
      vehicleFilter === 'all' || trip.vehicleId === vehicleFilter;
    
    const isActive = !trip.endDate || new Date() <= new Date(trip.endDate);
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && isActive) || 
      (statusFilter === 'completed' && !isActive);
    
    return matchesSearch && matchesVehicle && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <TripsHeader onNewTrip={() => handleOpenForm()} />
      
      {/* Diálogo del formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {currentTrip ? 'Editar Viaje' : 'Agregar Nuevo Viaje'}
            </DialogTitle>
            <DialogDescription>
              {currentTrip 
                ? 'Modifica la información del viaje seleccionado.' 
                : 'Completa la información para registrar un nuevo viaje.'}
            </DialogDescription>
          </DialogHeader>
          
          <TripForm
            initialData={currentTrip || undefined}
            vehicles={vehicles}
            onSubmit={handleSubmitTrip}
            onCancel={handleCloseForm}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Filtros */}
      <TripsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vehicleFilter={vehicleFilter}
        onVehicleFilterChange={setVehicleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        vehicles={vehicles}
      />
      
      {/* Lista de viajes */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrips.map((trip) => {
            const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
            
            return (
              <TripCard
                key={trip.id}
                trip={trip}
                vehicle={vehicle}
                onEdit={handleOpenForm}
                onDelete={handleDeleteClick}
                onSelect={handleViewTrip}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          {searchQuery || vehicleFilter !== 'all' || statusFilter !== 'all' ? (
            <p className="text-muted-foreground">
              No se encontraron viajes que coincidan con tus filtros.
            </p>
          ) : (
            <p className="text-muted-foreground">
              No hay viajes registrados. Haz clic en "Nuevo Viaje" para agregar uno.
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
              Esta acción no se puede deshacer. El viaje será eliminado permanentemente junto con todos los gastos asociados.
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

export default TripsPage;
