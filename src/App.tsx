
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Inicializar configuración de la aplicación
    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
        <BrowserRouter basename="/transporegistrosplus">
          <AuthProvider>
            <DataProvider>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Rutas protegidas */}
                <Route path="/dashboard" element={
                  <AuthRoute>
                    <Dashboard />
                  </AuthRoute>
                } />
                
                <Route path="/vehicles" element={
                  <AuthRoute>
                    <VehiclesPage />
                  </AuthRoute>
                } />
                
                <Route path="/trips" element={
                  <AuthRoute>
                    <TripsPage />
                  </AuthRoute>
                } />
                
                <Route path="/trips/:id" element={
                  <AuthRoute>
                    <TripDetailPage />
                  </AuthRoute>
                } />
                
                <Route path="/expenses" element={
                  <AuthRoute>
                    <ExpensesPage />
                  </AuthRoute>
                } />
                
                <Route path="/tolls" element={
                  <AuthRoute>
                    <TollsPage />
                  </AuthRoute>
                } />
                
                <Route path="/toll-records" element={
                  <AuthRoute>
                    <TollRecordsPage />
                  </AuthRoute>
                } />
                
                <Route path="/reports" element={
                  <AuthRoute>
                    <ExpensesReportPage />
                  </AuthRoute>
                } />
                
                {/* Ruta 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DataProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
