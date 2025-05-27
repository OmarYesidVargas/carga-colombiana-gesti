
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
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Header userEmail={user?.email} onLogout={logout} />
      
      <div className="flex flex-1 w-full overflow-hidden">
        <AppSidebar />
        <main className={`
          flex-1 
          overflow-y-auto 
          p-3 sm:p-4 md:p-6 lg:p-8
          ${isMobile ? 'pb-20' : ''}
          min-h-0
          w-full
        `}>
          <div className="w-full max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
