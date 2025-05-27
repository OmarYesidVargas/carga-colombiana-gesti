
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
  LayoutDashboard,
  Menu,
  Truck,
  X,
  Milestone
} from "lucide-react";

const AppSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useMobile();
  
  const activeClass = "bg-primary/10 text-primary font-medium border-r-2 border-primary";
  
  const linkClass = `
    flex items-center gap-2 sm:gap-3
    py-2.5 sm:py-3 
    px-3 sm:px-4 
    rounded-l-md 
    w-full 
    transition-all duration-200
    text-sm sm:text-base
    hover:bg-muted/50
    focus:outline-none focus:ring-2 focus:ring-primary/20
  `;
  
  const menuItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/vehicles", icon: Truck, label: "Vehículos" },
    { to: "/trips", icon: ArrowLeftRight, label: "Viajes" },
    { to: "/expenses", icon: CreditCard, label: "Gastos" },
    { to: "/tolls", icon: Milestone, label: "Peajes" },
    { to: "/toll-records", icon: CalendarClock, label: "Registros de Peajes" },
    { to: "/reports", icon: BarChart, label: "Reportes" }
  ];

  // Cerrar sidebar cuando cambie a desktop
  React.useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {isMobile && (
        <Button 
          variant="outline" 
          size="icon"
          className="
            fixed bottom-4 right-4 z-50 
            rounded-full shadow-lg
            h-12 w-12
            border-2 border-primary/20
            bg-background/95 backdrop-blur-sm
            hover:bg-primary hover:text-primary-foreground
          "
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}
    
      <aside
        className={cn(
          "bg-card border-r border-border flex-shrink-0 flex flex-col",
          "hidden lg:flex lg:w-64",
          isMobile && [
            "fixed left-0 top-14 bottom-0 z-40",
            "w-72 max-w-[85vw]",
            "transition-transform duration-300 ease-in-out",
            "shadow-xl",
            !isOpen && "-translate-x-full",
            isOpen && "translate-x-0"
          ]
        )}
      >
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(linkClass, isActive && activeClass)
              }
              onClick={() => isMobile && setIsOpen(false)}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
        
        {isMobile && (
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cerrar menú
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default AppSidebar;
