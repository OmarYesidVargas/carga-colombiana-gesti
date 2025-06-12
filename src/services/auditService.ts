
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
 * Registra una operación en el log de auditoría
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
    console.warn('[Audit] No user provided, skipping audit log');
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

    console.log('[Audit] Creating audit log:', {
      user_id: auditData.user_id,
      table_name: auditData.table_name,
      operation: auditData.operation,
      record_id: auditData.record_id
    });

    // Usar función de Edge directamente con timeout más largo
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const { data, error } = await supabase.functions.invoke('create-audit-log', {
        body: { audit_data: auditData },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      
      if (error) {
        console.error('[Audit] Error from edge function:', error);
        return false;
      }

      console.log('[Audit] Successfully created audit log:', data);
      return true;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('[Audit] Network error creating audit log:', fetchError);
      return false;
    }

  } catch (error) {
    console.error('[Audit] Unexpected error creating audit log:', error);
    return false;
  }
};

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
      console.error('[Audit] Error fetching audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Audit] Error fetching audit logs:', error);
    return [];
  }
};
