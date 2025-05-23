
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer";
import { Vehicle, Trip } from '@/types';
import { useMobile } from '@/hooks/use-mobile';

/**
 * Props para el componente de filtros de gastos
 */
interface ExpenseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedVehicleId: string | 'all';
  setSelectedVehicleId: (id: string | 'all') => void;
  selectedTripId: string | 'all';
  setSelectedTripId: (id: string | 'all') => void;
  vehicles: Vehicle[];
  trips: Trip[];
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

/**
 * Componente de filtros para la página de gastos
 * Proporciona búsqueda y filtrado por vehículo y viaje
 */
const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedVehicleId,
  setSelectedVehicleId,
  selectedTripId,
  setSelectedTripId,
  vehicles,
  trips,
  isFilterOpen,
  setIsFilterOpen
}) => {
  const isMobile = useMobile();

  // Contenido de los filtros
  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehículo</label>
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
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Viaje</label>
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
  );

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar gastos..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Filtros móviles con Drawer */}
      {isMobile ? (
        <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filtros</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-2">
              <FilterContent />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">Cerrar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <>
          {/* Filtros para tablet - Popover */}
          <div className="block lg:hidden">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <h4 className="font-medium mb-4">Filtros</h4>
                <FilterContent />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Filtros escritorio - Inline */}
          <div className="hidden lg:flex items-center gap-4 flex-wrap">
            <div className="w-64">
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
            
            <div className="w-64">
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
        </>
      )}
    </div>
  );
};

export default ExpenseFilters;
