
/**
 * Componente ErrorBoundary para capturar errores de React
 * Envuelve componentes para prevenir crashes de la aplicación
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  /** Componentes hijos a proteger */
  children: ReactNode;
  /** Componente de fallback personalizado */
  fallback?: ReactNode;
}

interface State {
  /** Indica si hay un error */
  hasError: boolean;
  /** Información del error */
  error?: Error;
}

/**
 * ErrorBoundary - Captura errores en los componentes hijos
 * Previene que errores individuales crashes toda la aplicación
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Método estático para actualizar el estado cuando ocurre un error
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Maneja errores capturados y los registra
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  /**
   * Reinicia el estado del error para intentar recuperarse
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    // Si hay error, mostrar UI de fallback
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de error por defecto
      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">¡Algo salió mal!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Ocurrió un error inesperado. Por favor, intenta recargar la página.
            </p>
            {this.state.error && (
              <details className="text-xs text-left bg-gray-50 p-2 rounded">
                <summary className="cursor-pointer font-medium">
                  Detalles técnicos
                </summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Intentar de nuevo
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                size="sm"
              >
                Recargar página
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Si no hay error, renderizar los hijos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
