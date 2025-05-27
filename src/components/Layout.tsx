
import React from 'react';
import Header from './Header';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
            <div className="flex-1">
              <Header userEmail={user?.email} onLogout={logout} />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="w-full max-w-full mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
