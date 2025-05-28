// useLoading.tsx
// Hook y provider para manejar el estado de carga global de la aplicación
// Permite compartir y gestionar el estado de carga entre componentes

import React, { createContext, useContext, useState } from 'react';

// Interface para el contexto de carga
interface LoadingContextType {
  isLoading: boolean;              // Estado actual de carga
  setLoading: (loading: boolean) => void;  // Función para actualizar el estado
}

// Creación del contexto
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Hook personalizado para acceder al estado de carga
 * @throws Error si se usa fuera del LoadingProvider
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe usarse dentro de un LoadingProvider');
  }
  return context;
};

/**
 * Proveedor del estado de carga
 * Envuelve los componentes que necesitan acceso al estado de carga
 */
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado local para el indicador de carga
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setLoading: setIsLoading 
    }}>
      {children}
    </LoadingContext.Provider>
  );
};
