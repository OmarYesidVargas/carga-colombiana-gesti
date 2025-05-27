
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
    <Sidebar collapsible="offcanvas" className="border-r">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold px-4 py-3 text-sm">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.to}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all w-full no-underline ${
                          isActive 
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-medium" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate font-medium">{item.label}</span>
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
