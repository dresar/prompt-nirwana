import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type ApiKey = Database['public']['Tables']['api_keys']['Row'];
type ApiKeyInsert = Database['public']['Tables']['api_keys']['Insert'];
type ApiProvider = Database['public']['Enums']['api_provider'];

export function useApiKeys() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiKeys = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApiKeys();

    // Set up realtime subscription
    const channel = supabase
      .channel('api_keys_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'api_keys',
        },
        () => {
          fetchApiKeys();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchApiKeys]);

  const addApiKey = async (data: {
    provider: ApiProvider;
    key_name: string;
    key_value: string;
  }) => {
    if (!user) return null;

    try {
      const maxPriority = apiKeys.reduce((max, key) => Math.max(max, key.priority || 0), 0);
      
      const { data: newKey, error } = await supabase
        .from('api_keys')
        .insert({
          ...data,
          user_id: user.id,
          priority: maxPriority + 1,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('API Key berhasil ditambahkan');
      return newKey;
    } catch (error) {
      console.error('Error adding API key:', error);
      toast.error('Gagal menambahkan API Key');
      return null;
    }
  };

  const updateApiKey = async (id: string, data: Partial<ApiKeyInsert>) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ ...data, last_used: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating API key:', error);
      toast.error('Gagal memperbarui API Key');
    }
  };

  const toggleApiKey = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_enabled: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentStatus ? 'API Key dinonaktifkan' : 'API Key diaktifkan');
    } catch (error) {
      console.error('Error toggling API key:', error);
      toast.error('Gagal mengubah status API Key');
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('API Key berhasil dihapus');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Gagal menghapus API Key');
    }
  };

  const updatePriorities = async (orderedIds: string[]) => {
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        priority: index + 1,
      }));

      for (const update of updates) {
        await supabase
          .from('api_keys')
          .update({ priority: update.priority })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating priorities:', error);
      toast.error('Gagal mengubah urutan prioritas');
    }
  };

  const getActiveKey = useCallback((provider?: ApiProvider) => {
    return apiKeys.find(key => 
      key.is_enabled && 
      key.status === 'active' && 
      (!provider || key.provider === provider)
    );
  }, [apiKeys]);

  const importKeys = async (keysData: Array<{
    provider: ApiProvider;
    key_name: string;
    key_value: string;
  }>) => {
    if (!user) return;

    try {
      for (const keyData of keysData) {
        await addApiKey(keyData);
      }
      toast.success(`${keysData.length} API Key berhasil diimpor`);
    } catch (error) {
      console.error('Error importing keys:', error);
      toast.error('Gagal mengimpor API Keys');
    }
  };

  const exportKeys = () => {
    const exportData = apiKeys.map(key => ({
      provider: key.provider,
      key_name: key.key_name,
      key_value: key.key_value,
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-keys-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('API Keys berhasil diekspor');
  };

  return {
    apiKeys,
    isLoading,
    addApiKey,
    updateApiKey,
    toggleApiKey,
    deleteApiKey,
    updatePriorities,
    getActiveKey,
    importKeys,
    exportKeys,
    refetch: fetchApiKeys,
  };
}
