
import React, { useEffect, useMemo } from 'react';
import Header from './Header';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { useDebugLogger } from '@/hooks/useDebugLogger';
import { DebugUtils } from '@/utils/debugUtils';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal optimizado con debugging avanzado y mejor rendimiento
 * Incluye métricas de rendimiento y manejo de errores robusto
 */
const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  const { log, logAction, logError, logPerformance } = useDebugLogger({ component: 'Layout' });
  
  // Inicializar métricas de rendimiento
  const renderStartTime = useMemo(() => {
    const startTime = performance.now();
    DebugUtils.startOperation('Layout_Render', {
      user: user?.email || 'No autenticado',
      isMobile,
      timestamp: new Date().toISOString()
    });
    return startTime;
  }, [user, isMobile]);
  
  // Configuración optimizada de sidebar con debugging
  const sidebarConfig = useMemo(() => {
    const config = {
      defaultOpen: !isMobile,
      collapsedWidth: 64
    };
    
    log('Sidebar configuration calculated', config);
    return config;
  }, [isMobile, log]);
  
  // Manejo optimizado de logout con debugging
  const handleLogout = async () => {
    try {
      logAction('Starting logout process');
      const startTime = performance.now();
      
      await logout();
      
      logPerformance('Logout completed', startTime);
    } catch (error) {
      logError(error as Error, { context: 'logout process' });
    }
  };
  
  // Debugging de cambios en el usuario
  useEffect(() => {
    log('User state updated', {
      isAuthenticated: !!user,
      email: user?.email,
      id: user?.id
    });
    
    // Validar estado del usuario
    DebugUtils.validateObject(user, 'User', user ? ['id', 'email'] : undefined);
  }, [user, log]);
  
  // Debugging de cambios en dispositivo móvil
  useEffect(() => {
    log('Device detection updated', {
      isMobile,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      userAgent: navigator.userAgent
    });
  }, [isMobile, log]);

  // Métricas de memoria en desarrollo
  useEffect(() => {
    if (import.meta.env.DEV) {
      const memoryUsage = DebugUtils.getMemoryUsage();
      if (memoryUsage) {
        log('Memory usage', memoryUsage);
      }
    }
  }, [log]);

  // Finalizar métricas de rendimiento
  useEffect(() => {
    const endTime = performance.now();
    logPerformance('Layout render', renderStartTime);
    DebugUtils.endOperation('Layout_Render');
  }, [renderStartTime, logPerformance]);
  
  return (
    <SidebarProvider 
      defaultOpen={sidebarConfig.defaultOpen}
      className="min-h-screen w-full"
    >
      <div className="min-h-screen w-full flex bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <AppSidebar />
        
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          {/* Header optimizado con debugging */}
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-violet-200 bg-white/90 backdrop-blur shadow-sm px-4">
            <SidebarTrigger 
              className="h-9 w-9 p-0 hover:bg-violet-50 rounded-md flex items-center justify-center border border-violet-200 text-violet-600 transition-colors"
              onClick={() => logAction('Sidebar trigger activated')}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            
            <div className="flex-1 min-w-0">
              <Header userEmail={user?.email} onLogout={handleLogout} />
            </div>
          </header>
          
          {/* Contenido principal con manejo de errores mejorado */}
          <main className="flex-1 overflow-auto">
            <div className="w-full max-w-full mx-auto">
              <React.Suspense 
                fallback={
                  <div className="flex items-center justify-center min-h-96 p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando contenido...</p>
                    </div>
                  </div>
                }
              >
                {children}
              </React.Suspense>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
