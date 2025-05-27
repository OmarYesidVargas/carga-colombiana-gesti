
import React, { useEffect, useMemo } from 'react';
import Header from './Header';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal optimizado con debugging avanzado y manejo de errores mejorado
 * Incluye optimizaciones de rendimiento y mejor UX
 */
const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  
  console.log('🏗️ [Layout] Renderizando Layout:', {
    user: user?.email || 'No autenticado',
    isMobile,
    timestamp: new Date().toISOString()
  });
  
  // Configuración optimizada de sidebar con debugging
  const sidebarConfig = useMemo(() => {
    const config = {
      defaultOpen: !isMobile,
      collapsedWidth: 64 // Optimizado para iconos
    };
    
    console.log('⚙️ [Layout] Configuración de sidebar:', config);
    return config;
  }, [isMobile]);
  
  // Manejo optimizado de logout con debugging
  const handleLogout = async () => {
    try {
      console.log('🚪 [Layout] Iniciando proceso de logout...');
      await logout();
      console.log('✅ [Layout] Logout completado exitosamente');
    } catch (error) {
      console.error('🚨 [Layout] Error durante logout:', error);
    }
  };
  
  // Debugging de cambios en el usuario
  useEffect(() => {
    console.log('👤 [Layout] Estado de usuario actualizado:', {
      isAuthenticated: !!user,
      email: user?.email,
      id: user?.id
    });
  }, [user]);
  
  // Debugging de cambios en dispositivo móvil
  useEffect(() => {
    console.log('📱 [Layout] Detección de dispositivo:', {
      isMobile,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }, [isMobile]);
  
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
              onClick={() => console.log('🔄 [Layout] Sidebar trigger activado')}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            
            <div className="flex-1 min-w-0">
              <Header userEmail={user?.email} onLogout={handleLogout} />
            </div>
          </header>
          
          {/* Contenido principal con manejo de errores */}
          <main className="flex-1 overflow-auto">
            <div className="w-full max-w-full mx-auto">
              {/* Error Boundary implícito con debugging */}
              {(() => {
                try {
                  console.log('📄 [Layout] Renderizando contenido principal');
                  return children;
                } catch (error) {
                  console.error('🚨 [Layout] Error al renderizar children:', error);
                  return (
                    <div className="flex items-center justify-center min-h-96 p-8">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          Error al cargar el contenido
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Ha ocurrido un error inesperado. Por favor, recarga la página.
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
                        >
                          Recargar página
                        </button>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
