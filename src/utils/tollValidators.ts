
import { Toll } from '@/types';
import { validateToll } from '@/utils/validators';

export class TollValidators {
  static validateTollData(toll: Omit<Toll, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): boolean {
    return validateToll(toll);
  }

  static checkDuplicateToll(
    tolls: Toll[], 
    name: string, 
    location: string, 
    excludeId?: string
  ): boolean {
    return tolls.some(t => 
      (excludeId ? t.id !== excludeId : true) &&
      t.name.toLowerCase().trim() === name.toLowerCase().trim() &&
      t.location.toLowerCase().trim() === location.toLowerCase().trim()
    );
  }

  static validateTollUpdate(
    tolls: Toll[],
    id: string,
    updateData: Partial<Toll>,
    currentToll: Toll
  ): { isValid: boolean; error?: string } {
    if (updateData.name || updateData.location) {
      const checkName = updateData.name || currentToll.name;
      const checkLocation = updateData.location || currentToll.location;
      
      if (this.checkDuplicateToll(tolls, checkName, checkLocation, id)) {
        return {
          isValid: false,
          error: 'Ya existe un peaje con este nombre en esta ubicación'
        };
      }
    }
    
    return { isValid: true };
  }
}
