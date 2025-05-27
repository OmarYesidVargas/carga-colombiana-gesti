
import { useCallback } from 'react';

interface DebugLoggerConfig {
  component: string;
  enabled?: boolean;
}

/**
 * Hook para logging avanzado y debugging en desarrollo
 * Facilita la identificación de problemas y seguimiento de flujos
 */
export const useDebugLogger = ({ component, enabled = true }: DebugLoggerConfig) => {
  const log = useCallback((message: string, data?: any, level: 'info' | 'warn' | 'error' = 'info') => {
    if (!enabled || import.meta.env.PROD) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `🔍 [${component}] ${timestamp}:`;
    
    switch (level) {
      case 'info':
        console.log(`${prefix} ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${prefix} ${message}`, data || '');
        break;
      case 'error':
        console.error(`🚨 ${prefix} ${message}`, data || '');
        break;
    }
  }, [component, enabled]);

  const logAction = useCallback((action: string, payload?: any) => {
    log(`Action: ${action}`, payload);
  }, [log]);

  const logError = useCallback((error: Error | string, context?: any) => {
    const errorMsg = typeof error === 'string' ? error : error.message;
    log(`Error: ${errorMsg}`, { error, context }, 'error');
  }, [log]);

  const logPerformance = useCallback((operation: string, startTime: number) => {
    const duration = performance.now() - startTime;
    log(`Performance: ${operation} completed in ${duration.toFixed(2)}ms`);
  }, [log]);

  return {
    log,
    logAction,
    logError,
    logPerformance
  };
};
