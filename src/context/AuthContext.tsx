
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
 * @version 1.0.0
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
 * 
 * @returns {AuthContextType} Objeto con propiedades y métodos de autenticación
 * @throws {Error} Si se usa fuera de un AuthProvider
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
 * Proveedor del contexto de autenticación
 * 
 * Gestiona el estado global de autenticación y proporciona funciones
 * para iniciar sesión, registrarse y cerrar sesión
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
   * Efecto principal que gestiona los cambios de estado de autenticación
   * 
   * Se ejecuta al montar el componente y configura:
   * - Listener para cambios de autenticación
   * - Verificación de sesión existente
   * - Redirección automática basada en el estado
   */
  useEffect(() => {
    // Configurar listener para cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Cambio de estado de autenticación:', event, newSession?.user?.email);
        
        // Actualizar estado local
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Manejar diferentes eventos de autenticación
        switch (event) {
          case 'PASSWORD_RECOVERY':
            // Evento de recuperación de contraseña - no redirigir automáticamente
            console.log('Evento de recuperación de contraseña detectado');
            break;
            
          case 'SIGNED_IN':
            if (newSession) {
              // Redirigir al dashboard solo si estamos en páginas de autenticación
              const currentPath = location.pathname;
              const authPages = ['/login', '/register'];
              if (authPages.includes(currentPath)) {
                navigate('/dashboard');
              }
            }
            break;
            
          case 'SIGNED_OUT':
            // Redirigir al login solo si estamos en páginas protegidas
            const currentPath = location.pathname;
            const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
            if (!publicPaths.includes(currentPath)) {
              navigate('/login');
            }
            break;
            
          default:
            // Otros eventos no requieren acción específica
            break;
        }
      }
    );

    // Verificar si existe una sesión activa al cargar la aplicación
    supabase.auth.getSession()
      .then(({ data: { session: currentSession }, error }) => {
        if (error) {
          console.error('Error al obtener sesión:', error);
          toast.error('Error al verificar la sesión');
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      })
      .catch((error) => {
        console.error('Error inesperado al obtener sesión:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Cleanup: remover listener al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  /**
   * Función para iniciar sesión con email y contraseña
   * 
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @throws {Error} Si las credenciales son incorrectas o hay un error de conexión
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Validaciones básicas antes de enviar la petición
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
        // Manejar errores específicos de Supabase
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
      console.error('Error al iniciar sesión:', error);
      // Re-lanzar el error para que el componente pueda manejarlo
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función para registrar un nuevo usuario
   * 
   * @param {string} name - Nombre completo del usuario
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @param {any} metadata - Datos adicionales del usuario (opcional)
   * @throws {Error} Si hay un error en el registro
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
      console.error('Error al registrarse:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función para cerrar sesión del usuario actual
   * 
   * Limpia toda la información de sesión y redirige al usuario
   */
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Sesión cerrada exitosamente');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast.error(error.message || 'Error al cerrar sesión');
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
