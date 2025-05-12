
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
  id: string;
  name?: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar el usuario desde localStorage al montar el componente
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from localStorage', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Esta es una simulación, en un entorno real se haría una llamada a la API
    try {
      // Simular un tiempo de espera para la llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simular un usuario con credenciales correctas
      // En un entorno real, la API devolvería los datos del usuario
      const loggedUser: User = {
        id: '1',
        email,
        name: email.split('@')[0], // Usamos parte del email como nombre simulado
      };
      
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      toast.success('¡Has iniciado sesión exitosamente!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión. Por favor, intenta de nuevo.');
      throw new Error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simular un tiempo de espera para la llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simular un registro exitoso
      // En un entorno real, la API registraría al usuario y devolvería sus datos
      const newUser: User = {
        id: '1', // En un entorno real, este ID sería generado por el servidor
        name,
        email,
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('¡Registro exitoso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Error al registrarse. Por favor, intenta de nuevo.');
      throw new Error('Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
