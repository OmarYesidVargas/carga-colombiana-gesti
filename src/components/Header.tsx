
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
    <header className="
      sticky top-0 z-50
      bg-white dark:bg-gray-950 
      border-b border-gray-200 dark:border-gray-800 
      h-14 sm:h-16
      px-3 sm:px-4 lg:px-6
      flex items-center justify-between 
      shadow-sm
      w-full
      flex-shrink-0
    ">
      <div className="flex items-center min-w-0 flex-1">
        <div 
          className="cursor-pointer flex items-center min-w-0" 
          onClick={() => navigate(userEmail ? '/dashboard' : '/')}
        >
          <span className="
            text-base sm:text-lg lg:text-xl 
            font-semibold text-primary 
            truncate
            whitespace-nowrap
          ">
            Transpo<span className="text-secondary">registros</span>
            <span className="text-primary font-bold">Plus</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center flex-shrink-0 ml-2">
        {userEmail ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="
                  flex items-center gap-1 sm:gap-2 
                  px-2 sm:px-3 lg:px-4
                  h-8 sm:h-9 lg:h-10
                  text-xs sm:text-sm
                "
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="
                  hidden sm:inline-block 
                  max-w-[80px] lg:max-w-[150px] 
                  truncate
                  text-xs sm:text-sm
                ">
                  {userEmail}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="max-w-[200px] truncate">
                {userEmail}
              </DropdownMenuLabel>
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
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="
                text-xs sm:text-sm 
                px-2 sm:px-3
                h-8 sm:h-9
              " 
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="
                text-xs sm:text-sm
                px-2 sm:px-3  
                h-8 sm:h-9
              " 
              onClick={handleRegister}
            >
              Registrarse
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
