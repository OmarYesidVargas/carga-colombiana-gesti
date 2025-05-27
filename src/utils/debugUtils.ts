
/**
 * Utilidades de debugging para el desarrollo
 * Facilita la identificación de problemas y optimización
 */

export interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export class DebugUtils {
  private static metrics: PerformanceMetrics[] = [];
  private static enabled = !import.meta.env.PROD;

  /**
   * Inicia el seguimiento de una operación
   */
  static startOperation(operation: string, metadata?: Record<string, any>): string {
    if (!this.enabled) return '';
    
    const id = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetrics = {
      operation: id,
      startTime: performance.now(),
      metadata
    };
    
    this.metrics.push(metric);
    console.log(`🚀 [Performance] Started: ${operation}`, metadata);
    
    return id;
  }

  /**
   * Finaliza el seguimiento de una operación
   */
  static endOperation(operationId: string): PerformanceMetrics | null {
    if (!this.enabled || !operationId) return null;
    
    const metric = this.metrics.find(m => m.operation === operationId);
    if (!metric) return null;
    
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    console.log(`✅ [Performance] Completed: ${operationId} in ${metric.duration.toFixed(2)}ms`);
    
    return metric;
  }

  /**
   * Obtiene todas las métricas registradas
   */
  static getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Limpia todas las métricas
   */
  static clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Log condicional que solo se ejecuta en desarrollo
   */
  static log(message: string, data?: any, level: 'log' | 'warn' | 'error' = 'log'): void {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `🔍 [Debug] ${timestamp}:`;
    
    switch (level) {
      case 'log':
        console.log(`${prefix} ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${prefix} ${message}`, data || '');
        break;
      case 'error':
        console.error(`🚨 ${prefix} ${message}`, data || '');
        break;
    }
  }

  /**
   * Verifica el estado de objetos complejos
   */
  static validateObject(obj: any, name: string, requiredProps?: string[]): boolean {
    if (!this.enabled) return true;
    
    if (!obj) {
      this.log(`Validation failed: ${name} is null or undefined`, null, 'error');
      return false;
    }
    
    if (requiredProps) {
      const missing = requiredProps.filter(prop => !(prop in obj));
      if (missing.length > 0) {
        this.log(`Validation failed: ${name} missing properties`, { missing, obj }, 'error');
        return false;
      }
    }
    
    this.log(`Validation passed: ${name}`, { keys: Object.keys(obj) });
    return true;
  }

  /**
   * Memoria utilizada por la aplicación
   */
  static getMemoryUsage(): any {
    if (!this.enabled || !(performance as any).memory) return null;
    
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576)
    };
  }
}
