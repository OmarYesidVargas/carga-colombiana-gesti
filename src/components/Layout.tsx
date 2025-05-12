
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import AppSidebar from './Sidebar';
import { useData } from '@/context/DataContext';

type LayoutProps = {
  isAuthenticated?: boolean;
  userEmail?: string;
  onLogout?: () => void;
};

const Layout = ({ isAuthenticated = false, userEmail, onLogout }: LayoutProps) => {
  const { vehicles, getVehicleById } = useData();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header userEmail={userEmail} onLogout={onLogout} />
      
      {isAuthenticated ? (
        <div className="relative flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
