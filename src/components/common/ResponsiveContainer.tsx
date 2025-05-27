
/**
 * Contenedor responsivo para envolver contenido
 * Proporciona padding y máximos anchos consistentes
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  /** Contenido a envolver */
  children: React.ReactNode;
  /** Clases CSS adicionales */
  className?: string;
  /** Tamaño máximo del contenedor */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Padding del contenedor */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * ResponsiveContainer - Envuelve contenido con estilos responsivos
 * @param children - Contenido a mostrar
 * @param maxWidth - Ancho máximo del contenedor
 * @param padding - Padding interno
 * @param className - Clases CSS adicionales
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md'
}) => {
  // Mapeo de tamaños máximos
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  // Mapeo de paddings
  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
