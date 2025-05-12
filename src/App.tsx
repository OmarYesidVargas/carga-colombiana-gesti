
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import VehiclesPage from "./pages/vehicles/VehiclesPage";
import TripsPage from "./pages/trips/TripsPage";
import TripDetailPage from "./pages/trips/TripDetailPage";
import ExpensesReportPage from "./pages/reports/ExpensesReportPage";
import NotFound from "./pages/NotFound";
import AuthRoute from "./routes/AuthRoute";

const queryClient = new QueryClient();

const App = () => {
  // Verificar si hay un usuario en localStorage (usuario autenticado)
  const storedUser = localStorage.getItem('user');
  const isAuthenticated = !!storedUser;
  const userEmail = storedUser ? JSON.parse(storedUser).email : null;
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              
              <Routes>
                {/* Páginas públicas */}
                <Route path="/" element={<Layout isAuthenticated={isAuthenticated} userEmail={userEmail} onLogout={handleLogout} />}>
                  <Route index element={<LandingPage />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />

                  {/* Páginas protegidas */}
                  <Route element={<AuthRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="vehicles" element={<VehiclesPage />} />
                    <Route path="trips" element={<TripsPage />} />
                    <Route path="trips/:id" element={<TripDetailPage />} />
                    <Route path="reports/expenses" element={<ExpensesReportPage />} />
                  </Route>
                  
                  {/* Redirección de rutas desconocidas */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
