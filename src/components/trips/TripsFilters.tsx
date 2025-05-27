
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '@/types';

interface TripsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  vehicleFilter: string;
  onVehicleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  vehicles: Vehicle[];
}

/**
 * Componente de filtros para la página de viajes
 * 
 * Filtros disponibles:
 * - Búsqueda por texto (origen/destino)
 * - Filtro por vehículo específico
 * - Filtro por estado del viaje
 * 
 * @param searchQuery - Término de búsqueda actual
 * @param onSearchChange - Función para actualizar búsqueda
 * @param vehicleFilter - Vehículo seleccionado en filtro
 * @param onVehicleFilterChange - Función para cambiar filtro de vehículo
 * @param statusFilter - Estado seleccionado en filtro
 * @param onStatusFilterChange - Función para cambiar filtro de estado
 * @param vehicles - Lista de vehículos disponibles
 */
const TripsFilters = ({
  searchQuery,
  onSearchChange,
  vehicleFilter,
  onVehicleFilterChange,
  statusFilter,
  onStatusFilterChange,
  vehicles
}: TripsFiltersProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <Input
          placeholder="Buscar por origen o destino..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9"
        />
      </div>
      
      <div>
        <Select value={vehicleFilter} onValueChange={onVehicleFilterChange}>
          <SelectTrigger className="h-9">
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
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Viajes activos</SelectItem>
            <SelectItem value="completed">Viajes completados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TripsFilters;
