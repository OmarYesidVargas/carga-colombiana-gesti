/**
 * Dashboard Component
 * 
 * Página principal del dashboard que muestra un resumen
 * de las métricas y accesos rápidos más importantes.
 * 
 * Características:
 * - Métricas principales en tiempo real
 * - Accesos rápidos a funcionalidades clave
 * - Visualización de alertas y estados
 * - Integración con el contexto de datos
 * - Diseño responsive y adaptable
 * 
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:17:51
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';
import {
  Truck,
  Calendar,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';

/**
 * Interfaz para las métricas del dashboard
 */
interface DashboardMetrics {
  totalVehiculos: number;
  serviciosActivos: number;
  serviciosProgramados: number;
  alertas: number;
  ultimaActualizacion?: string;
}

/**
 * Configuración de las tarjetas de métricas
 */
const metricCards = [
  {
    title: 'Total Vehículos',
    description: 'Vehículos registrados en el sistema',
    icon: Truck,
    metric: 'totalVehiculos',
    colorClass: 'text-blue-500'
  },
  {
    title: 'Servicios Activos',
    description: 'Servicios en curso actualmente',
    icon: TrendingUp,
    metric: 'serviciosActivos',
    colorClass: 'text-green-500'
  },
  {
    title: 'Programados',
    description: 'Servicios programados pendientes',
    icon: Calendar,
    metric: 'serviciosProgramados',
    colorClass: 'text-orange-500'
  },
  {
    title: 'Alertas',
    description: 'Alertas pendientes de atención',
    icon: AlertTriangle,
    metric: 'alertas',
    colorClass: 'text-red-500'
  }
];

/**
 * Configuración de las tarjetas de acceso rápido
 */
const quickAccessCards = [
  {
    title: 'Vehículos',
    description: 'Gestiona tu flota de vehículos',
    icon: Truck,
    href: '/vehicles',
    colorClass: 'text-blue-500 bg-blue-500/10'
  },
  {
    title: 'Programación',
    description: 'Agenda y control de servicios',
    icon: Calendar,
    href: '/schedule',
    colorClass: 'text-green-500 bg-green-500/10'
  },
  {
    title: 'Reportes',
    description: 'Análisis y estadísticas',
    icon: PieChart,
    href: '/reports',
    colorClass: 'text-purple-500 bg-purple-500/10'
  },
  {
    title: 'Rendimiento',
    description: 'Métricas de operación',
    icon: TrendingUp,
    href: '/performance',
    colorClass: 'text-orange-500 bg-orange-500/10'
  }
];

/**
 * Componente Dashboard
 * @returns {JSX.Element} El componente Dashboard
 */
const Dashboard: React.FC = () => {
  const { metrics, refreshMetrics } = useData();

  // Datos de métricas con valores por defecto
  const dashboardMetrics: DashboardMetrics = {
    totalVehiculos: metrics?.vehiculos ?? 0,
    serviciosActivos: metrics?.serviciosActivos ?? 0,
    serviciosProgramados: metrics?.serviciosProgramados ?? 0,
    alertas: metrics?.alertas ?? 0,
    ultimaActualizacion: metrics?.ultimaActualizacion
  };

  /**
   * Maneja la actualización manual de métricas
   */
  const handleRefresh = async () => {
    try {
      await refreshMetrics();
    } catch (error) {
      console.error('Error al actualizar métricas:', error);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {dashboardMetrics.ultimaActualizacion && (
            <p className="text-sm text-muted-foreground">
              Última actualización: {dashboardMetrics.ultimaActualizacion}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Actualizar datos"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Configuración"
            asChild
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Descargar Reporte
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon 
                className={cn(
                  "h-4 w-4",
                  card.colorClass
                )} 
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardMetrics[card.metric as keyof DashboardMetrics]}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accesos Rápidos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickAccessCards.map((card, index) => (
          <Link key={index} to={card.href}>
            <Card className="transition-all hover:shadow-md hover:bg-muted/50">
              <CardHeader>
                <div className={cn(
                  "w-fit rounded-lg p-2",
                  card.colorClass
                )}>
                  <card.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">
                  {card.title}
                </CardTitle>
                <CardDescription>
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
