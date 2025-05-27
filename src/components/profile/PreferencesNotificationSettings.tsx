
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface PreferencesNotificationSettingsProps {
  preferences: any;
  updatePreference: (key: string, value: any) => void;
}

/**
 * Componente refactorizado para configuraciones de notificaciones
 * Separado para mejor organización del código
 */
export const PreferencesNotificationSettings = ({ 
  preferences, 
  updatePreference 
}: PreferencesNotificationSettingsProps) => {
  return (
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
  );
};
