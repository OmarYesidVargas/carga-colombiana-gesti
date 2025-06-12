
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trip, Toll, Vehicle } from '@/types';

interface TollRecordsConfigWarningProps {
  trips: Trip[];
  tolls: Toll[];
  vehicles: Vehicle[];
}

const TollRecordsConfigWarning = ({ trips, tolls, vehicles }: TollRecordsConfigWarningProps) => {
  const hasAllRequiredData = trips.length > 0 && tolls.length > 0 && vehicles.length > 0;
  
  if (hasAllRequiredData) return null;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <h3 className="font-medium text-orange-800">Configuración requerida</h3>
            <p className="text-sm text-orange-700 mt-1">
              Para registrar peajes necesita tener:
            </p>
            <ul className="list-disc list-inside text-sm text-orange-700 mt-2 space-y-1">
              {vehicles.length === 0 && <li>Al menos un vehículo registrado</li>}
              {trips.length === 0 && <li>Al menos un viaje registrado</li>}
              {tolls.length === 0 && <li>Al menos un peaje registrado</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRecordsConfigWarning;
