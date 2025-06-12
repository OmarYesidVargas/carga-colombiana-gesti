
/**
 * Operaciones específicas de auditoría
 * 
 * Proporciona funciones especializadas para cada tipo de operación CRUD
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { User } from '@supabase/supabase-js';
import { createAuditLog } from './auditLogger';

/**
 * Registra una operación de lectura (READ)
 */
export const auditRead = async (
  user: User | null,
  tableName: string,
  recordId?: string,
  additionalInfo?: Record<string, any>
): Promise<void> => {
  // Solo auditar lecturas importantes, no todas para evitar spam
  if (additionalInfo?.action && additionalInfo.action.includes('load_all')) {
    await createAuditLog(user, {
      tableName,
      operation: 'READ',
      recordId,
      additionalInfo
    });
  }
};

/**
 * Registra una operación de creación (CREATE)
 */
export const auditCreate = async (
  user: User | null,
  tableName: string,
  recordId: string,
  newValues: Record<string, any>,
  additionalInfo?: Record<string, any>
): Promise<void> => {
  // Ejecutar inmediatamente, no de forma asíncrona
  await createAuditLog(user, {
    tableName,
    operation: 'CREATE',
    recordId,
    newValues,
    additionalInfo
  });
};

/**
 * Registra una operación de actualización (UPDATE)
 */
export const auditUpdate = async (
  user: User | null,
  tableName: string,
  recordId: string,
  oldValues: Record<string, any>,
  newValues: Record<string, any>,
  additionalInfo?: Record<string, any>
): Promise<void> => {
  // Ejecutar inmediatamente, no de forma asíncrona
  await createAuditLog(user, {
    tableName,
    operation: 'UPDATE',
    recordId,
    oldValues,
    newValues,
    additionalInfo
  });
};

/**
 * Registra una operación de eliminación (DELETE)
 */
export const auditDelete = async (
  user: User | null,
  tableName: string,
  recordId: string,
  oldValues: Record<string, any>,
  additionalInfo?: Record<string, any>
): Promise<void> => {
  // Ejecutar inmediatamente, no de forma asíncrona
  await createAuditLog(user, {
    tableName,
    operation: 'DELETE',
    recordId,
    oldValues,
    additionalInfo
  });
};
