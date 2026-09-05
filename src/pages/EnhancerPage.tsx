import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CodeBlock } from '@/components/common/CodeBlock';
import { CopyButton } from '@/components/common/CopyButton';
import { Sparkles, Wand2, Loader2, ArrowRight, FileJson, FileText } from 'lucide-react';
import { generatePrompt } from '@/lib/generatePrompt';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { toast } from 'sonner';

export default function EnhancerPage() {
  const [input, setInput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    json: any;
  } | null>(null);
  const [outputView, setOutputView] = useState<'text' | 'json'>('text');
  
  const { addToHistory } = usePromptHistory();

  const handleEnhance = async () => {
    if (!input.trim()) return;
    
    setIsEnhancing(true);
    setResult(null);
    
    try {
      const response = await generatePrompt({
        type: 'enhance',
        simplePrompt: input,
        outputFormat: 'both',
      });

      if (!response.success) {
        throw new Error(response.error || 'Gagal menyempurnakan prompt');
      }

      setResult({
        text: response.prompt_text || '',
        json: response.prompt_json,
      });

      // Save to history
      await addToHistory({
        title: `Penyempurna: ${input.slice(0, 40)}...`,
        type: 'gambar',
        text_content: response.prompt_text,
        json_content: response.prompt_json,
      });

      toast.success('Prompt berhasil disempurnakan!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Penyempurna Prompt
        </h1>
        <p className="text-muted-foreground mt-1">
          Ubah prompt sederhana menjadi prompt profesional berkualitas tinggi
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-base">Prompt Asli</CardTitle>
            <CardDescription>
              Masukkan prompt sederhana yang ingin disempurnakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Contoh: wanita di taman dengan bunga..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] bg-muted/30"
            />
            <Button
              variant="gradient"
              className="w-full"
              onClick={handleEnhance}
              disabled={!input.trim() || isEnhancing}
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyempurnakan...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Sempurnakan Prompt
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card variant="glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Prompt Profesional
                </CardTitle>
                <CardDescription>
                  Hasil prompt yang telah disempurnakan AI
                </CardDescription>
              </div>
              {result && (
                <div className="flex gap-1">
                  <Button
                    variant={outputView === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOutputView('text')}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={outputView === 'json' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOutputView('json')}
                  >
                    <FileJson className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {outputView === 'text' ? (
                  <CodeBlock content={result.text} />
                ) : (
                  <CodeBlock content={JSON.stringify(result.json, null, 2)} />
                )}
                <div className="flex gap-2">
                  <CopyButton text={result.text} label="Salin Teks" />
                  <CopyButton text={JSON.stringify(result.json, null, 2)} label="Salin JSON" />
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-center p-6 rounded-xl bg-muted/20 border border-dashed border-border">
                <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Masukkan prompt dan klik "Sempurnakan" untuk melihat hasilnya
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
