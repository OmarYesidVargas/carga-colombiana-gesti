
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Configuración mejorada del basename para GitHub Pages
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

function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const basename = getBasename();
  
  console.log('App starting with basename:', basename);
  console.log('Current location:', window.location.href);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
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
          <AuthProvider>
            <DataProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route path="/dashboard" element={
                  <AuthRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/profile/settings" element={
                  <AuthRoute>
                    <Layout>
                      <ProfileSettings />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/vehicles" element={
                  <AuthRoute>
                    <Layout>
                      <VehiclesPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/trips" element={
                  <AuthRoute>
                    <Layout>
                      <TripsPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/trips/:id" element={
                  <AuthRoute>
                    <Layout>
                      <TripDetailPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/expenses" element={
                  <AuthRoute>
                    <Layout>
                      <ExpensesPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/tolls" element={
                  <AuthRoute>
                    <Layout>
                      <TollsPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/toll-records" element={
                  <AuthRoute>
                    <Layout>
                      <TollRecordsPage />
                    </Layout>
                  </AuthRoute>
                } />
                
                <Route path="/reports" element={
                  <AuthRoute>
                    <Layout>
                      <ExpensesReportPage />
                    </Layout>
                  </AuthRoute>
                } />
                
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
