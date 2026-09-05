-- Create enum types
CREATE TYPE public.prompt_type AS ENUM ('gambar', 'video');
CREATE TYPE public.characteristic_type AS ENUM ('foto', 'video');
CREATE TYPE public.api_provider AS ENUM ('groq', 'gemini');
CREATE TYPE public.api_key_status AS ENUM ('active', 'inactive', 'limit', 'error');
CREATE TYPE public.template_category AS ENUM ('cinematic', 'anime', 'advertisement', 'horror', 'documentary', 'fantasy', 'scifi', 'prewedding', 'portrait', 'landscape');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create prompt_history table
CREATE TABLE public.prompt_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type public.prompt_type NOT NULL DEFAULT 'gambar',
  json_content JSONB,
  text_content TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create prompt_templates table
CREATE TABLE public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category public.template_category NOT NULL,
  description TEXT,
  json_content JSONB,
  text_content TEXT,
  preview_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create characteristics table
CREATE TABLE public.characteristics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.characteristic_type NOT NULL,
  attribute_name TEXT NOT NULL,
  attribute_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create photo_studio_settings table
CREATE TABLE public.photo_studio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  set_name TEXT NOT NULL,
  attributes JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create api_keys table (with encrypted key_value)
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider public.api_provider NOT NULL,
  key_name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  status public.api_key_status DEFAULT 'active',
  remaining_limit INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 1,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used TIMESTAMPTZ
);

-- Create location_presets table (public read)
CREATE TABLE public.location_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  attributes JSONB DEFAULT '{}'
);

-- Create style_presets table (public read)
CREATE TABLE public.style_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  attributes JSONB DEFAULT '{}'
);

-- Create props_presets table (public read)
CREATE TABLE public.props_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Create prewedding_presets table
CREATE TABLE public.prewedding_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location_id UUID REFERENCES public.location_presets(id),
  style_id UUID REFERENCES public.style_presets(id),
  props JSONB DEFAULT '[]',
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create characters table (DNA Karakter feature)
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age TEXT,
  gender TEXT,
  face_features TEXT,
  clothing TEXT,
  style TEXT,
  mood TEXT,
  additional_attributes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characteristics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_studio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.props_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prewedding_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Prompt History RLS Policies
CREATE POLICY "Users can view their own history" ON public.prompt_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON public.prompt_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own history" ON public.prompt_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own history" ON public.prompt_history FOR DELETE USING (auth.uid() = user_id);

-- Prompt Templates RLS Policies
CREATE POLICY "Users can view their own templates" ON public.prompt_templates FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert their own templates" ON public.prompt_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates" ON public.prompt_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates" ON public.prompt_templates FOR DELETE USING (auth.uid() = user_id);

-- Characteristics RLS Policies
CREATE POLICY "Users can view their own characteristics" ON public.characteristics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own characteristics" ON public.characteristics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own characteristics" ON public.characteristics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own characteristics" ON public.characteristics FOR DELETE USING (auth.uid() = user_id);

-- Photo Studio Settings RLS Policies
CREATE POLICY "Users can view their own settings" ON public.photo_studio_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.photo_studio_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.photo_studio_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own settings" ON public.photo_studio_settings FOR DELETE USING (auth.uid() = user_id);

-- API Keys RLS Policies
CREATE POLICY "Users can view their own api keys" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own api keys" ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own api keys" ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own api keys" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);

-- Preset tables (public read)
CREATE POLICY "Anyone can view location presets" ON public.location_presets FOR SELECT USING (true);
CREATE POLICY "Anyone can view style presets" ON public.style_presets FOR SELECT USING (true);
CREATE POLICY "Anyone can view props presets" ON public.props_presets FOR SELECT USING (true);

-- Prewedding Presets RLS Policies
CREATE POLICY "Users can view their own prewedding presets" ON public.prewedding_presets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own prewedding presets" ON public.prewedding_presets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own prewedding presets" ON public.prewedding_presets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own prewedding presets" ON public.prewedding_presets FOR DELETE USING (auth.uid() = user_id);

-- Characters RLS Policies
CREATE POLICY "Users can view their own characters" ON public.characters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own characters" ON public.characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own characters" ON public.characters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own characters" ON public.characters FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for profile auto-creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Pengguna Baru'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_prompt_history_user_id ON public.prompt_history(user_id);
CREATE INDEX idx_prompt_history_created_at ON public.prompt_history(created_at DESC);
CREATE INDEX idx_prompt_templates_user_id ON public.prompt_templates(user_id);
CREATE INDEX idx_prompt_templates_category ON public.prompt_templates(category);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_priority ON public.api_keys(priority);
CREATE INDEX idx_characteristics_user_id ON public.characteristics(user_id);
CREATE INDEX idx_characters_user_id ON public.characters(user_id);

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.prompt_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prompt_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_keys;
ALTER PUBLICATION supabase_realtime ADD TABLE public.characters;

-- Insert default preset data
INSERT INTO public.location_presets (name, description, attributes) VALUES
  ('Gunung', 'Pemandangan pegunungan dengan nuansa alam', '{"lighting": "natural", "mood": "serene", "keywords": ["mountain", "nature", "outdoor"]}'),
  ('Pantai', 'Suasana pantai dengan sunset/sunrise', '{"lighting": "golden hour", "mood": "romantic", "keywords": ["beach", "ocean", "sunset"]}'),
  ('Studio', 'Setting studio profesional dengan backdrop', '{"lighting": "studio", "mood": "professional", "keywords": ["studio", "indoor", "backdrop"]}'),
  ('Hutan', 'Hutan hijau dengan nuansa natural', '{"lighting": "diffused", "mood": "mystical", "keywords": ["forest", "green", "nature"]}'),
  ('Urban', 'Kota dengan arsitektur modern', '{"lighting": "mixed", "mood": "contemporary", "keywords": ["city", "urban", "modern"]}'),
  ('Vintage', 'Lokasi klasik dengan nuansa retro', '{"lighting": "warm", "mood": "nostalgic", "keywords": ["vintage", "retro", "classic"]}'),
  ('Taman', 'Taman bunga dengan warna cerah', '{"lighting": "soft", "mood": "cheerful", "keywords": ["garden", "flowers", "colorful"]}'),
  ('Cafe', 'Suasana cafe cozy dan intimate', '{"lighting": "ambient", "mood": "cozy", "keywords": ["cafe", "indoor", "intimate"]}');

INSERT INTO public.style_presets (name, description, attributes) VALUES
  ('Cinematic', 'Gaya sinematik dengan tone film', '{"color_grade": "cinema", "aspect_ratio": "21:9", "depth_of_field": "shallow"}'),
  ('Editorial', 'Gaya majalah fashion', '{"color_grade": "crisp", "lighting": "dramatic", "pose": "fashion"}'),
  ('Soft Light', 'Pencahayaan lembut dan romantic', '{"lighting": "soft", "color_grade": "pastel", "mood": "dreamy"}'),
  ('Dramatic', 'Kontras tinggi dengan shadow kuat', '{"lighting": "high contrast", "shadow": "deep", "mood": "intense"}'),
  ('Retro', 'Gaya vintage dengan grain film', '{"color_grade": "vintage", "grain": "medium", "saturation": "muted"}'),
  ('Minimalist', 'Clean dan simple dengan space negatif', '{"composition": "minimal", "background": "clean", "color": "muted"}'),
  ('Ethereal', 'Dreamy dengan nuansa fairy-tale', '{"lighting": "backlit", "mood": "ethereal", "color": "soft"}'),
  ('Moody', 'Dark dan mysterious', '{"lighting": "low key", "mood": "moody", "color_grade": "desaturated"}');

INSERT INTO public.props_presets (name, description) VALUES
  ('Payung', 'Payung transparan atau berwarna untuk efek romantis'),
  ('Bunga', 'Bouquet bunga segar atau dried flowers'),
  ('Gaun', 'Gaun pengantin atau formal dress'),
  ('Jas', 'Jas formal atau casual blazer'),
  ('Kacamata', 'Sunglasses atau kacamata fashion'),
  ('Topi', 'Berbagai jenis topi untuk aksen'),
  ('Selendang', 'Selendang atau scarf untuk flow'),
  ('Lilin', 'Lilin untuk efek romantis'),
  ('Kursi Vintage', 'Kursi klasik untuk pose duduk'),
  ('Cermin', 'Cermin untuk efek refleksi'),
  ('Buku', 'Buku vintage untuk nuansa intelektual'),
  ('Sepeda', 'Sepeda vintage untuk outdoor'),
  ('Balon', 'Balon warna-warni untuk kesan ceria'),
  ('Kain', 'Kain flowing untuk efek dramatis');