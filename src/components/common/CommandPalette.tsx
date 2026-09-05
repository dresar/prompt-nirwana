import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Home,
  Image,
  Video,
  Users,
  Sparkles,
  MinusCircle,
  Layout,
  History,
  Heart,
  Grid3X3,
  Settings,
  FileText,
  Plus,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { icon: Home, label: 'Beranda', path: '/', description: 'Kembali ke halaman utama' },
  { icon: Image, label: 'Generator Prompt Gambar', path: '/generator-gambar', description: 'Buat prompt untuk gambar AI' },
  { icon: Video, label: 'Generator Prompt Video', path: '/generator-video', description: 'Buat prompt untuk video sinematik' },
  { icon: Users, label: 'Konsistensi Karakter', path: '/karakter', description: 'Kelola DNA karakter Anda' },
  { icon: Sparkles, label: 'Penyempurna Prompt', path: '/penyempurna', description: 'Tingkatkan kualitas prompt Anda' },
  { icon: MinusCircle, label: 'Generator Prompt Negatif', path: '/negatif', description: 'Buat negative prompt otomatis' },
  { icon: Layout, label: 'Studio Workflow', path: '/workflow', description: 'Atur alur kerja storyboard' },
  { icon: History, label: 'Riwayat', path: '/riwayat', description: 'Lihat prompt sebelumnya' },
  { icon: Heart, label: 'Favorit', path: '/favorit', description: 'Prompt yang Anda simpan' },
  { icon: Grid3X3, label: 'Eksplor Template', path: '/template', description: 'Template prompt siap pakai' },
  { icon: Settings, label: 'Pengaturan', path: '/pengaturan', description: 'Kelola akun dan API' },
];

const quickActions = [
  { icon: Plus, label: 'Prompt Gambar Baru', action: 'new-image', description: 'Mulai membuat prompt gambar' },
  { icon: Plus, label: 'Prompt Video Baru', action: 'new-video', description: 'Mulai membuat prompt video' },
  { icon: FileText, label: 'Template Sinematik', action: 'template-cinematic', description: 'Gunakan template sinematik' },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'new-image':
        navigate('/generator-gambar');
        break;
      case 'new-video':
        navigate('/generator-video');
        break;
      case 'template-cinematic':
        navigate('/template');
        break;
    }
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Ketik perintah atau cari..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
        
        <CommandGroup heading="Aksi Cepat">
          {quickActions.map((item) => (
            <CommandItem
              key={item.action}
              onSelect={() => handleAction(item.action)}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigasi">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => handleSelect(item.path)}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
