
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { 
  Truck, 
  ArrowLeftRight, 
  CreditCard, 
  BarChart, 
  Shield, 
  Clock,
  CheckCircle,
  Star
} from "lucide-react";

const Index = () => {
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
      icon: ArrowLeftRight,
      title: "Control de Viajes",
      description: "Registra y monitorea todos tus viajes con rutas, fechas y detalles específicos."
    },
    {
      icon: CreditCard,
      title: "Seguimiento de Gastos",
      description: "Controla todos los gastos operacionales con categorización automática."
    },
    {
      icon: BarChart,
      title: "Reportes Detallados",
      description: "Genera reportes completos para análisis y toma de decisiones."
    }
  ];

  const benefits = [
    "Control total de tu operación de transporte",
    "Ahorro de tiempo en gestión administrativa",
    "Reportes financieros precisos",
    "Cumplimiento normativo garantizado",
    "Optimización de rutas y costos",
    "Respaldo seguro en la nube"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            🚀 Sistema de Gestión de Transportes
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Transpo<span className="text-blue-600">registros</span>
            <span className="text-gray-900 font-extrabold">Plus</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed px-4">
            La solución integral para la gestión de transportes.
            Controla vehículos, viajes, gastos y genera reportes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 w-full sm:w-auto"
              onClick={() => navigate('/register')}
            >
              Comenzar Gratis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 w-full sm:w-auto"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Funcionalidades Principales
          </h2>
          <p className="text-lg text-gray-600 px-4">
            Todo lo que necesitas para gestionar tu operación de transporte
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-blue-100">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir TransporegistrosPlus?
              </h2>
              <p className="text-lg text-gray-600 px-4">
                Beneficios que marcan la diferencia en tu operación
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
          <CardHeader className="pb-4">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <CardTitle className="text-2xl lg:text-3xl text-white">
              ¡Comienza hoy mismo!
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg px-4">
              Únete a cientos de transportadores que ya optimizan su operación
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-3 w-full sm:w-auto"
                onClick={() => navigate('/register')}
              >
                <Clock className="mr-2 h-5 w-5" />
                Registro Rápido
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
                onClick={() => navigate('/login')}
              >
                <Shield className="mr-2 h-5 w-5" />
                Acceso Seguro
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <span className="text-xl font-semibold">
              Transpo<span className="text-blue-400">registros</span>
              <span className="font-bold">Plus</span>
            </span>
          </div>
          <p className="text-gray-400 px-4">
            © 2025 TransporegistrosPlus. Sistema integral de gestión de transportes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
