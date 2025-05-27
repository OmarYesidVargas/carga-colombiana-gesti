
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowLeftRight,
  BarChart,
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  Truck,
  Milestone
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/vehicles", icon: Truck, label: "Vehículos" },
  { to: "/trips", icon: ArrowLeftRight, label: "Viajes" },
  { to: "/expenses", icon: CreditCard, label: "Gastos" },
  { to: "/tolls", icon: Milestone, label: "Peajes" },
  { to: "/toll-records", icon: CalendarClock, label: "Registros de Peajes" },
  { to: "/reports", icon: BarChart, label: "Reportes" }
];

export function AppSidebar() {
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.to}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all w-full ${
                          isActive 
                            ? "bg-primary text-primary-foreground font-medium" 
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
