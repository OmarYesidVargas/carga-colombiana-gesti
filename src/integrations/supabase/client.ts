
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { APP_CONFIG } from '@/lib/constants'

// Configuración del cliente Supabase optimizada para producción
export const supabase = createClient<Database>(
  APP_CONFIG.supabase.url,
  APP_CONFIG.supabase.anonKey,
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'x-application-name': APP_CONFIG.name,
        'x-application-version': APP_CONFIG.version
      }
    },
    db: {
      schema: 'public'
    }
  }
)

// Configurar manejo de errores globales
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Limpiar datos locales al cerrar sesión
    localStorage.removeItem('supabase.auth.token')
  }
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 Token de autenticación renovado')
  }
  
  if (event === 'SIGNED_IN') {
    console.log('✅ Usuario autenticado:', session?.user?.email)
  }
})

// Verificar conexión con Supabase
const healthCheck = async () => {
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

// Ejecutar verificación en producción
if (import.meta.env.PROD) {
  healthCheck()
}

export default supabase
