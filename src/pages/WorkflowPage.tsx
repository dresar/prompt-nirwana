import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout, Plus, Trash2, Image, Video, GripVertical, Wand2 } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { WorkflowStep } from '@/types';

export default function WorkflowPage() {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [stepCount, setStepCount] = useState(0);

  const addStep = (type: 'image' | 'video') => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type,
      description: '',
      order: stepCount,
    };
    setSteps([...steps, newStep]);
    setStepCount(stepCount + 1);
  };

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...updates } : step))
    );
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layout className="h-6 w-6 text-secondary" />
            Studio Workflow
          </h1>
          <p className="text-muted-foreground mt-1">
            Atur alur storyboard untuk konten yang konsisten
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => addStep('image')}>
            <Image className="h-4 w-4" />
            Gambar
          </Button>
          <Button variant="gradient" onClick={() => addStep('video')}>
            <Video className="h-4 w-4" />
            Video
          </Button>
        </div>
      </div>

      {/* Workflow Board */}
      {steps.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <Card key={step.id} variant="glass" className="group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="cursor-move text-muted-foreground hover:text-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {step.type === 'image' ? (
                        <Image className="h-8 w-8 text-primary" />
                      ) : (
                        <Video className="h-8 w-8 text-secondary" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                          Langkah {index + 1}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {step.type === 'image' ? 'Gambar' : 'Video'}
                        </span>
                      </div>
                      <Input
                        placeholder="Deskripsi adegan..."
                        value={step.description}
                        onChange={(e) => updateStep(step.id, { description: e.target.value })}
                        variant="glass"
                      />
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-sm">
                        <Wand2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeStep(step.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Add more steps */}
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={() => addStep('image')}>
              <Plus className="h-4 w-4" />
              Tambah Gambar
            </Button>
            <Button variant="outline" onClick={() => addStep('video')}>
              <Plus className="h-4 w-4" />
              Tambah Video
            </Button>
          </div>
        </div>
      ) : (
        <Card variant="glass">
          <CardContent>
            <EmptyState
              icon={Layout}
              title="Workflow Kosong"
              description="Mulai membuat storyboard dengan menambahkan langkah gambar atau video"
            >
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => addStep('image')}>
                  <Image className="h-4 w-4" />
                  Tambah Gambar
                </Button>
                <Button variant="gradient" onClick={() => addStep('video')}>
                  <Video className="h-4 w-4" />
                  Tambah Video
                </Button>
              </div>
            </EmptyState>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
