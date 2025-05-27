
/**
 * Hook de logging para debugging en TransporegistrosPlus
 * Proporciona logging estructurado con contexto y métricas de rendimiento
 */

import { useCallback } from 'react';

interface LogContext {
  component?: string;
  action?: string;
  data?: any;
  [key: string]: any;
}

interface DebugLogger {
  log: (message: string, context?: LogContext) => void;
  logError: (error: Error, context?: LogContext) => void;
  logAction: (action: string, context?: LogContext) => void;
  logPerformance: (operation: string, startTime: number) => void;
}

/**
 * Hook personalizado para logging de debugging
 */
export const useDebugLogger = (defaultContext: LogContext = {}): DebugLogger => {
  
  const log = useCallback((message: string, context: LogContext = {}) => {
    if (import.meta.env.DEV) {
      const logContext = { ...defaultContext, ...context };
      console.log(`🔍 [${logContext.component || 'App'}] ${message}`, logContext);
    }
  }, [defaultContext]);
  
  const logError = useCallback((error: Error, context: LogContext = {}) => {
    const logContext = { ...defaultContext, ...context };
    console.error(`❌ [${logContext.component || 'App'}] Error:`, error.message, {
      ...logContext,
      stack: error.stack
    });
  }, [defaultContext]);
  
  const logAction = useCallback((action: string, context: LogContext = {}) => {
    if (import.meta.env.DEV) {
      const logContext = { ...defaultContext, ...context };
      console.log(`⚡ [${logContext.component || 'App'}] Action: ${action}`, logContext);
    }
  }, [defaultContext]);
  
  const logPerformance = useCallback((operation: string, startTime: number) => {
    if (import.meta.env.DEV) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ [${defaultContext.component || 'App'}] ${operation}: ${duration.toFixed(2)}ms`);
    }
  }, [defaultContext]);
  
  return {
    log,
    logError,
    logAction,
    logPerformance
  };
};
