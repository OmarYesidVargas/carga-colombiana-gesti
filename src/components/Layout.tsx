
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import AppSidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useMobile } from '@/hooks/use-mobile';

const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header userEmail={user?.email} onLogout={logout} />
      
      {isAuthenticated ? (
        <div className="relative flex flex-1 w-full">
          <AppSidebar />
          <main className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? 'pb-20' : ''}`}>
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
