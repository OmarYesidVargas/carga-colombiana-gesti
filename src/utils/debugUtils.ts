
/**
 * Utilidades de debugging para TransporegistrosPlus
 * Herramientas para facilitar el debugging y monitoreo
 */

/**
 * Utilidades estáticas para debugging
 */
export class DebugUtils {
  private static operations = new Map<string, number>();
  
  /**
   * Inicia una operación para medir tiempo
   */
  static startOperation(name: string, context?: any): void {
    if (import.meta.env.DEV) {
      this.operations.set(name, performance.now());
      if (context) {
        console.log(`🚀 Starting operation: ${name}`, context);
      }
    }
  }
  
  /**
   * Finaliza una operación y muestra el tiempo transcurrido
   */
  static endOperation(name: string): void {
    if (import.meta.env.DEV) {
      const startTime = this.operations.get(name);
      if (startTime) {
        const duration = performance.now() - startTime;
        console.log(`✅ Operation completed: ${name} (${duration.toFixed(2)}ms)`);
        this.operations.delete(name);
      }
    }
  }
  
  /**
   * Valida un objeto y sus propiedades requeridas
   */
  static validateObject(obj: any, name: string, requiredProps?: string[]): boolean {
    if (import.meta.env.DEV) {
      if (!obj) {
        console.warn(`⚠️ ${name} is null or undefined`);
        return false;
      }
      
      if (requiredProps) {
        const missingProps = requiredProps.filter(prop => !(prop in obj));
        if (missingProps.length > 0) {
          console.warn(`⚠️ ${name} missing required properties:`, missingProps);
          return false;
        }
      }
    }
    return true;
  }
  
  /**
   * Obtiene información de uso de memoria (solo en navegadores compatibles)
   */
  static getMemoryUsage(): any {
    if (import.meta.env.DEV && 'memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }
  
  /**
   * Formatea bytes en unidades legibles
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Crea un snapshot del estado actual para debugging
   */
  static createSnapshot(name: string, data: any): void {
    if (import.meta.env.DEV) {
      console.log(`📸 Snapshot: ${name}`, {
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(data))
      });
    }
  }
}
