
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { APP_CONFIG } from '@/lib/constants'

// Configuración del cliente Supabase optimizada para móvil
export const supabase = createClient<Database>(
  APP_CONFIG.supabase.url,
  APP_CONFIG.supabase.anonKey,
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      // Configuración específica para móvil mejorada
      storageKey: 'transporegistros-auth-token',
      debug: import.meta.env.DEV
    },
    global: {
      headers: {
        'x-application-name': APP_CONFIG.name,
        'x-application-version': APP_CONFIG.version
      }
    },
    db: {
      schema: 'public'
    },
    // Configuración adicional para estabilidad
    realtime: {
      params: {
        eventsPerSecond: 2
      }
    }
  }
)

// Configurar manejo de errores globales mejorado para móvil
supabase.auth.onAuthStateChange((event, session) => {
  if (import.meta.env.DEV) {
    console.log('🔄 Auth state change:', event, session?.user?.email || 'No user');
  }
  
  if (event === 'SIGNED_OUT') {
    // Limpiar datos locales al cerrar sesión de forma más agresiva
    try {
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('transporegistros-auth-token')
      // En móvil, ser más selectivo con la limpieza
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      if (import.meta.env.DEV) {
        console.log('🧹 Local storage cleared successfully');
      }
    } catch (error) {
      console.warn('⚠️ Error clearing localStorage:', error)
    }
  }
  
  if (event === 'TOKEN_REFRESHED' && import.meta.env.DEV) {
    console.log('🔄 Token de autenticación renovado')
  }
  
  if (event === 'SIGNED_IN' && import.meta.env.DEV) {
    console.log('✅ Usuario autenticado:', session?.user?.email)
  }
})

// Verificar conexión con Supabase solo en desarrollo
const healthCheck = async () => {
  if (!import.meta.env.DEV) return;
  
  try {
    const { data, error } = await supabase.from('vehicles').select('count').limit(1)
    if (error) {
      console.warn('⚠️ Problema de conexión con Supabase:', error.message)
    } else {
      console.log('✅ Conexión con Supabase establecida correctamente')
    }
  } catch (error) {
    console.error('❌ Error de conexión con Supabase:', error)
  }
}

// Ejecutar verificación solo en desarrollo
if (import.meta.env.DEV) {
  healthCheck()
}

export default supabase
