
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, User } from 'lucide-react';
import { toast } from 'sonner';
import AvatarUpload from '@/components/profile/AvatarUpload';

interface ProfileData {
  name: string;
  phone: string;
  city: string;
  department: string;
  avatar_url: string | null;
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    phone: '',
    city: '',
    department: '',
    avatar_url: null
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('name, phone, city, department, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfileData({
          name: data.name || '',
          phone: data.phone || '',
          city: data.city || '',
          department: data.department || '',
          avatar_url: data.avatar_url || null
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          city: profileData.city,
          department: profileData.department
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    setProfileData(prev => ({
      ...prev,
      avatar_url: newAvatarUrl
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuración del Perfil</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foto de perfil */}
        <div className="md:col-span-1">
          <AvatarUpload
            currentAvatarUrl={profileData.avatar_url}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </div>

        {/* Información personal */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El correo no se puede modificar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Número de teléfono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Departamento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Ciudad"
                />
              </div>

              <Button
                onClick={saveProfile}
                disabled={saving}
                className="w-full"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
