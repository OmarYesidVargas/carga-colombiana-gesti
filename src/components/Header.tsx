
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  userEmail?: string;
  onLogout?: () => void;
}

const Header = ({ userEmail, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleRegister = () => {
    navigate('/register');
  };
  
  const handleLogout = () => {
    if (onLogout) onLogout();
  };
  
  const handleSettings = () => {
    navigate('/settings');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => navigate('/')}
        >
          <span className="text-xl font-semibold text-primary">
            Transpo<span className="text-secondary">registros</span>
            <span className="text-primary font-bold">Plus</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center">
        {userEmail ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block max-w-[150px] truncate">
                  {userEmail}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleLogin}>Iniciar sesión</Button>
            <Button variant="default" onClick={handleRegister}>Registrarse</Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
