
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesRegionalSettingsProps {
  preferences: any;
  updatePreference: (key: string, value: any) => void;
}

/**
 * Componente refactorizado para configuraciones regionales
 * Separado del componente principal para mejor mantenibilidad
 */
export const PreferencesRegionalSettings = ({ 
  preferences, 
  updatePreference 
}: PreferencesRegionalSettingsProps) => {
  return (
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
  );
};
