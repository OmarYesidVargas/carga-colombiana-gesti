
import React from 'react';
import Header from './Header';
import AppSidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header userEmail={user?.email} onLogout={logout} />
      
      <div className="relative flex flex-1 w-full">
        <AppSidebar />
        <main className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? 'pb-20' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
