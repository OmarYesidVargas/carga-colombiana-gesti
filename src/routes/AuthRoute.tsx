
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Debes iniciar sesión para acceder a esta página');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    // Mientras se verifica la autenticación, mostrar un indicador de carga
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin text-3xl">○</div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default AuthRoute;
