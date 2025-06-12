
/**
 * Consultas de auditoría
 * 
 * Maneja la recuperación de logs de auditoría desde la base de datos
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

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
