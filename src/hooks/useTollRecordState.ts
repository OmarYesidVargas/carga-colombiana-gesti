
/**
 * Hook para manejo del estado de registros de peaje
 * 
 * Maneja la carga y el estado local de los registros
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { TollRecord } from '@/types';
import { User } from '@supabase/supabase-js';
import { useAuditLogger } from './useAuditLogger';
import { TollRecordService } from '@/services/tollRecordService';
import { errorHandler } from '@/utils/errorHandler';

export const useTollRecordState = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tollRecords, setTollRecords] = useState<TollRecord[]>([]);
  const { logRead } = useAuditLogger(user);
  
  const loadTollRecords = async () => {
    if (!user) {
      setTollRecords([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      const mappedRecords = await TollRecordService.loadTollRecords(user.id);
      setTollRecords(mappedRecords);

      // Auditar la carga de registros
      await logRead('toll_records', undefined, { 
        count: mappedRecords.length,
        action: 'load_all_toll_records'
      });
    } catch (error) {
      console.error('❌ [useTollRecordState] Error inesperado:', error);
      errorHandler.handleGenericError(error, { component: 'useTollRecordState', action: 'loadTollRecords' });
    } finally {
      setGlobalLoading(false);
    }
  };
  
  useEffect(() => {
    loadTollRecords();
  }, [user]);
  
  const getTollRecordById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    const record = tollRecords.find(record => record.id === id);
    
    if (record) {
      logRead('toll_records', id, { action: 'get_toll_record_by_id' });
    }
    
    return record;
  };

  return {
    tollRecords,
    setTollRecords,
    getTollRecordById
  };
};
