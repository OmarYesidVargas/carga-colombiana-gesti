
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
import ExpensesPage from "./pages/expenses/ExpensesPage";
import ExpensesReportPage from "./pages/reports/ExpensesReportPage";
import NotFound from "./pages/NotFound";
import AuthRoute from "./routes/AuthRoute";
import TollsPage from "./pages/tolls/TollsPage";
import TollRecordsPage from "./pages/tolls/TollRecordsPage";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />

                  {/* Protected pages */}
                  <Route element={<AuthRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="vehicles" element={<VehiclesPage />} />
                    <Route path="trips" element={<TripsPage />} />
                    <Route path="trips/:id" element={<TripDetailPage />} />
                    <Route path="expenses" element={<ExpensesPage />} />
                    <Route path="tolls" element={<TollsPage />} />
                    <Route path="toll-records" element={<TollRecordsPage />} />
                    
                    {/* Reports section */}
                    <Route path="reports">
                      <Route index element={<Navigate to="/reports/expenses" replace />} />
                      <Route path="expenses" element={<ExpensesReportPage />} />
                    </Route>
                  </Route>
                  
                  {/* Redirect unknown routes */}
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
