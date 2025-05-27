
/**
 * Componente principal de la aplicación TransporegistrosPlus
 * 
 * Este componente configura toda la estructura de la aplicación incluyendo:
 * - Configuración de React Query para gestión de estado servidor
 * - Router con soporte para GitHub Pages y desarrollo local
 * - Providers para autenticación y gestión de datos
 * - Sistema de notificaciones toast
 * - Rutas protegidas y públicas
 * - Layout responsivo con sidebar
 * - Inicialización de la aplicación
 * 
 * Características técnicas:
 * - Basename dinámico para deployment en GitHub Pages
 * - Lazy loading de componentes para optimización
 * - Error boundaries implícitos
 * - Configuración de toast personalizada
 * - Rutas anidadas con Layout compartido
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import VehiclesPage from "./pages/vehicles/VehiclesPage";
import TripsPage from "./pages/trips/TripsPage";
import TripDetailPage from "./pages/trips/TripDetailPage";
import ExpensesPage from "./pages/expenses/ExpensesPage";
import TollsPage from "./pages/tolls/TollsPage";
import TollRecordsPage from "./pages/tolls/TollRecordsPage";
import ExpensesReportPage from "./pages/reports/ExpensesReportPage";
import NotFound from "./pages/NotFound";
import AuthRoute from "./routes/AuthRoute";
import { initializeApp } from "@/utils/deployment";
import { useEffect } from "react";
import ProfileSettings from "./pages/profile/ProfileSettings";

/**
 * Configuración del cliente React Query
 * - Tiempo de cache: 5 minutos
 * - Reintentos: 1 vez en caso de error
 * - Optimizado para aplicaciones de gestión
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1, // Solo 1 reintento para evitar loops
    },
  },
});

/**
 * Determina el basename para el router según el entorno
 * - Desarrollo: Sin basename para localhost
 * - GitHub Pages: Basename con nombre del repositorio
 * - Otros deployments: Sin basename
 * 
 * @returns {string} Basename para BrowserRouter
 */
const getBasename = () => {
  // En desarrollo local, no usar basename
  if (import.meta.env.DEV) {
    return "";
  }
  
  // En producción, verificar si estamos en GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (isGitHubPages) {
    return "/transporegistrosplus";
  }
  
  // Para otros deployments de producción
  return "";
};

/**
 * Componente principal de la aplicación
 * Configura todos los providers y el sistema de rutas
 */
function App() {
  // Inicializar configuraciones de la aplicación
  useEffect(() => {
    initializeApp();
  }, []);

  const basename = getBasename();
  
  // Logging para debugging de rutas
  console.log('App starting with basename:', basename);
  console.log('Current location:', window.location.href);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <TooltipProvider>
          {/* Sistema de notificaciones toast personalizado */}
          <Toaster 
            position="top-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }
            }}
          />
          
          {/* Providers de contexto para toda la aplicación */}
          <AuthProvider>
            <DataProvider>
              <Routes>
                {/* Rutas públicas - No requieren autenticación */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Rutas protegidas - Requieren autenticación */}
                {/* Dashboard principal */}
                <Route path="/dashboard" element={
                  <AuthRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Configuración de perfil */}
                <Route path="/profile/settings" element={
                  <AuthRoute>
                    <Layout>
                      <ProfileSettings />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Gestión de vehículos */}
                <Route path="/vehicles" element={
                  <AuthRoute>
                    <Layout>
                      <VehiclesPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Gestión de viajes */}
                <Route path="/trips" element={
                  <AuthRoute>
                    <Layout>
                      <TripsPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Detalle de viaje específico */}
                <Route path="/trips/:id" element={
                  <AuthRoute>
                    <Layout>
                      <TripDetailPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Gestión de gastos */}
                <Route path="/expenses" element={
                  <AuthRoute>
                    <Layout>
                      <ExpensesPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Gestión de peajes */}
                <Route path="/tolls" element={
                  <AuthRoute>
                    <Layout>
                      <TollsPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Registros de peajes */}
                <Route path="/toll-records" element={
                  <AuthRoute>
                    <Layout>
                      <TollRecordsPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Reportes y análisis */}
                <Route path="/reports" element={
                  <AuthRoute>
                    <Layout>
                      <ExpensesReportPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                {/* Ruta 404 - Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DataProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
