
/**
 * Servicio de Auditoría para TransporegistrosPlus
 * 
 * Maneja el registro de todas las operaciones CRUD realizadas
 * por los usuarios en el sistema para mantener un histórico completo
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuditOperation, CreateAuditLogParams, AuditContext } from '@/types/audit';

/**
 * Obtiene información del contexto actual del usuario
 * @returns {AuditContext} Información del contexto de auditoría
 */
const getAuditContext = (): AuditContext => {
  return {
    userAgent: navigator.userAgent,
    sessionId: sessionStorage.getItem('audit_session_id') || crypto.randomUUID(),
  };
};

/**
 * Registra una operación en el log de auditoría de forma silenciosa
 * 
 * @param {User | null} user - Usuario que realiza la operación
 * @param {CreateAuditLogParams} params - Parámetros del log de auditoría
 * @returns {Promise<boolean>} true si el registro fue exitoso
 */
export const createAuditLog = async (
  user: User | null,
  params: CreateAuditLogParams
): Promise<boolean> => {
  // Si no hay usuario, no registrar auditoría
  if (!user) {
    return false;
  }

  try {
    const context = getAuditContext();
    
    // Guardar session ID para consistencia
    if (!sessionStorage.getItem('audit_session_id')) {
      sessionStorage.setItem('audit_session_id', context.sessionId!);
    }
    
    const auditData = {
      user_id: user.id,
      table_name: params.tableName,
      operation: params.operation,
      record_id: params.recordId || null,
      old_values: params.oldValues || null,
      new_values: params.newValues || null,
      user_agent: context.userAgent,
      session_id: context.sessionId,
      additional_info: params.additionalInfo || null,
      created_at: new Date().toISOString()
    };

    // Timeout más corto y manejo silencioso de errores
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const { error } = await supabase.functions.invoke('create-audit-log', {
        body: { audit_data: auditData },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      return !error;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Silenciar errores de red para no afectar UX
      return false;
    }

  } catch (error) {
    // Silenciar todos los errores de auditoría
    return false;
  }
};

/**
 * Registra una operación de lectura (READ) - Deshabilitada para rendimiento
 */
export const auditRead = async (
  user: User | null,
  tableName: string,
  recordId?: string,
  additionalInfo?: Record<string, any>
): Promise<void> => {
  // No hacer auditoría de lecturas para reducir carga
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
  // Ejecutar de forma asíncrona sin bloquear la UI
  setTimeout(() => {
    createAuditLog(user, {
      tableName,
      operation: 'CREATE',
      recordId,
      newValues,
      additionalInfo
    });
  }, 0);
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
  // Ejecutar de forma asíncrona sin bloquear la UI
  setTimeout(() => {
    createAuditLog(user, {
      tableName,
      operation: 'UPDATE',
      recordId,
      oldValues,
      newValues,
      additionalInfo
    });
  }, 0);
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
  // Ejecutar de forma asíncrona sin bloquear la UI
  setTimeout(() => {
    createAuditLog(user, {
      tableName,
      operation: 'DELETE',
      recordId,
      oldValues,
      additionalInfo
    });
  }, 0);
};

/**
 * Obtiene los logs de auditoría del usuario actual
 */
export const getAuditLogs = async (
  user: User | null,
  limit: number = 50,
  offset: number = 0
): Promise<any[]> => {
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
};
