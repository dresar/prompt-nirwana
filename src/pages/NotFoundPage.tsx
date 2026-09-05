import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Bot, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md animate-fade-in">
        <div className="relative mx-auto mb-8 w-40 h-40">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-pulse" />
          <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center border border-border">
            <Bot className="h-16 w-16 text-primary animate-float" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-8">
          Maaf, AI kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman telah dipindahkan atau tidak tersedia.
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <Button variant="gradient" onClick={() => navigate('/')}>
            <Home className="h-4 w-4" />
            Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
