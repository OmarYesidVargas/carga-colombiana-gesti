
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Globe, Bell, Palette, Database, Download } from 'lucide-react';
import { toast } from 'sonner';
import { SUPPORTED_COUNTRIES } from '@/lib/constants';

interface Preferences {
  language: string;
  country: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    vehicleExpiry: boolean;
    tripReminders: boolean;
  };
  appearance: {
    theme: string;
    density: string;
  };
}

export const PreferencesSettings = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    language: 'es',
    country: 'CO',
    currency: 'COP',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    notifications: {
      email: true,
      push: true,
      vehicleExpiry: true,
      tripReminders: true,
    },
    appearance: {
      theme: 'system',
      density: 'comfortable',
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar preferencias guardadas del localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing preferences:', error);
      }
    }
  }, []);

  const savePreferences = async () => {
    try {
      setLoading(true);
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      toast.success('Preferencias guardadas correctamente');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Error al guardar las preferencias');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => {
      const keys = key.split('.');
      if (keys.length === 1) {
        return { ...prev, [key]: value };
      } else {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof Preferences],
            [keys[1]]: value,
          },
        };
      }
    });
  };

  const exportData = () => {
    toast.info('Función de exportación en desarrollo');
  };

  const deleteAccount = () => {
    toast.error('Para eliminar tu cuenta, contacta al soporte técnico');
  };

  return (
    <div className="space-y-6">
      {/* Configuración Regional */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Configuración Regional</CardTitle>
          </div>
          <CardDescription>
            Configura tu idioma, país y formatos preferidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => updatePreference('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>País</Label>
              <Select
                value={preferences.country}
                onValueChange={(value) => updatePreference('country', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select
                value={preferences.currency}
                onValueChange={(value) => updatePreference('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="BRL">BRL - Real Brasileño</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Formato de Fecha</Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={(value) => updatePreference('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                  <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                  <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notificaciones</CardTitle>
          </div>
          <CardDescription>
            Controla qué notificaciones quieres recibir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe actualizaciones importantes por correo
              </p>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(value) => updatePreference('notifications.email', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Vencimiento de Documentos</Label>
              <p className="text-sm text-muted-foreground">
                Alertas sobre SOAT y tecnomecánica próximos a vencer
              </p>
            </div>
            <Switch
              checked={preferences.notifications.vehicleExpiry}
              onCheckedChange={(value) => updatePreference('notifications.vehicleExpiry', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Recordatorios de Viajes</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones sobre viajes programados
              </p>
            </div>
            <Switch
              checked={preferences.notifications.tripReminders}
              onCheckedChange={(value) => updatePreference('notifications.tripReminders', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Apariencia</CardTitle>
          </div>
          <CardDescription>
            Personaliza la apariencia de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select
                value={preferences.appearance.theme}
                onValueChange={(value) => updatePreference('appearance.theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Densidad</Label>
              <Select
                value={preferences.appearance.density}
                onValueChange={(value) => updatePreference('appearance.density', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compacta</SelectItem>
                  <SelectItem value="comfortable">Cómoda</SelectItem>
                  <SelectItem value="spacious">Espaciosa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos y Privacidad */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <CardTitle>Datos y Privacidad</CardTitle>
          </div>
          <CardDescription>
            Administra tus datos y configuración de privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={exportData}
            className="w-full justify-start"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Mis Datos
          </Button>

          <Separator />

          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <h4 className="font-medium text-destructive mb-2">Zona de Peligro</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
            </p>
            <Button
              variant="destructive"
              onClick={deleteAccount}
              className="w-full"
            >
              Eliminar Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botón para guardar */}
      <div className="flex justify-end">
        <Button
          onClick={savePreferences}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? 'Guardando...' : 'Guardar Preferencias'}
        </Button>
      </div>
    </div>
  );
};
