
/**
 * Hook principal para registros de peaje
 * 
 * Punto de entrada principal que combina estado y operaciones
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { User } from '@supabase/supabase-js';
import { useTollRecordState } from './useTollRecordState';
import { useTollRecordOperations } from './useTollRecordOperations';

export const useTollRecords = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const { tollRecords, setTollRecords, getTollRecordById } = useTollRecordState(user, setGlobalLoading);
  const { addTollRecord, updateTollRecord, deleteTollRecord } = useTollRecordOperations(user, tollRecords, setTollRecords);
  
  return {
    tollRecords,
    getTollRecordById,
    addTollRecord,
    updateTollRecord,
    deleteTollRecord
  };
};
