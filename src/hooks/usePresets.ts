import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type LocationPreset = Database['public']['Tables']['location_presets']['Row'];
type StylePreset = Database['public']['Tables']['style_presets']['Row'];
type PropsPreset = Database['public']['Tables']['props_presets']['Row'];

export function usePresets() {
  const [locations, setLocations] = useState<LocationPreset[]>([]);
  const [styles, setStyles] = useState<StylePreset[]>([]);
  const [props, setProps] = useState<PropsPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPresets = useCallback(async () => {
    try {
      const [locationsRes, stylesRes, propsRes] = await Promise.all([
        supabase.from('location_presets').select('*').order('name'),
        supabase.from('style_presets').select('*').order('name'),
        supabase.from('props_presets').select('*').order('name'),
      ]);

      if (locationsRes.error) throw locationsRes.error;
      if (stylesRes.error) throw stylesRes.error;
      if (propsRes.error) throw propsRes.error;

      setLocations(locationsRes.data || []);
      setStyles(stylesRes.data || []);
      setProps(propsRes.data || []);
    } catch (error) {
      console.error('Error fetching presets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return {
    locations,
    styles,
    props,
    isLoading,
    refetch: fetchPresets,
  };
}
