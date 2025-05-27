
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileData } from '@/hooks/useProfile';

interface ProfileFormFieldsProps {
  form: UseFormReturn<Partial<ProfileData>>;
}

/**
 * Componente refactorizado para campos básicos del perfil
 * Separado para mejor mantenibilidad y reutilización
 */
export const ProfileFormFields = ({ form }: ProfileFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Nombre completo */}
      <div className="md:col-span-2">
        <Label htmlFor="name">Nombre completo *</Label>
        <Input
          id="name"
          {...form.register('name', { required: 'El nombre es requerido' })}
          placeholder="Ingresa tu nombre completo"
        />
        {form.formState.errors.name && (
          <span className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </span>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          {...form.register('phone')}
          placeholder="+57 300 123 4567"
        />
      </div>

      {/* Tipo de documento */}
      <div>
        <Label htmlFor="document_type">Tipo de documento</Label>
        <Select 
          value={form.watch('document_type') || ''} 
          onValueChange={(value) => form.setValue('document_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cedula">Cédula de Ciudadanía</SelectItem>
            <SelectItem value="tarjeta_identidad">Tarjeta de Identidad</SelectItem>
            <SelectItem value="cedula_extranjeria">Cédula de Extranjería</SelectItem>
            <SelectItem value="pasaporte">Pasaporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Número de documento */}
      <div>
        <Label htmlFor="document_number">Número de documento</Label>
        <Input
          id="document_number"
          {...form.register('document_number')}
          placeholder="123456789"
        />
      </div>

      {/* Género */}
      <div>
        <Label htmlFor="gender">Género</Label>
        <Select 
          value={form.watch('gender') || ''} 
          onValueChange={(value) => form.setValue('gender', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar género" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="femenino">Femenino</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
            <SelectItem value="prefiero_no_decir">Prefiero no decir</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
