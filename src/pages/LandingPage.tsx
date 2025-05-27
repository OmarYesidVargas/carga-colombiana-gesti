
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
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary/20 to-background pt-12 pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            TransporegistrosPlus
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Gestiona tus vehículos, viajes y gastos de transporte de forma sencilla e intuitiva
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                <Shield className="h-5 w-5" />
                Comenzar Ahora
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Todas las herramientas que necesitas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-primary/20 hover:shadow-md transition-all">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/20 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/10 py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para optimizar tu operación de transporte?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Regístrate hoy y comienza a gestionar tus vehículos, viajes y gastos de manera eficiente.
          </p>
          <Link to="/register">
            <Button size="lg">
              Comenzar Gratis
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-muted py-10 px-4 md:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg font-bold mb-2">TransporegistrosPlus</p>
          <p className="text-sm text-muted-foreground">
            Diseñado especialmente para el mercado colombiano de transporte
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <Link to="/login" className="text-muted-foreground hover:text-primary">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="text-muted-foreground hover:text-primary">
              Registrarse
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-8">
            © {new Date().getFullYear()} TransporegistrosPlus. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
