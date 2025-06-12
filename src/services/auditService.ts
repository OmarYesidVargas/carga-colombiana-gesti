
/**
 * Servicio de Auditoría para TransporegistrosPlus
 * 
 * Punto de entrada principal para el sistema de auditoría
 * Re-exporta todas las funciones necesarias desde los módulos especializados
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

// Re-exportar funciones principales de auditoría
export { createAuditLog } from './audit/auditLogger';
export { 
  auditRead,
  auditCreate,
  auditUpdate,
  auditDelete
} from './audit/auditOperations';
export { getAuditLogs } from './audit/auditQueries';
export { getAuditContext, initializeAuditSession } from './audit/auditContext';
