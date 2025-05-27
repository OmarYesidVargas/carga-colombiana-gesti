
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TripsHeaderProps {
  onNewTrip: () => void;
}

/**
 * Componente header para la página de viajes
 * 
 * Incluye:
 * - Título y descripción de la página
 * - Botón para crear nuevo viaje
 * - Diseño responsivo
 * 
 * @param onNewTrip - Función para abrir el formulario de nuevo viaje
 */
const TripsHeader = ({ onNewTrip }: TripsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Viajes</h1>
        <p className="text-muted-foreground">
          Gestiona los viajes de tus vehículos
        </p>
      </div>
      
      <Button onClick={onNewTrip}>
        <Plus className="mr-2 h-4 w-4" /> 
        Nuevo Viaje
      </Button>
    </div>
  );
};

export default TripsHeader;
