import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadArea } from '@/components/common/UploadArea';
import { CodeBlock } from '@/components/common/CodeBlock';
import { Sparkles, Wand2, RefreshCw, Loader2, FileJson, FileText } from 'lucide-react';
import { generatePrompt, fileToBase64 } from '@/lib/generatePrompt';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { toast } from 'sonner';
import { CopyButton } from '@/components/common/CopyButton';

export default function ImageGeneratorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    json: any;
  } | null>(null);
  const [outputView, setOutputView] = useState<'text' | 'json'>('text');
  
  const { addToHistory } = usePromptHistory();

  const handleFileSelect = async (file: File) => {
    const base64 = await fileToBase64(file);
    setImage(base64);
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error('Silakan unggah gambar terlebih dahulu');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await generatePrompt({
        type: 'image',
        imageBase64: image,
        instruction: instruction || undefined,
        outputFormat: 'both',
      });

      if (!response.success) {
        throw new Error(response.error || 'Gagal menganalisis gambar');
      }

      setResult({
        text: response.prompt_text || '',
        json: response.prompt_json,
      });

      // Save to history
      await addToHistory({
        title: instruction || 'Analisis Gambar',
        type: 'gambar',
        text_content: response.prompt_text,
        json_content: response.prompt_json,
      });

      toast.success('Prompt berhasil dibuat!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setInstruction('');
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Generator Prompt Gambar
        </h1>
        <p className="text-muted-foreground mt-1">
          Unggah gambar referensi dan biarkan AI menganalisis untuk membuat prompt profesional
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Upload Area */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Gambar Referensi</CardTitle>
              <CardDescription>
                Unggah gambar yang ingin Anda jadikan referensi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadArea
                onFileSelect={handleFileSelect}
                preview={image}
                onClear={() => setImage(null)}
                className="h-64"
              />
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Instruksi Tambahan</CardTitle>
              <CardDescription>
                Tambahkan detail atau gaya khusus yang Anda inginkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Contoh: Ubah menjadi gaya anime dengan suasana cyberpunk..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                className="min-h-[120px] bg-muted/30"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="gradient"
              size="lg"
              className="flex-1"
              onClick={handleAnalyze}
              disabled={!image || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Analisis AI
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={handleClear}>
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Output Section */}
        <Card variant="glow" className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Hasil Prompt
                </CardTitle>
                <CardDescription>
                  Prompt yang dihasilkan AI siap untuk digunakan
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
                    Teks
                  </Button>
                  <Button
                    variant={outputView === 'json' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOutputView('json')}
                  >
                    <FileJson className="h-4 w-4" />
                    JSON
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {outputView === 'text' ? (
                  <CodeBlock content={result.text} label="Prompt Gambar" />
                ) : (
                  <CodeBlock 
                    content={JSON.stringify(result.json, null, 2)} 
                    label="Prompt JSON" 
                  />
                )}
                
                {/* Copy buttons */}
                <div className="flex gap-2">
                  <CopyButton text={result.text} label="Salin Teks" />
                  <CopyButton 
                    text={JSON.stringify(result.json, null, 2)} 
                    label="Salin JSON" 
                  />
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 rounded-xl bg-muted/20 border border-dashed border-border">
                <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Unggah gambar dan klik "Analisis AI" untuk menghasilkan prompt
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
