
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  document_type: string | null;
  document_number: string | null;
  city: string | null;
  department: string | null;
  birth_date: string | null;
  gender: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Hook optimizado para gestión de perfiles de usuario
 * Incluye cache, optimistic updates y manejo de errores robusto
 */
export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache del perfil para evitar re-fetches innecesarios
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    try {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Verificar cache si no es forzado
      const now = Date.now();
      if (!forceRefresh && profile && (now - lastFetchTime) < CACHE_DURATION) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      console.log('🔄 [useProfile] Fetching profile for user:', user.id);
      const startTime = performance.now();

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const duration = performance.now() - startTime;
      console.log(`✅ [useProfile] Profile fetched in ${duration.toFixed(2)}ms`);

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
      setLastFetchTime(now);
    } catch (err: any) {
      console.error('❌ [useProfile] Error fetching profile:', err);
      setError(err.message);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, [user, profile, lastFetchTime]);

  const updateProfile = useCallback(async (updates: Partial<Omit<ProfileData, 'id' | 'email' | 'created_at' | 'updated_at'>>) => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      console.log('🔄 [useProfile] Updating profile with:', updates);
      const startTime = performance.now();

      // Optimistic update
      if (profile) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        // Revertir optimistic update en caso de error
        if (profile) {
          setProfile(profile);
        }
        throw updateError;
      }

      const duration = performance.now() - startTime;
      console.log(`✅ [useProfile] Profile updated in ${duration.toFixed(2)}ms`);

      setProfile(data);
      setLastFetchTime(Date.now());
      toast.success('Perfil actualizado correctamente');
      return data;
    } catch (err: any) {
      console.error('❌ [useProfile] Error updating profile:', err);
      setError(err.message);
      toast.error('Error al actualizar el perfil');
      throw err;
    }
  }, [user, profile]);

  const updateAvatar = useCallback(async (avatarUrl: string | null) => {
    try {
      await updateProfile({ avatar_url: avatarUrl });
    } catch (err) {
      console.error('❌ [useProfile] Error updating avatar:', err);
      throw err;
    }
  }, [updateProfile]);

  // Effect para cargar el perfil cuando cambie el usuario
  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
    refetch: () => fetchProfile(true)
  };
};
