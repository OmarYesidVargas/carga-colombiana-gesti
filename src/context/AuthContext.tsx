
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, metadata?: any) => Promise<void>;
  signInWithOAuth: (provider: 'google') => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Escuchar cambios de autenticación y obtener la sesión inicial
  useEffect(() => {
    // Configurar el escuchador de cambios de autenticación PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Manejar diferentes eventos de autenticación
        if (event === 'PASSWORD_RECOVERY') {
          // No redirigir automáticamente, la página ResetPassword manejará esto
          console.log('Password recovery event detected');
        } else if (event === 'SIGNED_IN' && newSession) {
          // Solo redirigir si no estamos en páginas de autenticación
          const currentPath = location.pathname;
          if (currentPath === '/login' || currentPath === '/register') {
            navigate('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          // Redirigir al login solo si estamos en páginas protegidas
          const currentPath = location.pathname;
          const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
          if (!publicPaths.includes(currentPath)) {
            navigate('/login');
          }
        }
      }
    );

    // LUEGO verificar si hay una sesión existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Limpiar el escuchador al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('¡Has iniciado sesión exitosamente!');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      toast.error(error.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, metadata?: any): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            ...metadata 
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      toast.error(error.message || 'Error al registrarse. Por favor, intenta de nuevo.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithOAuth = async (provider: 'google'): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // La redirección se maneja automáticamente por Supabase
    } catch (error: any) {
      console.error('Error al iniciar sesión con OAuth:', error);
      toast.error(error.message || `Error al iniciar sesión con ${provider}. Por favor, intenta de nuevo.`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Sesión cerrada exitosamente');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast.error(error.message || 'Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        signInWithOAuth,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
