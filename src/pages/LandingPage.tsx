
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Calendar, FileChartPie } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Todas las herramientas que necesitas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border border-primary/20 hover:shadow-md transition-all">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestión de Vehículos</h3>
                <p className="text-muted-foreground">
                  Registra y administra todos tus vehículos con información detallada.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-primary/20 hover:shadow-md transition-all">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Control de Viajes</h3>
                <p className="text-muted-foreground">
                  Organiza y rastrea todos tus viajes con origen, destino y distancia.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-primary/20 hover:shadow-md transition-all">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <FileChartPie className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestión de Gastos</h3>
                <p className="text-muted-foreground">
                  Registra todos los gastos por categoría para cada viaje realizado.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-primary/20 hover:shadow-md transition-all">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <FileChartPie className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reportes y Estadísticas</h3>
                <p className="text-muted-foreground">
                  Visualiza reportes detallados de tus gastos para optimizar tus operaciones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
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
