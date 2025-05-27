
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createClient } from '@supabase/supabase-js'

// Configuración para producción con variables de entorno
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://pwieabhoqzstiglmjmod.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aWVhYmhvcXpzdGlnbG1qbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTUzOTEsImV4cCI6MjA2MzM3MTM5MX0.BomWLRgOMMqGmxsIzrowSfmn8QA8Kj9Oit83rNOmh3I";

// Inicializar cliente de Supabase con configuración optimizada para producción
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'TransporegistrosPlus'
    }
  }
});

console.log('🚀 TransporegistrosPlus iniciado correctamente');
console.log('🔗 Supabase conectado:', SUPABASE_URL);

createRoot(document.getElementById("root")!).render(<App />);
