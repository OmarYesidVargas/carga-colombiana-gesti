
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useProfile, ProfileData } from '@/hooks/useProfile';
import { useDebugLogger } from '@/hooks/useDebugLogger';
import { AvatarUpload } from './AvatarUpload';
import { ProfileFormFields } from './ProfileFormFields';
import { ProfileLocationFields } from './ProfileLocationFields';

/**
 * Componente de formulario de perfil refactorizado y optimizado
 * Incluye debugging avanzado y mejor estructura
 */
export const ProfileForm = () => {
  const { profile, updateProfile } = useProfile();
  const { log, logAction, logError } = useDebugLogger({ component: 'ProfileForm' });
  
  const form = useForm<Partial<ProfileData>>({
    defaultValues: {
      name: profile?.name || '',
      phone: profile?.phone || '',
      document_type: profile?.document_type || '',
      document_number: profile?.document_number || '',
      city: profile?.city || '',
      department: profile?.department || '',
      birth_date: profile?.birth_date || '',
      gender: profile?.gender || ''
    }
  });

  React.useEffect(() => {
    if (profile) {
      log('Profile data loaded, updating form defaults', profile);
      form.reset({
        name: profile.name || '',
        phone: profile.phone || '',
        document_type: profile.document_type || '',
        document_number: profile.document_number || '',
        city: profile.city || '',
        department: profile.department || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || ''
      });
    }
  }, [profile, form, log]);

  const onSubmit = async (data: Partial<ProfileData>) => {
    try {
      logAction('Submitting profile form', data);
      const startTime = performance.now();
      
      await updateProfile(data);
      
      log('Profile updated successfully');
      logAction('Profile form submitted successfully', { duration: performance.now() - startTime });
    } catch (error) {
      logError(error as Error, { formData: data });
    }
  };

  if (!profile) {
    log('No profile data available, showing loading state');
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando información del perfil...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </CardTitle>
        <CardDescription>
          Actualiza tu información personal y de contacto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <AvatarUpload />
          </div>

          {/* Campos básicos del perfil */}
          <ProfileFormFields form={form} />

          {/* Campos de ubicación */}
          <ProfileLocationFields form={form} />

          {/* Botón de guardar */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              size="lg"
            >
              {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
