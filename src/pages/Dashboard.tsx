
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { Truck, Calendar, FileChartPie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExpensesChart from '@/components/reports/ExpensesChart';
import MonthlyExpenseChart from '@/components/reports/MonthlyExpenseChart';
import ExpenseSummary from '@/components/reports/ExpenseSummary';
import { formatCurrency } from '@/utils/chartColors';

const Dashboard = () => {
  const { 
    vehicles, 
    trips, 
    expenses, 
    getVehicleById, 
    getTripById 
  } = useData();
  
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
    <div className="space-y-6 bg-white min-h-full">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de control de TransporegistrosPlus
        </p>
      </div>
      
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-900">
                Vehículos
              </CardTitle>
              <CardDescription>
                Total de vehículos registrados
              </CardDescription>
            </div>
            <Truck className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{vehicles.length}</div>
            <Link to="/vehicles">
              <Button variant="link" className="p-0 h-auto text-blue-600">Ver vehículos</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-900">
                Viajes
              </CardTitle>
              <CardDescription>
                Viajes activos / Total
              </CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {activeTrips.length} / {trips.length}
            </div>
            <Link to="/trips">
              <Button variant="link" className="p-0 h-auto text-blue-600">Ver viajes</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-900">
                Gastos
              </CardTitle>
              <CardDescription>
                Total de gastos registrados
              </CardDescription>
            </div>
            <FileChartPie className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalExpenses)}
            </div>
            <Link to="/reports">
              <Button variant="link" className="p-0 h-auto text-blue-600">Ver reportes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficas de gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <ExpensesChart expenses={expenses} />
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <MonthlyExpenseChart expenses={expenses} />
        </div>
      </div>
      
      {/* Resumen de gastos recientes */}
      <div className="bg-white rounded-lg shadow-sm">
        <ExpenseSummary 
          expenses={recentExpenses} 
          vehicles={vehicles} 
          trips={trips} 
          title="Gastos de los últimos 30 días" 
        />
      </div>
      
      {/* Enlaces rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center py-6 bg-white">
          <Truck className="h-10 w-10 text-blue-600 mb-4" />
          <CardTitle className="mb-3 text-gray-900">Administrar Vehículos</CardTitle>
          <Link to="/vehicles">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ir a Vehículos</Button>
          </Link>
        </Card>
        
        <Card className="flex flex-col items-center py-6 bg-white">
          <Calendar className="h-10 w-10 text-blue-600 mb-4" />
          <CardTitle className="mb-3 text-gray-900">Administrar Viajes</CardTitle>
          <Link to="/trips">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ir a Viajes</Button>
          </Link>
        </Card>
        
        <Card className="flex flex-col items-center py-6 bg-white">
          <FileChartPie className="h-10 w-10 text-blue-600 mb-4" />
          <CardTitle className="mb-3 text-gray-900">Ver Reportes</CardTitle>
          <Link to="/reports">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ir a Reportes</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
