import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grid3X3, Search, Film, Palette, Megaphone, Ghost, Camera, Wand2, Rocket } from 'lucide-react';
import { CodeBlock } from '@/components/common/CodeBlock';
import { Template } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const templates: Template[] = [
  {
    id: '1',
    name: 'Sinematik Dramatis',
    category: 'cinematic',
    description: 'Gaya film Hollywood dengan pencahayaan sinematik',
    prompt: 'Cinematic dramatic scene, professional film lighting, anamorphic lens flare, shallow depth of field, movie color grading, 35mm film grain, epic composition, golden hour lighting, volumetric fog, studio quality --ar 21:9 --v 6 --style raw',
    thumbnail: '',
  },
  {
    id: '2',
    name: 'Anime Jepang',
    category: 'anime',
    description: 'Gaya anime Jepang modern dengan detail tinggi',
    prompt: 'Anime style, Studio Ghibli inspired, vibrant colors, detailed background, cel shading, soft lighting, dreamy atmosphere, intricate details, masterpiece quality, trending on ArtStation --ar 16:9 --niji 6',
    thumbnail: '',
  },
  {
    id: '3',
    name: 'Iklan Produk',
    category: 'advertisement',
    description: 'Fotografi produk profesional untuk iklan',
    prompt: 'Professional product photography, studio lighting, pristine white background, commercial advertising quality, high-end magazine style, sharp focus, minimal shadows, luxury aesthetic, brand photography --ar 4:5 --v 6 --style raw',
    thumbnail: '',
  },
  {
    id: '4',
    name: 'Horor Atmosferik',
    category: 'horror',
    description: 'Suasana horor dengan pencahayaan gelap',
    prompt: 'Dark atmospheric horror scene, eerie lighting, fog and mist, abandoned location, unsettling mood, horror movie aesthetic, deep shadows, cool blue tones, cinematic fear, psychological horror --ar 16:9 --v 6',
    thumbnail: '',
  },
  {
    id: '5',
    name: 'Dokumenter',
    category: 'documentary',
    description: 'Gaya dokumenter natural dan autentik',
    prompt: 'Documentary style photography, natural lighting, candid moment, authentic emotion, photojournalism aesthetic, raw and real, environmental portrait, storytelling composition, National Geographic quality --ar 3:2 --v 6 --style raw',
    thumbnail: '',
  },
  {
    id: '6',
    name: 'Fantasi Epik',
    category: 'fantasy',
    description: 'Dunia fantasi dengan elemen magis',
    prompt: 'Epic fantasy scene, magical atmosphere, mystical lighting, enchanted forest, ethereal glow, fantasy art, detailed environment, otherworldly beauty, concept art quality, digital painting masterpiece --ar 16:9 --v 6',
    thumbnail: '',
  },
  {
    id: '7',
    name: 'Sci-Fi Futuristik',
    category: 'scifi',
    description: 'Dunia masa depan dengan teknologi canggih',
    prompt: 'Futuristic sci-fi scene, advanced technology, neon lights, cyberpunk aesthetic, holographic displays, sleek architecture, chrome and glass, dystopian atmosphere, Blade Runner inspired --ar 21:9 --v 6',
    thumbnail: '',
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  cinematic: Film,
  anime: Palette,
  advertisement: Megaphone,
  horror: Ghost,
  documentary: Camera,
  fantasy: Wand2,
  scifi: Rocket,
};

const categoryLabels: Record<string, string> = {
  cinematic: 'Sinematik',
  anime: 'Anime',
  advertisement: 'Iklan',
  horror: 'Horor',
  documentary: 'Dokumenter',
  fantasy: 'Fantasi',
  scifi: 'Sci-Fi',
};

export default function TemplatePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = templates.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || t.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Grid3X3 className="h-6 w-6 text-primary" />
          Eksplor Template
        </h1>
        <p className="text-muted-foreground mt-1">
          Template prompt siap pakai untuk berbagai kebutuhan
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            variant="glass"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Semua
          </Button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                <Icon className="h-4 w-4" />
                {categoryLabels[cat]}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = categoryIcons[template.category];
          return (
            <Card
              key={template.id}
              variant="glass"
              className="cursor-pointer hover-lift group"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                    {categoryLabels[template.category]}
                  </span>
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{template.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Template Detail Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        {selectedTemplate && (
          <DialogContent className="sm:max-w-2xl glass-strong">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>{selectedTemplate.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CodeBlock content={selectedTemplate.prompt} label="Template Prompt" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Tutup
              </Button>
              <Button variant="gradient">
                Gunakan Template
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
