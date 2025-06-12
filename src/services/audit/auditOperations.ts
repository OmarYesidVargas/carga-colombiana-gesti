
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
    try {
      await createAuditLog(user, {
        tableName,
        operation: 'READ',
        recordId,
        additionalInfo
      });
    } catch (error) {
      console.error('Error en auditRead:', error);
    }
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
  try {
    console.log('🔄 [AuditOperations] Registrando CREATE:', { tableName, recordId });
    await createAuditLog(user, {
      tableName,
      operation: 'CREATE',
      recordId,
      newValues,
      additionalInfo
    });
    console.log('✅ [AuditOperations] CREATE registrado exitosamente');
  } catch (error) {
    console.error('❌ [AuditOperations] Error en auditCreate:', error);
  }
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
  try {
    console.log('🔄 [AuditOperations] Registrando UPDATE:', { tableName, recordId });
    await createAuditLog(user, {
      tableName,
      operation: 'UPDATE',
      recordId,
      oldValues,
      newValues,
      additionalInfo
    });
    console.log('✅ [AuditOperations] UPDATE registrado exitosamente');
  } catch (error) {
    console.error('❌ [AuditOperations] Error en auditUpdate:', error);
  }
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
  try {
    console.log('🔄 [AuditOperations] Registrando DELETE:', { tableName, recordId });
    await createAuditLog(user, {
      tableName,
      operation: 'DELETE',
      recordId,
      oldValues,
      additionalInfo
    });
    console.log('✅ [AuditOperations] DELETE registrado exitosamente');
  } catch (error) {
    console.error('❌ [AuditOperations] Error en auditDelete:', error);
  }
};
