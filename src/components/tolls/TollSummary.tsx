
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TollRecord, Toll, Trip, Vehicle } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface TollSummaryProps {
  tollRecords: TollRecord[];
  tolls?: Toll[];
  trips?: Trip[];
  vehicles?: Vehicle[];
  title?: string;
}

/**
 * Componente que muestra un resumen detallado de peajes
 * Incluye estadísticas por viaje, vehículo y peajes más frecuentes
 */
const TollSummary = ({ 
  tollRecords, 
  tolls = [], 
  trips = [], 
  vehicles = [], 
  title = "Resumen de peajes" 
}: TollSummaryProps) => {
  // Calcular el total de gastos en peajes
  const totalTollExpenses = tollRecords.reduce((sum, record) => sum + record.price, 0);
  
  // Calcular peajes por viaje
  const tollsByTrip = React.useMemo(() => {
    const tripTolls: Record<string, number> = {};
    tollRecords.forEach((record) => {
      if (!tripTolls[record.tripId]) {
        tripTolls[record.tripId] = 0;
      }
      tripTolls[record.tripId] += record.price;
    });
    
    return trips
      .map((trip) => {
        const vehicle = vehicles?.find((v) => v.id === trip.vehicleId);
        return {
          ...trip,
          vehicle,
          totalTolls: tripTolls[trip.id] || 0,
        };
      })
      .sort((a, b) => b.totalTolls - a.totalTolls);
  }, [tollRecords, trips, vehicles]);
  
  // Calcular peajes por vehículo
  const tollsByVehicle = React.useMemo(() => {
    const vehicleTolls: Record<string, number> = {};
    tollRecords.forEach((record) => {
      if (!vehicleTolls[record.vehicleId]) {
        vehicleTolls[record.vehicleId] = 0;
      }
      vehicleTolls[record.vehicleId] += record.price;
    });
    
    return vehicles
      .map((vehicle) => ({
        ...vehicle,
        totalTolls: vehicleTolls[vehicle.id] || 0,
      }))
      .sort((a, b) => b.totalTolls - a.totalTolls);
  }, [tollRecords, vehicles]);
  
  // Calcular peajes más frecuentes
  const mostFrequentTolls = React.useMemo(() => {
    const tollFrequency: Record<string, { count: number, total: number }> = {};
    
    tollRecords.forEach((record) => {
      if (!tollFrequency[record.tollId]) {
        tollFrequency[record.tollId] = { count: 0, total: 0 };
      }
      tollFrequency[record.tollId].count += 1;
      tollFrequency[record.tollId].total += record.price;
    });
    
    return tolls
      .map((toll) => ({
        ...toll,
        count: tollFrequency[toll.id]?.count || 0,
        totalAmount: tollFrequency[toll.id]?.total || 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [tollRecords, tolls]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total de peajes */}
          <div className="text-center">
            <h3 className="text-2xl font-bold">
              {formatCurrency(totalTollExpenses)}
            </h3>
            <p className="text-sm text-muted-foreground">
              Total en peajes ({tollRecords.length} registros)
            </p>
          </div>
          
          {/* Peajes más frecuentes */}
          {mostFrequentTolls.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Peajes más utilizados:</h4>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {mostFrequentTolls
                  .filter((t) => t.count > 0)
                  .slice(0, 5)
                  .map((toll) => (
                    <div key={toll.id} className="flex items-center justify-between">
                      <div>
                        <span>{toll.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({toll.count})</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(toll.totalAmount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Peajes por vehículo */}
          {tollsByVehicle.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Peajes por vehículo:</h4>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {tollsByVehicle
                  .filter((v) => v.totalTolls > 0)
                  .slice(0, 5)
                  .map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between">
                      <span className="vehicle-plate">{vehicle.plate}</span>
                      <span className="font-medium">
                        {formatCurrency(vehicle.totalTolls)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Peajes por viaje */}
          {tollsByTrip.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Peajes por viaje:</h4>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {tollsByTrip
                  .filter((t) => t.totalTolls > 0)
                  .slice(0, 5)
                  .map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between">
                      <span className="truncate max-w-[150px]">
                        {trip.origin} → {trip.destination}
                        {trip.vehicle && <span className="text-xs ml-1">({trip.vehicle.plate})</span>}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(trip.totalTolls)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TollSummary;
