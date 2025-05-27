
/**
 * Punto de entrada principal de la aplicación TransporegistrosPlus
 * 
 * Este archivo es el entry point de React que:
 * - Inicializa la aplicación React con createRoot (React 18+)
 * - Renderiza el componente App principal
 * - Aplica los estilos CSS globales
 * - Registra logs de inicio para debugging
 * 
 * Configuración:
 * - Utiliza React 18 con createRoot para mejores performance
 * - Importa estilos globales desde index.css
 * - Modo estricto implícito a través del componente App
 * 
 * Debugging:
 * - Log de inicio para confirmar arranque exitoso
 * - Facilita identificación de problemas de inicialización
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log de confirmación de inicio exitoso
console.log('🚀 TransporegistrosPlus iniciado correctamente');

// Inicialización de React 18 con createRoot
// Utiliza non-null assertion (!) porque el elemento #root está garantizado en index.html
createRoot(document.getElementById("root")!).render(<App />);
