
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  userEmail?: string;
  onLogout?: () => void;
}

const Header = ({ userEmail, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchUserAvatar();
    }
  }, [user]);

  const fetchUserAvatar = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching avatar:', error);
        return;
      }

      setAvatarUrl(data?.avatar_url || null);
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleRegister = () => {
    navigate('/register');
  };
  
  const handleLogout = async () => {
    if (onLogout) {
      try {
        await onLogout();
        navigate('/');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  };
  
  const handleSettings = () => {
    navigate('/profile/settings');
  };
  
  const getInitials = () => {
    if (!userEmail) return 'U';
    return userEmail.charAt(0).toUpperCase();
  };
  
  return (
    <div className="flex items-center justify-between w-full px-2 sm:px-4">
      <div className="flex items-center min-w-0 flex-1">
        {userEmail ? (
          <Link 
            to="/dashboard"
            className="cursor-pointer flex items-center min-w-0 focus:outline-none hover:opacity-80 transition-opacity" 
            aria-label="Ir al dashboard"
          >
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-primary truncate">
              {/* Versión extra pequeña - solo TR */}
              <span className="inline xs:hidden">TR</span>
              {/* Versión pequeña - Transpo + registros */}
              <span className="hidden xs:inline sm:hidden">
                <span className="text-primary font-bold">Transpo</span>
                <span className="text-primary font-bold">registros</span>
              </span>
              {/* Versión mediana y grande - completo */}
              <span className="hidden sm:inline">
                <span>Transpo</span>
                <span className="text-primary font-bold">registros</span>
                <span className="text-primary font-bold">Plus</span>
              </span>
            </span>
          </Link>
        ) : (
          <Link 
            to="/"
            className="cursor-pointer flex items-center min-w-0 focus:outline-none hover:opacity-80 transition-opacity" 
            aria-label="Ir al inicio"
          >
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-primary truncate">
              {/* Versión extra pequeña - solo TR */}
              <span className="inline xs:hidden">TR</span>
              {/* Versión pequeña - Transpo + registros */}
              <span className="hidden xs:inline sm:hidden">
                <span className="text-primary font-bold">Transpo</span>
                <span className="text-primary font-bold">registros</span>
              </span>
              {/* Versión mediana y grande - completo */}
              <span className="hidden sm:inline">
                <span>Transpo</span>
                <span className="text-primary font-bold">registros</span>
                <span className="text-primary font-bold">Plus</span>
              </span>
            </span>
          </Link>
        )}
      </div>
      
      <div className="flex items-center flex-shrink-0 ml-1 sm:ml-2">
        {userEmail ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 h-7 sm:h-8 md:h-9 text-xs sm:text-sm"
              >
                <Avatar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6">
                  <AvatarImage src={avatarUrl || undefined} alt="Foto de perfil" />
                  <AvatarFallback className="text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block max-w-[60px] sm:max-w-[80px] lg:max-w-[120px] truncate">
                  {userEmail}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 sm:w-56 z-50 bg-background border border-border shadow-lg"
            >
              <DropdownMenuLabel className="max-w-[180px] sm:max-w-[200px] truncate text-xs sm:text-sm">
                {userEmail}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer text-xs sm:text-sm">
                <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive text-xs sm:text-sm">
                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs sm:text-sm px-1 sm:px-2 md:px-3 h-6 sm:h-7 md:h-9" 
              onClick={handleLogin}
            >
              <span className="hidden xs:inline">Iniciar sesión</span>
              <span className="xs:hidden">Login</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="text-xs sm:text-sm px-1 sm:px-2 md:px-3 h-6 sm:h-7 md:h-9" 
              onClick={handleRegister}
            >
              <span className="hidden xs:inline">Registrarse</span>
              <span className="xs:hidden">Sign up</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
