
/**
 * Manejo centralizado de errores con logging seguro
 */
import { toast } from 'sonner';
import { sanitizeForLogging } from './securityUtils';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: any;
}

class ErrorHandler {
  private logError(error: Error, context?: ErrorContext) {
    const sanitizedContext = context ? sanitizeForLogging(context) : {};
    
    console.error('🚨 Error capturado:', {
      message: error.message,
      stack: import.meta.env.DEV ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      ...sanitizedContext
    });
  }
  
  public handleDatabaseError(error: any, context?: ErrorContext) {
    this.logError(error, { ...context, type: 'database' });
    
    // Mapear errores específicos de Supabase
    if (error.code === '23505') {
      toast.error('Este registro ya existe');
      return;
    }
    
    if (error.code === '23503') {
      toast.error('Referencia inválida en los datos');
      return;
    }
    
    if (error.code === '42501') {
      toast.error('No tienes permisos para realizar esta acción');
      return;
    }
    
    if (error.message?.includes('RLS')) {
      toast.error('Error de permisos. Verifica tu sesión');
      return;
    }
    
    toast.error('Error en la base de datos. Inténtalo de nuevo.');
  }
  
  public handleAuthError(error: any, context?: ErrorContext) {
    this.logError(error, { ...context, type: 'auth' });
    
    if (error.message?.includes('Invalid login credentials')) {
      toast.error('Credenciales inválidas');
      return;
    }
    
    if (error.message?.includes('Email not confirmed')) {
      toast.error('Confirma tu email antes de iniciar sesión');
      return;
    }
    
    if (error.message?.includes('Too many requests')) {
      toast.error('Demasiados intentos. Espera unos minutos');
      return;
    }
    
    toast.error('Error de autenticación');
  }
  
  public handleNetworkError(error: any, context?: ErrorContext) {
    this.logError(error, { ...context, type: 'network' });
    
    if (!navigator.onLine) {
      toast.error('Sin conexión a internet');
      return;
    }
    
    toast.error('Error de conexión. Verifica tu internet');
  }
  
  public handleValidationError(error: any, context?: ErrorContext) {
    this.logError(error, { ...context, type: 'validation' });
    toast.error(`Error de validación: ${error.message}`);
  }
  
  public handleGenericError(error: any, context?: ErrorContext) {
    this.logError(error, { ...context, type: 'generic' });
    
    if (import.meta.env.DEV) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.error('Ha ocurrido un error inesperado');
    }
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Hook para manejo de errores en componentes
 */
export const useErrorHandler = () => {
  return {
    handleError: (error: any, context?: ErrorContext) => {
      // Determinar tipo de error y manejar apropiadamente
      if (error.code || error.message?.includes('Supabase')) {
        errorHandler.handleDatabaseError(error, context);
      } else if (error.message?.includes('auth') || error.message?.includes('login')) {
        errorHandler.handleAuthError(error, context);
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        errorHandler.handleNetworkError(error, context);
      } else {
        errorHandler.handleGenericError(error, context);
      }
    }
  };
};
