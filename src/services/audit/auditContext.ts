
/**
 * Utilidades de contexto para el sistema de auditoría
 * 
 * Maneja la obtención de información del contexto actual del usuario
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { AuditContext } from '@/types/audit';

/**
 * Obtiene información del contexto actual del usuario
 * @returns {AuditContext} Información del contexto de auditoría
 */
export const getAuditContext = (): AuditContext => {
  return {
    userAgent: navigator.userAgent,
    sessionId: sessionStorage.getItem('audit_session_id') || crypto.randomUUID(),
  };
};

/**
 * Inicializa el session ID para auditoría si no existe
 * @param {string} sessionId - ID de sesión a guardar
 */
export const initializeAuditSession = (sessionId: string): void => {
  if (!sessionStorage.getItem('audit_session_id')) {
    sessionStorage.setItem('audit_session_id', sessionId);
  }
};
