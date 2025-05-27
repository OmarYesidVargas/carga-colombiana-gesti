
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Globe, Bell, Palette, Shield, Download } from 'lucide-react';
import { toast } from 'sonner';

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

export const PreferencesSettings = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar preferencias desde localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Error al cargar preferencias:', error);
      }
    }
  }, []);

  const savePreferences = async () => {
    setLoading(true);
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      toast.success('Preferencias guardadas correctamente');
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      toast.error('Error al guardar las preferencias');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleDataExport = () => {
    // Simular exportación de datos
    toast.info('Función de exportación en desarrollo');
  };

  const handleDataDeletion = () => {
    // Simular eliminación de datos
    toast.info('Función de eliminación en desarrollo');
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={preferences.language} onValueChange={(value) => updatePreference('language', value)}>
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
              <Label htmlFor="country">País</Label>
              <Select value={preferences.country} onValueChange={(value) => updatePreference('country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CO">Colombia</SelectItem>
                  <SelectItem value="MX">México</SelectItem>
                  <SelectItem value="ES">España</SelectItem>
                  <SelectItem value="AR">Argentina</SelectItem>
                  <SelectItem value="PE">Perú</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select value={preferences.currency} onValueChange={(value) => updatePreference('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                  <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de Fecha</Label>
              <Select value={preferences.dateFormat} onValueChange={(value) => updatePreference('dateFormat', value)}>
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
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura cómo y cuándo recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir alertas de vencimientos por email
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones en tiempo real en el navegador
                </p>
              </div>
              <Switch
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => updatePreference('pushNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de Documentos</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas 30 días antes del vencimiento
                </p>
              </div>
              <Switch
                checked={preferences.reminderNotifications}
                onCheckedChange={(checked) => updatePreference('reminderNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza la apariencia de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select value={preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
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
        </CardContent>
      </Card>

      {/* Privacidad y Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacidad y Datos
          </CardTitle>
          <CardDescription>
            Controla tu información personal y privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Análisis de Uso</Label>
                <p className="text-sm text-muted-foreground">
                  Ayudar a mejorar la aplicación con datos anónimos
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) => updatePreference('analytics', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Gestión de Datos</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={handleDataExport} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Datos
                </Button>
                <Button variant="destructive" onClick={handleDataDeletion}>
                  Eliminar Todos los Datos
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                La eliminación de datos es irreversible y eliminará toda tu información.
              </p>
            </div>
          </div>
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
