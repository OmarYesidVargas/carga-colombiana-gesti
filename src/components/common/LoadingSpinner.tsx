
/**
 * Componente de spinner de carga reutilizable
 * Muestra un indicador de carga consistente en toda la aplicación
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** Tamaño del spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Clases CSS adicionales */
  className?: string;
  /** Texto descriptivo para accesibilidad */
  label?: string;
}

/**
 * Componente LoadingSpinner
 * @param size - Tamaño del spinner (sm, md, lg)
 * @param className - Clases CSS adicionales
 * @param label - Texto para lectores de pantalla
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  label = 'Cargando...'
}) => {
  // Definir tamaños basados en la prop size
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
