
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileData } from '@/hooks/useProfile';

interface ProfileLocationFieldsProps {
  form: UseFormReturn<Partial<ProfileData>>;
}

const DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];

/**
 * Componente refactorizado para campos de ubicación del perfil
 * Separado para mejor organización y mantenibilidad
 */
export const ProfileLocationFields = ({ form }: ProfileLocationFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Departamento */}
      <div>
        <Label htmlFor="department">Departamento</Label>
        <Select 
          value={form.watch('department') || ''} 
          onValueChange={(value) => form.setValue('department', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ciudad */}
      <div>
        <Label htmlFor="city">Ciudad</Label>
        <Input
          id="city"
          {...form.register('city')}
          placeholder="Bogotá, Medellín, Cali..."
        />
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <Label htmlFor="birth_date">Fecha de nacimiento</Label>
        <Input
          id="birth_date"
          type="date"
          {...form.register('birth_date')}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};
