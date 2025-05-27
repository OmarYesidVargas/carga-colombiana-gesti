
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Calendar, FileChartPie, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Truck,
      title: "Gestión de Vehículos",
      description: "Administra tu flota de vehículos con información detallada y seguimiento completo."
    },
    {
      icon: Calendar,
      title: "Control de Viajes",
      description: "Organiza y rastrea todos tus viajes con origen, destino y distancia."
    },
    {
      icon: FileChartPie,
      title: "Gestión de Gastos",
      description: "Registra todos los gastos por categoría para cada viaje realizado."
    },
    {
      icon: BarChart3,
      title: "Reportes y Estadísticas",
      description: "Visualiza reportes detallados de tus gastos para optimizar tus operaciones."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="w-full p-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TransporegistrosPlus</h1>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              TransporegistrosPlus
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              La solución integral para gestionar tu operación de transporte. 
              Controla vehículos, viajes, gastos y genera reportes profesionales.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/register">
                <Button size="lg" className="gap-2 min-w-[200px]">
                  <Shield className="h-5 w-5" />
                  Comenzar Gratis
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2 min-w-[200px]">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Funcionalidades Principales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6 flex flex-col items-center text-center h-full">
                  <div className="p-3 bg-blue-100 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-gray-600 flex-1">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">
            ¿Listo para optimizar tu operación de transporte?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Únete a profesionales del transporte que ya optimizan su gestión con TransporegistrosPlus.
          </p>
          <Link to="/register">
            <Button size="lg" className="min-w-[250px]">
              Comenzar Ahora - Es Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg font-bold mb-2">TransporegistrosPlus</p>
          <p className="text-sm text-gray-400 mb-6">
            Sistema profesional de gestión de transportes para el mercado colombiano
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/login" className="text-gray-400 hover:text-blue-400 transition-colors">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="text-gray-400 hover:text-blue-400 transition-colors">
              Registrarse
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} TransporegistrosPlus. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
