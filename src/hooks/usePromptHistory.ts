import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type PromptHistory = Database['public']['Tables']['prompt_history']['Row'];
type PromptHistoryInsert = Database['public']['Tables']['prompt_history']['Insert'];

export function usePromptHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();

    // Set up realtime subscription
    const channel = supabase
      .channel('prompt_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prompt_history',
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHistory]);

  const addToHistory = async (data: Omit<PromptHistoryInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const { data: newEntry, error } = await supabase
        .from('prompt_history')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Prompt disimpan ke riwayat');
      return newEntry;
    } catch (error) {
      console.error('Error adding to history:', error);
      toast.error('Gagal menyimpan ke riwayat');
      return null;
    }
  };

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('prompt_history')
        .update({ is_favorite: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentStatus ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Gagal mengubah status favorit');
    }
  };

  const deleteFromHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompt_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Riwayat berhasil dihapus');
    } catch (error) {
      console.error('Error deleting from history:', error);
      toast.error('Gagal menghapus riwayat');
    }
  };

  return {
    history,
    isLoading,
    addToHistory,
    toggleFavorite,
    deleteFromHistory,
    refetch: fetchHistory,
  };
}
