import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Character = Database['public']['Tables']['characters']['Row'];
type CharacterInsert = Database['public']['Tables']['characters']['Insert'];

export function useCharacters() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCharacters = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCharacters();

    // Set up realtime subscription
    const channel = supabase
      .channel('characters_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'characters',
        },
        () => {
          fetchCharacters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCharacters]);

  const createCharacter = async (data: Omit<CharacterInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const { data: newChar, error } = await supabase
        .from('characters')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Karakter berhasil dibuat');
      return newChar;
    } catch (error) {
      console.error('Error creating character:', error);
      toast.error('Gagal membuat karakter');
      return null;
    }
  };

  const updateCharacter = async (id: string, data: Partial<CharacterInsert>) => {
    try {
      const { error } = await supabase
        .from('characters')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      toast.success('Karakter berhasil diperbarui');
    } catch (error) {
      console.error('Error updating character:', error);
      toast.error('Gagal memperbarui karakter');
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Karakter berhasil dihapus');
    } catch (error) {
      console.error('Error deleting character:', error);
      toast.error('Gagal menghapus karakter');
    }
  };

  return {
    characters,
    isLoading,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refetch: fetchCharacters,
  };
}
