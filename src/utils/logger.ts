// logger.ts
// Sistema de logging centralizado para la aplicación
// Proporciona diferentes niveles de logging y manejo especial para producción

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class Logger {
  // Determina si la aplicación está en modo producción
  private static isProduction = process.env.NODE_ENV === 'production';

  /**
   * Método privado para manejar todos los tipos de logs
   * @param level - Nivel del log (info, warn, error, debug)
   * @param message - Mensaje a registrar
   * @param data - Datos adicionales opcional
   */
  private static log(level: LogLevel, message: string, data?: any) {
    // En producción, no mostrar logs de debug
    if (this.isProduction && level === 'debug') return;

    // Crear timestamp para el mensaje
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    // Seleccionar el método de console apropiado según el nivel
    switch (level) {
      case 'info':
        console.log(logMessage, data ?? '');
        break;
      case 'warn':
        console.warn(logMessage, data ?? '');
        break;
      case 'error':
        console.error(logMessage, data ?? '');
        break;
      case 'debug':
        if (!this.isProduction) {
          console.debug(logMessage, data ?? '');
        }
        break;
    }
  }

  /**
   * Registra un mensaje informativo
   * @param message - Mensaje a registrar
   * @param data - Datos adicionales opcional
   */
  static info(message: string, data?: any) {
    this.log('info', message, data);
  }

  /**
   * Registra una advertencia
   * @param message - Mensaje de advertencia
   * @param data - Datos adicionales opcional
   */
  static warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  /**
   * Registra un error
   * @param message - Mensaje de error
   * @param data - Datos adicionales opcional
   */
  static error(message: string, data?: any) {
    this.log('error', message, data);
  }

  /**
   * Registra un mensaje de debug (solo en desarrollo)
   * @param message - Mensaje de debug
   * @param data - Datos adicionales opcional
   */
  static debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}
