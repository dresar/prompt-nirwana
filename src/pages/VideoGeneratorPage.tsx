import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UploadArea } from '@/components/common/UploadArea';
import { CodeBlock } from '@/components/common/CodeBlock';
import { Stepper } from '@/components/common/Stepper';
import { CopyButton } from '@/components/common/CopyButton';
import { Video, Wand2, ArrowRight, ArrowLeft, Loader2, Camera, Film, Sparkles, FileJson, FileText } from 'lucide-react';
import { generatePrompt, fileToBase64 } from '@/lib/generatePrompt';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { toast } from 'sonner';

const steps = [
  { id: 'reference', title: 'Referensi', description: 'Unggah gambar' },
  { id: 'scene', title: 'Adegan', description: 'Jelaskan adegan' },
  { id: 'camera', title: 'Kamera', description: 'Gerakan kamera' },
  { id: 'result', title: 'Hasil', description: 'Prompt final' },
];

const cameraMovements = [
  'Tracking shot maju',
  'Tracking shot mundur',
  'Drone shot naik',
  'Pan kiri ke kanan',
  'Pan kanan ke kiri',
  'Orbit 360°',
  'Zoom in perlahan',
  'Zoom out dramatis',
  'Handheld dinamis',
  'Steadicam mengikuti subjek',
];

export default function VideoGeneratorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [sceneDescription, setSceneDescription] = useState('');
  const [cameraMovement, setCameraMovement] = useState('');
  const [duration, setDuration] = useState('5');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await generatePrompt({
        type: 'video',
        imageBase64: image,
        sceneDescription,
        cameraMovement,
        duration,
        outputFormat: 'both',
      });

      if (!response.success) {
        throw new Error(response.error || 'Gagal membuat prompt');
      }

      setResult({
        text: response.prompt_text || '',
        json: response.prompt_json,
      });

      // Save to history
      await addToHistory({
        title: `Video: ${sceneDescription.slice(0, 50)}...`,
        type: 'video',
        text_content: response.prompt_text,
        json_content: response.prompt_json,
      });

      setCurrentStep(3);
      toast.success('Prompt video berhasil dibuat!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!image;
      case 1:
        return !!sceneDescription;
      case 2:
        return !!cameraMovement;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      handleGenerate();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setImage(null);
    setSceneDescription('');
    setCameraMovement('');
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Video className="h-6 w-6 text-secondary" />
          Generator Prompt Video
        </h1>
        <p className="text-muted-foreground mt-1">
          Buat prompt video sinematik dengan panduan langkah demi langkah
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Content */}
      <Card variant="glass">
        <CardContent className="p-6">
          {/* Step 0: Reference Image */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-6">
                <Film className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Gambar Referensi</h3>
                <p className="text-muted-foreground">
                  Unggah gambar sebagai referensi visual untuk video
                </p>
              </div>
              <UploadArea
                onFileSelect={handleFileSelect}
                preview={image}
                onClear={() => setImage(null)}
                className="max-w-md mx-auto h-64"
              />
            </div>
          )}

          {/* Step 1: Scene Description */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-6">
                <Sparkles className="h-12 w-12 text-secondary mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Deskripsi Adegan</h3>
                <p className="text-muted-foreground">
                  Jelaskan adegan yang ingin ditampilkan dalam video
                </p>
              </div>
              <Textarea
                placeholder="Contoh: Seorang samurai berdiri di tengah hujan, di depan kuil Jepang kuno dengan lampu lentera yang menyala redup..."
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                className="min-h-[200px] max-w-2xl mx-auto bg-muted/30"
              />
            </div>
          )}

          {/* Step 2: Camera Movement */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-6">
                <Camera className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Gerakan Kamera</h3>
                <p className="text-muted-foreground">
                  Pilih atau ketik gerakan kamera yang diinginkan
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {cameraMovements.map((movement) => (
                    <Button
                      key={movement}
                      variant={cameraMovement === movement ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCameraMovement(movement)}
                    >
                      {movement}
                    </Button>
                  ))}
                </div>
                
                <Input
                  placeholder="Atau ketik gerakan kamera kustom..."
                  value={cameraMovement}
                  onChange={(e) => setCameraMovement(e.target.value)}
                  variant="glass"
                />

                <div className="flex items-center gap-4">
                  <label className="text-sm text-muted-foreground">Durasi:</label>
                  <div className="flex gap-2">
                    {['3', '5', '10', '15'].map((d) => (
                      <Button
                        key={d}
                        variant={duration === d ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDuration(d)}
                      >
                        {d}s
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {currentStep === 3 && result && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-6">
                <Wand2 className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Prompt Video Siap!</h3>
                <p className="text-muted-foreground">
                  Prompt sinematik Anda telah dibuat
                </p>
              </div>
              
              <div className="flex justify-center gap-2 mb-4">
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
              
              {outputView === 'text' ? (
                <CodeBlock content={result.text} label="Prompt Video Sinematik" />
              ) : (
                <CodeBlock content={JSON.stringify(result.json, null, 2)} label="Prompt JSON" />
              )}
              
              <div className="flex justify-center gap-2">
                <CopyButton text={result.text} label="Salin Teks" />
                <CopyButton text={JSON.stringify(result.json, null, 2)} label="Salin JSON" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        
        {currentStep < 3 && (
          <Button
            variant="gradient"
            onClick={handleNext}
            disabled={!canProceed() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Membuat Prompt...
              </>
            ) : currentStep === 2 ? (
              <>
                <Wand2 className="h-4 w-4" />
                Buat Prompt
              </>
            ) : (
              <>
                Lanjutkan
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
        
        {currentStep === 3 && (
          <Button variant="outline" onClick={handleReset}>
            Buat Prompt Baru
          </Button>
        )}
      </div>
    </div>
  );
}
