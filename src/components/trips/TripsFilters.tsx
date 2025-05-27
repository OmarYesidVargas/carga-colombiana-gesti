
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '@/types';

interface TripsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  vehicleFilter: string;
  onVehicleFilterChange: (vehicleId: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  vehicles: Vehicle[];
}

/**
 * Componente de filtros para la página de viajes
 * 
 * Incluye:
 * - Búsqueda por origen/destino
 * - Filtro por vehículo
 * - Filtro por estado del viaje
 * - Diseño responsivo
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
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Buscar por origen o destino..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9"
        />
      </div>
      
      <Select value={vehicleFilter} onValueChange={onVehicleFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px] h-9">
          <SelectValue placeholder="Filtrar por vehículo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los vehículos</SelectItem>
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              {vehicle.plate} - {vehicle.brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[160px] h-9">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="completed">Completados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TripsFilters;
