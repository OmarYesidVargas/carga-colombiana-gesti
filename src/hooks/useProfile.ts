
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<ProfileData, 'id' | 'email' | 'created_at' | 'updated_at'>>) => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data);
      toast.success('Perfil actualizado correctamente');
      return data;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message);
      toast.error('Error al actualizar el perfil');
      throw err;
    }
  };

  const updateAvatar = async (avatarUrl: string | null) => {
    try {
      await updateProfile({ avatar_url: avatarUrl });
    } catch (err) {
      console.error('Error updating avatar:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
  };
};
