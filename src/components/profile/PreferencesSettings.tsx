
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Globe, Bell, Palette, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useDebugLogger } from '@/hooks/useDebugLogger';
import { PreferencesRegionalSettings } from './PreferencesRegionalSettings';
import { PreferencesNotificationSettings } from './PreferencesNotificationSettings';

interface UserPreferences {
  language: string;
  country: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  theme: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderNotifications: boolean;
  dataExport: boolean;
  analytics: boolean;
}

const defaultPreferences: UserPreferences = {
  language: 'es',
  country: 'CO',
  currency: 'COP',
  timezone: 'America/Bogota',
  dateFormat: 'dd/MM/yyyy',
  theme: 'system',
  emailNotifications: true,
  pushNotifications: true,
  reminderNotifications: true,
  dataExport: false,
  analytics: true,
};

/**
 * Componente de configuración de preferencias refactorizado
 * Ahora con mejor estructura y debugging avanzado
 */
export const PreferencesSettings = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const { log, logAction, logError } = useDebugLogger({ component: 'PreferencesSettings' });

  useEffect(() => {
    const loadPreferences = () => {
      try {
        log('Loading user preferences from localStorage');
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const parsed = JSON.parse(savedPreferences);
          setPreferences({ ...defaultPreferences, ...parsed });
          log('Preferences loaded successfully', parsed);
        } else {
          log('No saved preferences found, using defaults');
        }
      } catch (error) {
        logError(error as Error, { context: 'loading preferences' });
      }
    };

    loadPreferences();
  }, [log, logError]);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    logAction(`Updating preference: ${key}`, { key, value });
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      logAction('Saving preferences', preferences);
      const startTime = performance.now();
      
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      log(`Preferences saved successfully in ${(performance.now() - startTime).toFixed(2)}ms`);
      toast.success('Preferencias guardadas correctamente');
    } catch (error) {
      logError(error as Error, { preferences });
      toast.error('Error al guardar las preferencias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuración Regional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configuración Regional
          </CardTitle>
          <CardDescription>
            Personaliza el idioma, país y formato de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PreferencesRegionalSettings 
            preferences={preferences}
            updatePreference={updatePreference}
          />
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura cómo y cuándo recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PreferencesNotificationSettings 
            preferences={preferences}
            updatePreference={updatePreference}
          />
        </CardContent>
      </Card>

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={loading} size="lg">
          {loading ? 'Guardando...' : 'Guardar Preferencias'}
        </Button>
      </div>
    </div>
  );
};
