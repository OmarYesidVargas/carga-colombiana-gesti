
/**
 * Proveedor de contexto de seguridad global
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRateLimiter } from '@/utils/securityUtils';
import { useAuth } from '@/context/AuthContext';

interface SecurityContextType {
  isRateLimited: (key: string) => boolean;
  reportSecurityEvent: (event: string, details?: any) => void;
  securityStatus: 'secure' | 'warning' | 'critical';
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext debe usarse dentro de SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'critical'>('secure');
  
  useEffect(() => {
    // Monitorear estado de seguridad
    const checkSecurityStatus = () => {
      // Verificar si hay una sesión válida
      if (!user) {
        setSecurityStatus('warning');
        return;
      }
      
      // Verificar integridad de la sesión
      const lastActivity = localStorage.getItem('lastActivity');
      const now = Date.now();
      
      if (lastActivity && now - parseInt(lastActivity) > 24 * 60 * 60 * 1000) {
        setSecurityStatus('warning');
        return;
      }
      
      setSecurityStatus('secure');
    };
    
    checkSecurityStatus();
    const interval = setInterval(checkSecurityStatus, 60000); // Verificar cada minuto
    
    return () => clearInterval(interval);
  }, [user]);
  
  useEffect(() => {
    // Actualizar timestamp de actividad
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };
    
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);
  
  const isRateLimited = (key: string): boolean => {
    const userKey = user ? `${user.id}-${key}` : key;
    return !apiRateLimiter.isAllowed(userKey);
  };
  
  const reportSecurityEvent = (event: string, details?: any) => {
    console.warn('🔒 Evento de seguridad:', {
      event,
      details,
      userId: user?.id,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // En un entorno de producción, aquí se enviaría a un servicio de monitoreo
  };
  
  const contextValue: SecurityContextType = {
    isRateLimited,
    reportSecurityEvent,
    securityStatus
  };
  
  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
