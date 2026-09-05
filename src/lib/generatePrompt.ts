import { supabase } from '@/integrations/supabase/client';

interface GeneratePromptOptions {
  type: 'image' | 'video' | 'character' | 'enhance' | 'negative';
  imageBase64?: string | null;
  instruction?: string;
  sceneDescription?: string;
  cameraMovement?: string;
  duration?: string;
  characterData?: {
    name: string;
    age: string;
    gender: string;
    faceFeatures: string;
    clothing: string;
    style: string;
    mood: string;
  };
  simplePrompt?: string;
  outputFormat?: 'text' | 'json' | 'both';
}

interface GeneratePromptResult {
  success: boolean;
  prompt_text?: string;
  prompt_json?: {
    type: string;
    model: string;
    input_gambar: string | null;
    atribut_karakter: any;
    instruksi_user: string;
    prompt_text: string;
    prompt_json_structure: {
      subject: string;
      environment: string;
      lighting: string;
      style: string;
      technical: string;
      parameters: Record<string, string>;
    };
    metadata: {
      generated_at: string;
      generator_type: string;
      ai_model: string;
    };
  };
  error?: string;
}

export async function generatePrompt(options: GeneratePromptOptions): Promise<GeneratePromptResult> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-prompt', {
      body: {
        ...options,
        outputFormat: options.outputFormat || 'both',
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error generating prompt:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan',
    };
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
