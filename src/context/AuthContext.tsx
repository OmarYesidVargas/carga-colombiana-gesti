
/**
 * Contexto de Autenticación para TransporegistrosPlus
 * 
 * Este contexto maneja toda la lógica de autenticación de usuarios incluyendo:
 * - Inicio de sesión con email y contraseña
 * - Registro de nuevos usuarios con datos personales
 * - Cierre de sesión
 * - Estado de autenticación global
 * - Redirección automática basada en el estado de autenticación
 * 
 * @author TransporegistrosPlus Team
 * @version 2.0.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

/**
 * Interfaz que define las propiedades y métodos disponibles en el contexto de autenticación
 */
interface AuthContextType {
  /** Usuario autenticado actual */
  user: User | null;
  /** Sesión activa de Supabase */
  session: Session | null;
  /** Indica si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Función para iniciar sesión */
  login: (email: string, password: string) => Promise<void>;
  /** Función para cerrar sesión */
  logout: () => Promise<void>;
  /** Función para registrar un nuevo usuario */
  register: (name: string, email: string, password: string, metadata?: any) => Promise<void>;
  /** Indica si hay operaciones de autenticación en curso */
  isLoading: boolean;
}

// Crear el contexto con valor inicial null
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook personalizado para acceder al contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

/**
 * Props para el componente AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación optimizado
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estados locales para manejar la información de autenticación
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks de navegación
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Efecto principal optimizado que gestiona los cambios de estado de autenticación
   */
  useEffect(() => {
    let mounted = true;

    // Configurar listener para cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (import.meta.env.DEV) {
          console.log('Cambio de estado de autenticación:', event, newSession?.user?.email);
        }
        
        if (!mounted) return;

        // Actualizar estado local
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Manejar diferentes eventos de autenticación
        switch (event) {
          case 'SIGNED_IN':
            if (newSession && mounted) {
              const currentPath = location.pathname;
              const authPages = ['/login', '/register'];
              if (authPages.includes(currentPath)) {
                navigate('/dashboard');
              }
            }
            break;
            
          case 'SIGNED_OUT':
            if (mounted) {
              const currentPath = location.pathname;
              const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
              if (!publicPaths.includes(currentPath)) {
                navigate('/login');
              }
            }
            break;
        }
      }
    );

    // Verificar si existe una sesión activa al cargar la aplicación
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error && import.meta.env.DEV) {
          console.error('Error al obtener sesión:', error);
        }
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error inesperado al obtener sesión:', error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Cleanup: remover listener al desmontar
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  /**
   * Función optimizada para iniciar sesión
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Validaciones básicas
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      if (!email.includes('@')) {
        throw new Error('Por favor ingresa un email válido');
      }
      
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      // Intentar iniciar sesión
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (error) {
        // Manejar errores específicos
        let errorMessage = 'Error al iniciar sesión';
        
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
            break;
          case 'Email not confirmed':
            errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
            break;
          case 'Too many requests':
            errorMessage = 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.';
            break;
          default:
            errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      toast.success('¡Has iniciado sesión exitosamente!');
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error al iniciar sesión:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función optimizada para registrar un nuevo usuario
   */
  const register = async (name: string, email: string, password: string, metadata?: any): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Validaciones básicas
      if (!name || !email || !password) {
        throw new Error('Todos los campos son requeridos');
      }
      
      if (name.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }
      
      if (!email.includes('@')) {
        throw new Error('Por favor ingresa un email válido');
      }
      
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      // Registrar usuario en Supabase
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { 
            name: name.trim(),
            ...metadata 
          }
        }
      });
      
      if (error) {
        // Manejar errores específicos de registro
        let errorMessage = 'Error al registrarse';
        
        switch (error.message) {
          case 'User already registered':
            errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
            break;
          case 'Password should be at least 6 characters':
            errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            break;
          case 'Signup is disabled':
            errorMessage = 'El registro está temporalmente deshabilitado.';
            break;
          default:
            errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      toast.success('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');
      navigate('/login');
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error al registrarse:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función optimizada para cerrar sesión
   */
  const logout = async (): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔄 Iniciando proceso de logout...');
      }
      
      // Verificar si hay una sesión activa
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        // Limpiar estado local aunque no haya sesión
        setSession(null);
        setUser(null);
        
        // Limpiar localStorage selectivamente
        try {
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('supabase') || key.includes('auth'))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('⚠️ Error limpiando localStorage:', error);
          }
        }
        
        toast.success('Sesión cerrada exitosamente');
        return;
      }
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (import.meta.env.DEV) {
          console.error('❌ Error al cerrar sesión:', error);
        }
        
        // Si hay error, aún así limpiar el estado local
        setSession(null);
        setUser(null);
        
        // Limpiar localStorage manualmente
        try {
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('supabase') || key.includes('auth'))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (storageError) {
          if (import.meta.env.DEV) {
            console.warn('⚠️ Error limpiando localStorage:', storageError);
          }
        }
        
        toast.error('Error al cerrar sesión, pero se limpió la sesión local');
        return;
      }
      
      toast.success('Sesión cerrada exitosamente');
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Error inesperado al cerrar sesión:', error);
      }
      
      // En caso de error inesperado, forzar limpieza local
      setSession(null);
      setUser(null);
      
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('auth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (storageError) {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Error limpiando localStorage:', storageError);
        }
      }
      
      toast.error('Sesión cerrada localmente debido a un error');
    }
  };

  // Valor del contexto que se proporcionará a los componentes hijos
  const contextValue: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
