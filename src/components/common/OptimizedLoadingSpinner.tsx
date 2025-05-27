
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

/**
 * Componente de carga optimizado con múltiples variantes
 * Incluye animaciones suaves y accesibilidad mejorada
 */
export const OptimizedLoadingSpinner: React.FC<OptimizedLoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  overlay = false,
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const content = (
    <div className="flex flex-col items-center space-y-3">
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size],
          className
        )}
        aria-label="Cargando..."
      />
      {text && (
        <p className={cn(
          'text-muted-foreground font-medium',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          overlay ? 'bg-background/80 backdrop-blur-sm' : 'bg-background'
        )}
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      {content}
    </div>
  );
};

export default OptimizedLoadingSpinner;
