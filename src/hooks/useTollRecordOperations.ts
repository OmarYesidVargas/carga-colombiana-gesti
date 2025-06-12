
/**
 * Hook para operaciones de registros de peaje
 * 
 * Maneja las operaciones CRUD con validación y auditoría
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { TollRecord } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { validateTollRecord } from '@/utils/validators';
import { errorHandler } from '@/utils/errorHandler';
import { useAuditLogger } from './useAuditLogger';
import { TollRecordService } from '@/services/tollRecordService';

export const useTollRecordOperations = (
  user: User | null,
  tollRecords: TollRecord[],
  setTollRecords: React.Dispatch<React.SetStateAction<TollRecord[]>>
) => {
  const { logCreate, logUpdate, logDelete } = useAuditLogger(user);
  
  const addTollRecord = async (record: Omit<TollRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      if (!validateTollRecord(record)) {
        toast.error('Datos del registro incompletos o inválidos');
        return;
      }
      
      const mappedRecord = await TollRecordService.createTollRecord(record, user.id);
      setTollRecords(prev => [mappedRecord, ...prev]);
      
      // Auditar la creación
      await logCreate('toll_records', mappedRecord.id, {
        vehicleId: mappedRecord.vehicleId,
        tripId: mappedRecord.tripId,
        tollId: mappedRecord.tollId,
        price: mappedRecord.price,
        paymentMethod: mappedRecord.paymentMethod
      }, { action: 'create_toll_record' });
      
      toast.success('Registro de peaje agregado correctamente');
    } catch (error) {
      console.error('❌ [useTollRecordOperations] Error inesperado:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecordOperations', action: 'addTollRecord' });
    }
  };
  
  const updateTollRecord = async (id: string, record: Partial<TollRecord>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      const existingRecord = tollRecords.find(r => r.id === id);
      if (!existingRecord) {
        toast.error('Registro no encontrado');
        return;
      }

      await TollRecordService.updateTollRecord(id, record, user.id);
      
      setTollRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record } : r)
      );

      // Auditar la actualización
      await logUpdate('toll_records', id, {
        price: existingRecord.price,
        paymentMethod: existingRecord.paymentMethod
      }, record, { action: 'update_toll_record' });
      
      toast.success('Registro actualizado correctamente');
    } catch (error) {
      console.error('❌ [useTollRecordOperations] Error inesperado al actualizar:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecordOperations', action: 'updateTollRecord' });
    }
  };
  
  const deleteTollRecord = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      const existingRecord = tollRecords.find(r => r.id === id);
      if (!existingRecord) {
        toast.error('Registro no encontrado');
        return;
      }

      await TollRecordService.deleteTollRecord(id, user.id);
      setTollRecords(prev => prev.filter(r => r.id !== id));

      // Auditar la eliminación
      await logDelete('toll_records', id, {
        vehicleId: existingRecord.vehicleId,
        tripId: existingRecord.tripId,
        tollId: existingRecord.tollId,
        price: existingRecord.price,
        paymentMethod: existingRecord.paymentMethod
      }, { action: 'delete_toll_record' });
      
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('❌ [useTollRecordOperations] Error inesperado al eliminar:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecordOperations', action: 'deleteTollRecord' });
    }
  };

  return {
    addTollRecord,
    updateTollRecord,
    deleteTollRecord
  };
};
