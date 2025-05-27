
/**
 * Tipos para el sistema de auditoría
 * 
 * Define las interfaces y tipos necesarios para registrar
 * todas las operaciones CRUD realizadas por los usuarios
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

export type AuditOperation = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export interface AuditLog {
  id: string;
  userId: string | null;
  tableName: string;
  operation: AuditOperation;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  sessionId?: string;
  additionalInfo?: Record<string, any>;
}

export interface CreateAuditLogParams {
  tableName: string;
  operation: AuditOperation;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  additionalInfo?: Record<string, any>;
}

export interface AuditContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}
