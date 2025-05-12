
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { Truck, Calendar, FileChartPie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExpensesChart from '@/components/reports/ExpensesChart';
import MonthlyExpenseChart from '@/components/reports/MonthlyExpenseChart';
import ExpenseSummary from '@/components/reports/ExpenseSummary';

const Dashboard = () => {
  const { 
    vehicles, 
    trips, 
    expenses, 
    getVehicleById, 
    getTripById 
  } = useData();
  
  // Formatear moneda colombiana para el monto total de gastos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Calcular el total de gastos
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Encontrar viajes activos (sin fecha de fin o con fecha de fin futura)
  const activeTrips = trips.filter(
    (trip) => !trip.endDate || new Date() <= new Date(trip.endDate)
  );
  
  // Obtener gastos de los últimos 30 días
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(
    (expense) => new Date(expense.date) >= thirtyDaysAgo
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de control de TransporegistrosPlus
        </p>
      </div>
      
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Vehículos
              </CardTitle>
              <CardDescription>
                Total de vehículos registrados
              </CardDescription>
            </div>
            <Truck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vehicles.length}</div>
            <Link to="/vehicles">
              <Button variant="link" className="p-0 h-auto">Ver vehículos</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Viajes
              </CardTitle>
              <CardDescription>
                Viajes activos / Total
              </CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {activeTrips.length} / {trips.length}
            </div>
            <Link to="/trips">
              <Button variant="link" className="p-0 h-auto">Ver viajes</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Gastos
              </CardTitle>
              <CardDescription>
                Total de gastos registrados
              </CardDescription>
            </div>
            <FileChartPie className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold currency-cop">
              {formatCurrency(totalExpenses)}
            </div>
            <Link to="/reports/expenses">
              <Button variant="link" className="p-0 h-auto">Ver reportes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficas de gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesChart expenses={expenses} />
        <MonthlyExpenseChart expenses={expenses} />
      </div>
      
      {/* Resumen de gastos recientes */}
      <ExpenseSummary 
        expenses={recentExpenses} 
        vehicles={vehicles} 
        trips={trips} 
        title="Gastos de los últimos 30 días" 
      />
      
      {/* Enlaces rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center py-6">
          <Truck className="h-10 w-10 text-primary mb-4" />
          <CardTitle className="mb-3">Administrar Vehículos</CardTitle>
          <Link to="/vehicles">
            <Button>Ir a Vehículos</Button>
          </Link>
        </Card>
        
        <Card className="flex flex-col items-center py-6">
          <Calendar className="h-10 w-10 text-primary mb-4" />
          <CardTitle className="mb-3">Administrar Viajes</CardTitle>
          <Link to="/trips">
            <Button>Ir a Viajes</Button>
          </Link>
        </Card>
        
        <Card className="flex flex-col items-center py-6">
          <FileChartPie className="h-10 w-10 text-primary mb-4" />
          <CardTitle className="mb-3">Ver Reportes</CardTitle>
          <Link to="/reports/expenses">
            <Button>Ir a Reportes</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
