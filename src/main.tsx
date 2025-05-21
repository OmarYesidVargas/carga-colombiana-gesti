
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createClient } from '@supabase/supabase-js'

// Esta línea es solo para verificar que Supabase está correctamente configurado
const SUPABASE_URL = "https://pwieabhoqzstiglmjmod.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aWVhYmhvcXpzdGlnbG1qbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTUzOTEsImV4cCI6MjA2MzM3MTM5MX0.BomWLRgOMMqGmxsIzrowSfmn8QA8Kj9Oit83rNOmh3I";
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client initialized', client);

createRoot(document.getElementById("root")!).render(<App />);
