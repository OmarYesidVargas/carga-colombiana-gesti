
import { User } from '@supabase/supabase-js';
import { useTollsState } from './useTollsState';
import { useTollOperations } from './useTollOperations';

export const useTolls = (user: User | null, setGlobalLoading: (loading: boolean) => void) => {
  const { tolls, setTolls, getTollById } = useTollsState(user, setGlobalLoading);
  const { addToll, updateToll, deleteToll } = useTollOperations(user, tolls, setTolls);
  
  return {
    tolls,
    getTollById,
    addToll,
    updateToll,
    deleteToll
  };
};
