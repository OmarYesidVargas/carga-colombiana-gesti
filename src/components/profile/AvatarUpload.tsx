
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate?: (newAvatarUrl: string | null) => void;
}

const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }

      if (!user) {
        toast.error('Usuario no autenticado');
        return;
      }

      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Eliminar avatar anterior si existe
      if (currentAvatarUrl) {
        await deleteCurrentAvatar();
      }

      // Subir nueva imagen
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Obtener URL pública
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = data.publicUrl;

      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate?.(avatarUrl);
      toast.success('Foto de perfil actualizada correctamente');

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteCurrentAvatar = async () => {
    if (!currentAvatarUrl || !user) return;

    try {
      // Extraer el nombre del archivo de la URL
      const fileName = `${user.id}/avatar.${currentAvatarUrl.split('.').pop()}`;
      
      await supabase.storage
        .from('avatars')
        .remove([fileName]);
    } catch (error) {
      console.error('Error deleting old avatar:', error);
    }
  };

  const deleteAvatar = async () => {
    try {
      setDeleting(true);

      if (!user || !currentAvatarUrl) {
        return;
      }

      await deleteCurrentAvatar();

      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate?.(null);
      toast.success('Foto de perfil eliminada');

    } catch (error: any) {
      console.error('Error deleting avatar:', error);
      toast.error('Error al eliminar la imagen: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
        <CardDescription>
          Personaliza tu perfil con una foto. Máximo 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vista previa del avatar */}
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentAvatarUrl} alt="Foto de perfil" />
            <AvatarFallback className="text-lg">
              {currentAvatarUrl ? <User /> : getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Input para subir archivo */}
        <div className="space-y-2">
          <Label htmlFor="avatar-upload">Subir nueva foto</Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Subiendo...' : 'Cambiar Foto'}
          </Button>

          {currentAvatarUrl && (
            <Button
              size="sm"
              variant="outline"
              disabled={deleting}
              onClick={deleteAvatar}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarUpload;
