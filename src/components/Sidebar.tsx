
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Car, Truck, Calendar, FileChartPie } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: FileChartPie },
    { title: "Vehículos", url: "/vehicles", icon: Truck },
    { title: "Viajes", url: "/trips", icon: Calendar },
  ];

  const isActive = (path: string) => currentPath.startsWith(path);
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
      isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"
    );

  return (
    <Sidebar
      className={cn(
        "border-r border-border",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
      collapsible
    >
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!collapsed && "px-3")}>
            {!collapsed ? "Navegación" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/'} className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!collapsed && "px-3")}>
            {!collapsed ? "Reportes" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/reports/expenses" className={getNavCls}>
                    <FileChartPie className="h-5 w-5" />
                    {!collapsed && <span>Gastos</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
