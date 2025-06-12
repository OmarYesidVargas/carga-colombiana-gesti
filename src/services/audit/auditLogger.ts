
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
  console.log('[Audit] Iniciando creación de log de auditoría:', {
    hasUser: !!user,
    userId: user?.id,
    operation: params.operation,
    tableName: params.tableName,
    recordId: params.recordId
  });

  // Si no hay usuario, registrar el motivo y no crear auditoría
  if (!user) {
    console.warn('[Audit] ❌ No se puede crear log de auditoría: Usuario no autenticado');
    console.warn('[Audit] Para que funcione la auditoría, el usuario debe estar logueado');
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

    console.log('[Audit] 📝 Datos del log de auditoría preparados:', {
      user_id: auditData.user_id,
      table_name: auditData.table_name,
      operation: auditData.operation,
      record_id: auditData.record_id,
      session_id: auditData.session_id
    });

    // Primero intentar con Edge Function
    try {
      console.log('[Audit] 🚀 Intentando usar Edge Function...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('[Audit] ⏰ Timeout de Edge Function después de 10 segundos');
        controller.abort();
      }, 10000);

      const { data, error } = await supabase.functions.invoke('create-audit-log', {
        body: { audit_data: auditData },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      
      if (error) {
        console.error('[Audit] ❌ Error desde Edge Function:', error);
        throw error;
      }

      console.log('[Audit] ✅ Log de auditoría creado exitosamente vía Edge Function:', data);
      return true;
    } catch (edgeFunctionError) {
      console.warn('[Audit] ⚠️ Edge Function falló, intentando inserción directa:', edgeFunctionError);
      
      // Fallback: inserción directa si la Edge Function falla
      console.log('[Audit] 🔄 Intentando inserción directa en la base de datos...');
      
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
        console.error('[Audit] ❌ Inserción directa también falló:', directError);
        console.error('[Audit] Detalles del error:', {
          code: directError.code,
          message: directError.message,
          details: directError.details,
          hint: directError.hint
        });
        return false;
      }

      console.log('[Audit] ✅ Log de auditoría creado exitosamente vía inserción directa');
      return true;
    }

  } catch (error) {
    console.error('[Audit] ❌ Error inesperado creando log de auditoría:', error);
    console.error('[Audit] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    return false;
  }
};
