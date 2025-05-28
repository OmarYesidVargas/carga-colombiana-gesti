/**
 * LandingPage Component
 * 
 * Página principal de TransporegistrosPlus que muestra la introducción
 * y características principales del sistema.
 * 
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:10:37
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Calendar, PieChart, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Características principales del sistema
 * Cada característica incluye un título, descripción e ícono
 */
const features = [
  {
    title: "Gestión de Vehículos",
    description: "Administra tu flota de vehículos de manera eficiente y mantén un registro detallado de cada unidad",
    icon: Car
  },
  {
    title: "Control de Transportes",
    description: "Seguimiento en tiempo real de tus transportes y optimización de rutas",
    icon: Truck
  },
  {
    title: "Programación",
    description: "Planifica y organiza los servicios de transporte con un calendario intuitivo",
    icon: Calendar
  },
  {
    title: "Análisis y Reportes",
    description: "Genera informes detallados y visualiza métricas clave para la toma de decisiones",
    icon: PieChart
  },
  {
    title: "Seguridad",
    description: "Mantén tus datos seguros y protegidos con nuestro sistema de autenticación avanzado",
    icon: Shield
  },
  {
    title: "Estadísticas",
    description: "Visualiza el rendimiento de tu operación con gráficos interactivos y análisis detallados",
    icon: BarChart3
  }
];

/**
 * Componente LandingPage
 * Muestra la página de inicio con información sobre el sistema
 */
const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Hero Section */}
      <header className="relative bg-background pt-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between sm:h-10">
            <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
              <h1 className="text-2xl font-bold text-primary">TransporegistrosPlus</h1>
            </div>
            <div className="flex items-center md:ml-10 md:pr-4">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="mr-2">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Registrarse</Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button>Ir al Dashboard</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>

        <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Sistema Integral de</span>{' '}
              <span className="block text-primary xl:inline">Gestión de Transportes</span>
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
              Optimiza tus operaciones de transporte con nuestra plataforma integral.
              Gestiona vehículos, rutas y registros de manera eficiente y segura.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              {!user ? (
                <>
                  <div className="rounded-md shadow">
                    <Link to="/register">
                      <Button size="lg" className="w-full">
                        Comenzar Ahora
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="rounded-md shadow">
                  <Link to="/dashboard">
                    <Button size="lg">
                      Ir al Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </header>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
              Características Principales
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Todo lo que necesitas para gestionar tu operación de transporte de manera eficiente
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-primary/20">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className={cn(
                    "mb-4 rounded-lg bg-primary/10 p-3",
                    "flex h-12 w-12 items-center justify-center"
                  )}>
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-muted-foreground">
              &copy; 2025 TransporegistrosPlus. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
