
import { useState, useEffect } from 'react';
import { Toll } from '@/types';
import { User } from '@supabase/supabase-js';
import { TollService } from '@/services/tollService';
import { useAuditLogger } from './useAuditLogger';

export const useTollsState = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const [tolls, setTolls] = useState<Toll[]>([]);
  const { logRead } = useAuditLogger(user);
  
  const loadTolls = async () => {
    if (!user) {
      setTolls([]);
      return;
    }
    
    try {
      setGlobalLoading(true);
      const fetchedTolls = await TollService.fetchTolls(user.id);
      setTolls(fetchedTolls);

      // Auditar la carga de peajes
      await logRead('tolls', undefined, { 
        count: fetchedTolls.length,
        action: 'load_all_tolls'
      });
    } catch (error) {
      // Error already handled in service
    } finally {
      setGlobalLoading(false);
    }
  };
  
  useEffect(() => {
    loadTolls();
  }, [user]);

  const getTollById = (id: string) => {
    if (!id || typeof id !== 'string') return undefined;
    const toll = tolls.find(toll => toll.id === id);
    
    if (toll) {
      logRead('tolls', id, { action: 'get_toll_by_id' });
    }
    
    return toll;
  };

  return {
    tolls,
    setTolls,
    getTollById
  };
};
