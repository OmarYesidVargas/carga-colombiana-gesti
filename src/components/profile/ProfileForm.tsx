
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useProfile, ProfileData } from '@/hooks/useProfile';
import { useDebugLogger } from '@/hooks/useDebugLogger';
import AvatarUpload from './AvatarUpload';
import { ProfileFormFields } from './ProfileFormFields';
import { ProfileLocationFields } from './ProfileLocationFields';
import OptimizedLoadingSpinner from '@/components/common/OptimizedLoadingSpinner';

/**
 * Componente de formulario de perfil optimizado y finalizado
 * Versión final con todas las mejoras de UX y rendimiento
 */
export const ProfileForm = () => {
  const { profile, updateProfile, loading } = useProfile();
  const { log, logAction, logError } = useDebugLogger({ component: 'ProfileForm' });
  
  const form = useForm<Partial<ProfileData>>({
    defaultValues: {
      name: '',
      phone: '',
      document_type: 'cedula',
      document_number: '',
      city: '',
      department: '',
      birth_date: '',
      gender: ''
    }
  });

  React.useEffect(() => {
    if (profile) {
      log('Profile data loaded, updating form defaults', profile);
      form.reset({
        name: profile.name || '',
        phone: profile.phone || '',
        document_type: profile.document_type || 'cedula',
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
      
      const duration = performance.now() - startTime;
      log(`Profile updated successfully in ${duration.toFixed(2)}ms`);
      logAction('Profile form submitted successfully', { duration });
    } catch (error) {
      logError(error as Error, { formData: data });
    }
  };

  if (loading) {
    log('Profile loading, showing spinner');
    return (
      <Card>
        <CardContent>
          <OptimizedLoadingSpinner 
            size="lg" 
            text="Cargando información del perfil..." 
          />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    log('No profile data available');
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <User className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-medium text-lg">Sin información de perfil</h3>
              <p className="text-muted-foreground">
                Complete su información personal para comenzar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
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
          <div className="flex justify-end pt-4 border-t">
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              size="lg"
              className="min-w-[140px]"
            >
              {form.formState.isSubmitting ? (
                <>
                  <OptimizedLoadingSpinner size="sm" className="mr-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
