
/**
 * Hook de autenticación seguro con rate limiting y validaciones adicionales
 */
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { authRateLimiter, validatePasswordStrength, sanitizeText } from '@/utils/securityUtils';

export const useSecureAuth = () => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const secureLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Sanitizar inputs
      const cleanEmail = sanitizeText(email).toLowerCase();
      
      // Rate limiting
      if (!authRateLimiter.isAllowed(cleanEmail)) {
        throw new Error('Demasiados intentos de login. Espera 5 minutos antes de intentar de nuevo.');
      }
      
      // Validaciones básicas mejoradas
      if (!cleanEmail || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        throw new Error('Formato de email inválido');
      }
      
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      await login(cleanEmail, password);
      
    } catch (error: any) {
      console.error('🔒 Error de login seguro:', error.message);
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const secureRegister = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Sanitizar inputs
      const cleanName = sanitizeText(name);
      const cleanEmail = sanitizeText(email).toLowerCase();
      
      // Rate limiting
      if (!authRateLimiter.isAllowed(cleanEmail)) {
        throw new Error('Demasiados intentos de registro. Espera 5 minutos antes de intentar de nuevo.');
      }
      
      // Validaciones mejoradas
      if (!cleanName || !cleanEmail || !password) {
        throw new Error('Todos los campos son requeridos');
      }
      
      if (cleanName.length < 2 || cleanName.length > 50) {
        throw new Error('El nombre debe tener entre 2 y 50 caracteres');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        throw new Error('Formato de email inválido');
      }
      
      // Validar fortaleza de contraseña
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(`Contraseña débil: ${passwordValidation.errors.join(', ')}`);
      }
      
      await register(cleanName, cleanEmail, password);
      
    } catch (error: any) {
      console.error('🔒 Error de registro seguro:', error.message);
      toast.error(error.message || 'Error al registrarse');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    secureLogin,
    secureRegister,
    isLoading
  };
};
