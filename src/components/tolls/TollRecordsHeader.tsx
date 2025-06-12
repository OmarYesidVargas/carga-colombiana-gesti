
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TollRecordsHeaderProps {
  canCreateRecord: boolean;
  onOpenForm: () => void;
}

const TollRecordsHeader = ({ canCreateRecord, onOpenForm }: TollRecordsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">Registro de Peajes</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gestiona los registros de paso por peajes
        </p>
      </div>
      
      <Button 
        onClick={onOpenForm}
        disabled={!canCreateRecord}
        className="w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" /> 
        Registrar Peaje
      </Button>
    </div>
  );
};

export default TollRecordsHeader;
