
/**
 * Hook personalizado para logging de auditoría
 * 
 * Proporciona funciones fáciles de usar para registrar
 * operaciones CRUD en el sistema de auditoría
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  auditCreate, 
  auditRead, 
  auditUpdate, 
  auditDelete 
} from '@/services/auditService';

/**
 * Hook para logging de auditoría
 * 
 * @param {User | null} user - Usuario actual
 * @returns {Object} Funciones para registrar operaciones de auditoría
 */
export const useAuditLogger = (user: User | null) => {
  
  /**
   * Registra una operación de lectura
   */
  const logRead = useCallback(async (
    tableName: string,
    recordId?: string,
    additionalInfo?: Record<string, any>
  ) => {
    await auditRead(user, tableName, recordId, additionalInfo);
  }, [user]);

  /**
   * Registra una operación de creación
   */
  const logCreate = useCallback(async (
    tableName: string,
    recordId: string,
    newValues: Record<string, any>,
    additionalInfo?: Record<string, any>
  ) => {
    await auditCreate(user, tableName, recordId, newValues, additionalInfo);
  }, [user]);

  /**
   * Registra una operación de actualización
   */
  const logUpdate = useCallback(async (
    tableName: string,
    recordId: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    additionalInfo?: Record<string, any>
  ) => {
    await auditUpdate(user, tableName, recordId, oldValues, newValues, additionalInfo);
  }, [user]);

  /**
   * Registra una operación de eliminación
   */
  const logDelete = useCallback(async (
    tableName: string,
    recordId: string,
    oldValues: Record<string, any>,
    additionalInfo?: Record<string, any>
  ) => {
    await auditDelete(user, tableName, recordId, oldValues, additionalInfo);
  }, [user]);

  return {
    logRead,
    logCreate,
    logUpdate,
    logDelete
  };
};
