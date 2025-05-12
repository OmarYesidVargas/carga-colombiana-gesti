
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from './Header';
import AppSidebar from './Sidebar';

type LayoutProps = {
  isAuthenticated?: boolean;
  userEmail?: string;
  onLogout?: () => void;
};

const Layout = ({ isAuthenticated = false, userEmail, onLogout }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userEmail={userEmail} onLogout={onLogout} />
      
      {isAuthenticated ? (
        <SidebarProvider collapsedWidth={70}>
          <div className="flex flex-1 w-full">
            <AppSidebar />
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
