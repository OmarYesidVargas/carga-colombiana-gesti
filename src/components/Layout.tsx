
import React from 'react';
import Header from './Header';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen w-full flex bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white shadow-sm px-4">
            <SidebarTrigger className="h-9 w-9 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center">
              <Menu className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            <div className="flex-1 min-w-0">
              <Header userEmail={user?.email} onLogout={logout} />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
            <div className="w-full max-w-full mx-auto space-y-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
