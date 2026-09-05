import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CodeBlock } from '@/components/common/CodeBlock';
import { CopyButton } from '@/components/common/CopyButton';
import { MinusCircle, Wand2, Loader2, X, FileJson, FileText } from 'lucide-react';
import { generatePrompt } from '@/lib/generatePrompt';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { toast } from 'sonner';

const commonNegatives = [
  'blur', 'blurry', 'low quality', 'low resolution',
  'watermark', 'text', 'logo', 'signature',
  'deformed', 'ugly', 'disfigured', 'mutation',
  'extra limbs', 'extra fingers', 'missing limbs',
  'bad anatomy', 'bad proportions', 'gross proportions',
  'cropped', 'out of frame', 'duplicate',
  'artifacts', 'noise', 'grainy', 'pixelated'
];

export default function NegativePromptPage() {
  const [positivePrompt, setPositivePrompt] = useState('');
  const [selectedNegatives, setSelectedNegatives] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    json: any;
  } | null>(null);
  const [outputView, setOutputView] = useState<'text' | 'json'>('text');
  
  const { addToHistory } = usePromptHistory();

  const toggleNegative = (neg: string) => {
    setSelectedNegatives((prev) =>
      prev.includes(neg) ? prev.filter((n) => n !== neg) : [...prev, neg]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const contextPrompt = positivePrompt 
        ? `Untuk prompt: "${positivePrompt}". Negative yang dipilih: ${selectedNegatives.join(', ')}`
        : selectedNegatives.length > 0 
          ? `Negative yang dipilih: ${selectedNegatives.join(', ')}`
          : undefined;

      const response = await generatePrompt({
        type: 'negative',
        simplePrompt: contextPrompt,
        outputFormat: 'both',
      });

      if (!response.success) {
        throw new Error(response.error || 'Gagal membuat negative prompt');
      }

      setResult({
        text: response.prompt_text || '',
        json: response.prompt_json,
      });

      // Save to history
      await addToHistory({
        title: 'Negative Prompt',
        type: 'gambar',
        text_content: response.prompt_text,
        json_content: response.prompt_json,
      });

      toast.success('Negative prompt berhasil dibuat!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MinusCircle className="h-6 w-6 text-destructive" />
          Generator Prompt Negatif
        </h1>
        <p className="text-muted-foreground mt-1">
          Buat negative prompt otomatis untuk meningkatkan kualitas hasil AI
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Prompt Positif (Opsional)</CardTitle>
              <CardDescription>
                Masukkan prompt utama untuk menghasilkan negative prompt yang relevan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Contoh: portrait of a beautiful woman in a garden..."
                value={positivePrompt}
                onChange={(e) => setPositivePrompt(e.target.value)}
                className="min-h-[100px] bg-muted/30"
              />
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Pilih Negative Umum</CardTitle>
              <CardDescription>
                Klik untuk menambahkan ke daftar negative prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {commonNegatives.map((neg) => (
                  <Button
                    key={neg}
                    variant={selectedNegatives.includes(neg) ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => toggleNegative(neg)}
                  >
                    {neg}
                    {selectedNegatives.includes(neg) && <X className="h-3 w-3 ml-1" />}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Membuat Prompt...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Buat Negative Prompt
              </>
            )}
          </Button>
        </div>

        {/* Output Section */}
        <Card variant="glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <MinusCircle className="h-4 w-4 text-destructive" />
                  Hasil Negative Prompt
                </CardTitle>
                <CardDescription>
                  Prompt negatif yang dihasilkan AI
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
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 rounded-xl bg-muted/20 border border-dashed border-border">
                <MinusCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Pilih negative prompt dan klik "Buat" untuk melihat hasilnya
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
