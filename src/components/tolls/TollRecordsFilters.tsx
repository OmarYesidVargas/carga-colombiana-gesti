
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Trip, Vehicle } from '@/types';

interface TollRecordsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTripId: string | 'all';
  setSelectedTripId: (value: string | 'all') => void;
  selectedVehicleId: string | 'all';
  setSelectedVehicleId: (value: string | 'all') => void;
  trips: Trip[];
  vehicles: Vehicle[];
}

const TollRecordsFilters = ({
  searchTerm,
  setSearchTerm,
  selectedTripId,
  setSelectedTripId,
  selectedVehicleId,
  setSelectedVehicleId,
  trips,
  vehicles
}: TollRecordsFiltersProps) => {
  return (
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
  );
};

export default TollRecordsFilters;
