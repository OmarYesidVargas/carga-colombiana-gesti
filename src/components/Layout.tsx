
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
      <div className="min-h-screen w-full flex bg-slate-50">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-gray-200 bg-white shadow-sm px-4">
            <SidebarTrigger className="h-9 w-9 p-0 hover:bg-violet-50 rounded-md flex items-center justify-center border border-violet-200 text-violet-600">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            <div className="flex-1 min-w-0">
              <Header userEmail={user?.email} onLogout={logout} />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-slate-50">
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
