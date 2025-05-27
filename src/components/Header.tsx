
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center min-w-0 flex-1">
        {userEmail ? (
          <Link 
            to="/dashboard"
            className="cursor-pointer flex items-center min-w-0 focus:outline-none hover:opacity-80 transition-opacity" 
            aria-label="Ir al dashboard"
          >
            <span className="text-base md:text-lg font-semibold text-primary truncate">
              Transpo<span className="text-secondary">registros</span>
              <span className="text-primary font-bold">Plus</span>
            </span>
          </Link>
        ) : (
          <Link 
            to="/"
            className="cursor-pointer flex items-center min-w-0 focus:outline-none hover:opacity-80 transition-opacity" 
            aria-label="Ir al inicio"
          >
            <span className="text-base md:text-lg font-semibold text-primary truncate">
              Transpo<span className="text-secondary">registros</span>
              <span className="text-primary font-bold">Plus</span>
            </span>
          </Link>
        )}
      </div>
      
      <div className="flex items-center flex-shrink-0 ml-2">
        {userEmail ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-2 h-9"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={avatarUrl || undefined} alt="Foto de perfil" />
                  <AvatarFallback className="text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block max-w-[120px] truncate text-sm">
                  {userEmail}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 z-50 bg-background border border-border shadow-lg"
            >
              <DropdownMenuLabel className="max-w-[200px] truncate text-sm">
                {userEmail}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer text-sm">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm px-3 h-9" 
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="text-sm px-3 h-9" 
              onClick={handleRegister}
            >
              Registrarse
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
