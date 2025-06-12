
import { Toll } from '@/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { TollService } from '@/services/tollService';
import { TollValidators } from '@/utils/tollValidators';
import { useAuditLogger } from './useAuditLogger';

export const useTollOperations = (
  user: User | null,
  tolls: Toll[],
  setTolls: React.Dispatch<React.SetStateAction<Toll[]>>
) => {
  const { logCreate, logUpdate, logDelete } = useAuditLogger(user);

  const addToll = async (toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    try {
      if (!TollValidators.validateTollData(toll)) {
        toast.error('Datos del peaje incompletos o inválidos');
        return;
      }

      if (TollValidators.checkDuplicateToll(tolls, toll.name, toll.location)) {
        toast.error('Ya existe un peaje con este nombre en esta ubicación');
        return;
      }
      
      const mappedToll = await TollService.createToll(toll, user.id);
      setTolls(prev => [mappedToll, ...prev]);

      // Auditar la creación
      await logCreate('tolls', mappedToll.id, {
        name: mappedToll.name,
        location: mappedToll.location,
        price: mappedToll.price,
        category: mappedToll.category
      }, { action: 'create_toll' });
      
      toast.success('Peaje agregado correctamente');
    } catch (error) {
      // Error already handled in service
    }
  };
  
  const updateToll = async (id: string, toll: Partial<Toll>) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para actualizar');
      return;
    }
    
    try {
      const currentToll = tolls.find(t => t.id === id);
      if (!currentToll) {
        toast.error('Peaje no encontrado');
        return;
      }

      const validation = TollValidators.validateTollUpdate(tolls, id, toll, currentToll);
      if (!validation.isValid) {
        toast.error(validation.error!);
        return;
      }
      
      await TollService.updateToll(id, toll);
      
      setTolls(prev => 
        prev.map(t => t.id === id ? { ...t, ...toll } : t)
      );

      // Auditar la actualización
      await logUpdate('tolls', id, {
        name: currentToll.name,
        location: currentToll.location,
        price: currentToll.price
      }, toll, { action: 'update_toll' });
      
      toast.success('Peaje actualizado correctamente');
    } catch (error) {
      // Error already handled in service
    }
  };
  
  const deleteToll = async (id: string) => {
    if (!user || !id) {
      toast.error('Parámetros inválidos para eliminar');
      return;
    }
    
    try {
      const existingToll = tolls.find(t => t.id === id);
      if (!existingToll) {
        toast.error('Peaje no encontrado');
        return;
      }

      const hasDependencies = await TollService.checkTollDependencies(id, user.id);
      if (hasDependencies) {
        toast.error('No se puede eliminar el peaje porque tiene registros asociados');
        return;
      }
      
      await TollService.deleteToll(id);
      setTolls(prev => prev.filter(t => t.id !== id));

      // Auditar la eliminación
      await logDelete('tolls', id, {
        name: existingToll.name,
        location: existingToll.location,
        price: existingToll.price,
        category: existingToll.category
      }, { action: 'delete_toll' });
      
      toast.success('Peaje eliminado correctamente');
    } catch (error) {
      // Error already handled in service
    }
  };

  return {
    addToll,
    updateToll,
    deleteToll
  };
};
