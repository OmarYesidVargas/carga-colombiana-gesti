
/**
 * Logger central para el sistema de auditoría
 * 
 * Maneja la creación de logs de auditoría con manejo robusto de errores
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { CreateAuditLogParams } from '@/types/audit';
import { getAuditContext, initializeAuditSession } from './auditContext';

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
    initializeAuditSession(context.sessionId!);
    
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
