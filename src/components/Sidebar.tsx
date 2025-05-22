
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import {
  ArrowLeftRight,
  BarChart,
  CalendarClock,
  CreditCard,
  Home,
  LayoutDashboard,
  Menu,
  Truck,
  X,
  Road
} from "lucide-react";

const AppSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useMobile();
  
  // Clase para enlaces activos
  const activeClass = "bg-primary/10 text-primary font-medium";
  
  // Clase para enlaces
  const linkClass = "flex items-center gap-2 py-2 px-4 rounded-md w-full transition-colors text-sm";
  
  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Botón para abrir/cerrar en móvil */}
      {isMobile && (
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-4 right-4 z-30 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      )}
    
      {/* Sidebar */}
      <aside
        className={cn(
          "h-[calc(100vh-4rem)] bg-card w-64 border-r flex-shrink-0 py-2 flex flex-col",
          isMobile && "fixed left-0 top-16 z-20 transition-transform duration-300 shadow-lg",
          isMobile && !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-1 p-2">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(linkClass, isActive && activeClass)
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          
          {/* Vehículos */}
          <NavLink
            to="/vehicles"
            className={({ isActive }) =>
              cn(linkClass, isActive && activeClass)
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <Truck className="h-4 w-4" />
            <span>Vehículos</span>
          </NavLink>
          
          {/* Viajes */}
          <NavLink
            to="/trips"
            className={({ isActive }) =>
              cn(linkClass, isActive && activeClass)
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Viajes</span>
          </NavLink>
          
          {/* Gastos */}
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              cn(linkClass, isActive && activeClass)
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <CreditCard className="h-4 w-4" />
            <span>Gastos</span>
          </NavLink>
          
          {/* Peajes */}
          <NavLink
            to="/tolls"
            className={({ isActive }) =>
              cn(linkClass, isActive && activeClass)
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <Road className="h-4 w-4" />
            <span>Peajes</span>
          </NavLink>
          
          {/* Registro de Peajes */}
          <NavLink
            to="/toll-records"
            className={({ isActive }) =>
              cn(linkClass, isActive && activeClass)
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <CalendarClock className="h-4 w-4" />
            <span>Registros de Peajes</span>
          </NavLink>
          
          {/* Reportes */}
          <NavLink
            to="/reports/expenses"
            className={({ isActive }) =>
              cn(linkClass, isActive && activeClass)
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <BarChart className="h-4 w-4" />
            <span>Reportes</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
