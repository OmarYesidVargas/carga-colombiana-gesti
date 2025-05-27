
/**
 * Componente de Ruta Protegida para TransporegistrosPlus
 * 
 * Este componente implementa protección de rutas que requieren autenticación:
 * - Verifica el estado de autenticación del usuario
 * - Redirige a login si no está autenticado
 * - Muestra loading mientras verifica autenticación
 * - Preserva la ruta original para redirección post-login
 * - Maneja notificaciones de acceso denegado
 * 
 * Flujo de funcionamiento:
 * 1. Verifica si hay un proceso de autenticación en curso
 * 2. Si está autenticado, renderiza el contenido protegido
 * 3. Si no está autenticado, redirige a /login con la ruta origen
 * 4. Muestra spinner de carga durante verificación
 * 
 * Integración:
 * - Utiliza AuthContext para estado de autenticación
 * - Compatible con React Router para redirecciones
 * - Integrado con sistema de notificaciones toast
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

/**
 * Props del componente AuthRoute
 */
interface AuthRouteProps {
  /** Contenido a renderizar si el usuario está autenticado */
  children: React.ReactNode;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * 
 * Casos de uso:
 * - Proteger páginas del dashboard
 * - Restringir acceso a funcionalidades premium
 * - Validar permisos antes de mostrar contenido
 * 
 * Estados manejados:
 * - Loading: Verificando autenticación
 * - Authenticated: Usuario válido, mostrar contenido
 * - Unauthenticated: Redirigir a login
 * 
 * @param {AuthRouteProps} props - Props del componente
 * @param {React.ReactNode} props.children - Contenido protegido a renderizar
 * 
 * @returns {JSX.Element} Contenido protegido, loading o redirección
 * 
 * @example
 * ```tsx
 * // Proteger una ruta del dashboard
 * <Route path="/dashboard" element={
 *   <AuthRoute>
 *     <Dashboard />
 *   </AuthRoute>
 * } />
 * 
 * // Proteger múltiples rutas
 * <Route path="/admin/*" element={
 *   <AuthRoute>
 *     <AdminLayout />
 *   </AuthRoute>
 * } />
 * ```
 */
const AuthRoute = ({ children }: AuthRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  /**
   * Efecto para manejar notificaciones de acceso denegado
   * Se ejecuta cuando cambia el estado de autenticación o la ubicación
   */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Usuario no autenticado, redirigiendo a login desde:', location.pathname);
      toast.error('Debes iniciar sesión para acceder a esta página');
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  /**
   * Estado de carga: Muestra spinner mientras verifica autenticación
   * Evita flashes de contenido no autorizado
   */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  /**
   * Usuario no autenticado: Redirigir a login
   * Preserva la ruta original en el state para redirección post-login
   */
  if (!isAuthenticated) {
    console.log('Redirigiendo a login, from:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  /**
   * Usuario autenticado: Renderizar contenido protegido
   */
  return <>{children}</>;
};

export default AuthRoute;
