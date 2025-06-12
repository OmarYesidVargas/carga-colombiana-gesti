
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

    // Primero intentar con Edge Function
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase.functions.invoke('create-audit-log', {
        body: { audit_data: auditData },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      
      if (error) {
        console.error('[Audit] Error from edge function:', error);
        throw error;
      }

      console.log('[Audit] Successfully created audit log via Edge Function:', data);
      return true;
    } catch (edgeFunctionError) {
      console.warn('[Audit] Edge function failed, trying direct insertion:', edgeFunctionError);
      
      // Fallback: inserción directa si la Edge Function falla
      const { error: directError } = await supabase
        .from('audit_logs')
        .insert({
          user_id: auditData.user_id,
          table_name: auditData.table_name,
          operation: auditData.operation,
          record_id: auditData.record_id,
          old_values: auditData.old_values,
          new_values: auditData.new_values,
          user_agent: auditData.user_agent,
          session_id: auditData.session_id,
          additional_info: auditData.additional_info
        });

      if (directError) {
        console.error('[Audit] Direct insertion also failed:', directError);
        return false;
      }

      console.log('[Audit] Successfully created audit log via direct insertion');
      return true;
    }

  } catch (error) {
    console.error('[Audit] Unexpected error creating audit log:', error);
    return false;
  }
};
