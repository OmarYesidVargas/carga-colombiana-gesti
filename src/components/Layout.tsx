
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
          <main className={`flex-1 p-4 sm:p-6 ${isMobile ? 'pb-16' : ''}`}>
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
