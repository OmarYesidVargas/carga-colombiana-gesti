
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TollRecordCard from '@/components/tolls/TollRecordCard';
import { TollRecord, Toll, Trip, Vehicle } from '@/types';

interface TollRecordsListProps {
  tollRecords: TollRecord[];
  tolls: Toll[];
  trips: Trip[];
  vehicles: Vehicle[];
  canCreateRecord: boolean;
  onEdit: (record: TollRecord) => void;
  onDelete: (recordId: string) => void;
  onOpenForm: () => void;
}

const TollRecordsList = ({
  tollRecords,
  tolls,
  trips,
  vehicles,
  canCreateRecord,
  onEdit,
  onDelete,
  onOpenForm
}: TollRecordsListProps) => {
  if (tollRecords.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tollRecords.map((record) => {
          try {
            return (
              <TollRecordCard
                key={record.id}
                record={record}
                toll={tolls.find(t => t.id === record.tollId)}
                trip={trips.find(t => t.id === record.tripId)}
                vehicle={vehicles.find(v => v.id === record.vehicleId)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          } catch (error) {
            console.error('Error al renderizar registro:', error, record);
            return null;
          }
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="py-8 sm:py-10 text-center">
        <p className="text-muted-foreground text-sm sm:text-base">
          No se encontraron registros con los filtros seleccionados.
        </p>
        {canCreateRecord && (
          <Button 
            onClick={onOpenForm} 
            className="mt-4 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> 
            Registrar Peaje
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TollRecordsList;
