import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Image, 
  Video, 
  Users, 
  Zap, 
  TrendingUp,
  Clock,
  ArrowRight,
  Lightbulb,
  Camera,
  Heart,
  MapPin,
  Palette,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { usePresets } from '@/hooks/usePresets';
import { useProfile } from '@/hooks/useProfile';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  {
    icon: Image,
    title: 'Prompt Gambar',
    description: 'Ubah gambar referensi menjadi prompt profesional dengan AI',
    path: '/generator-gambar',
    color: 'from-primary to-secondary',
  },
  {
    icon: Video,
    title: 'Prompt Video',
    description: 'Buat prompt video sinematik dengan alur yang terstruktur',
    path: '/generator-video',
    color: 'from-secondary to-accent',
  },
  {
    icon: Users,
    title: 'Konsistensi Karakter',
    description: 'Simpan DNA karakter untuk konsistensi di setiap konten',
    path: '/karakter',
    color: 'from-accent to-primary',
  },
  {
    icon: Sparkles,
    title: 'Penyempurna Prompt',
    description: 'Tingkatkan kualitas prompt sederhana menjadi profesional',
    path: '/penyempurna',
    color: 'from-primary to-success',
  },
];

const tips = [
  {
    title: 'Gunakan Kata Kunci Spesifik',
    description: 'Semakin detail deskripsi, semakin akurat hasil AI',
  },
  {
    title: 'Tentukan Gaya Visual',
    description: 'Sebutkan gaya seperti sinematik, anime, atau fotorealistik',
  },
  {
    title: 'Tambahkan Suasana',
    description: 'Jelaskan mood: dramatis, ceria, misterius, atau romantis',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { history, isLoading: historyLoading } = usePromptHistory();
  const { locations, styles, isLoading: presetsLoading } = usePresets();
  const { profile } = useProfile();

  const recentActivity = history.slice(0, 3);
  const favoriteCount = history.filter(h => h.is_favorite).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-muted to-card border border-border p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-primary">Platform AI Prompt</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Selamat Datang, <span className="gradient-text">{profile?.full_name || 'Kreator'}!</span>
          </h1>
          
          <p className="text-muted-foreground mb-6 text-lg">
            Generator prompt berbasis AI yang membantu Anda membuat prompt gambar dan video berkualitas tinggi dengan mudah.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="gradient" size="lg" onClick={() => navigate('/generator-gambar')}>
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="lg" onClick={() => navigate('/template')}>
              Jelajahi Template
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Prompt Dibuat', value: history.length.toString(), icon: Sparkles, loading: historyLoading },
          { label: 'Favorit Tersimpan', value: favoriteCount.toString(), icon: Heart, loading: historyLoading },
          { label: 'Lokasi Preset', value: locations.length.toString(), icon: MapPin, loading: presetsLoading },
          { label: 'Gaya Tersedia', value: styles.length.toString(), icon: Palette, loading: presetsLoading },
        ].map((stat, i) => (
          <Card key={i} variant="glass" className="hover-lift">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                {stat.loading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prewedding Quick Access */}
      <Card variant="glow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <CardTitle>Fitur Foto & Prewedding</CardTitle>
          </div>
          <CardDescription>Preset lokasi dan gaya untuk fotografi profesional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presetsLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))
            ) : (
              locations.slice(0, 4).map((location) => (
                <div 
                  key={location.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => navigate('/generator-gambar')}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{location.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{location.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Fitur Utama</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/template')}>
            Lihat Semua
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <Card 
              key={i} 
              variant="glass" 
              className="group cursor-pointer hover-lift"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader className="pb-2">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tips Section */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              <CardTitle>Tips Prompting</CardTitle>
            </div>
            <CardDescription>Tingkatkan kualitas prompt Anda dengan tips berikut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {historyLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {activity.type === 'gambar' && <Image className="h-4 w-4 text-primary" />}
                    {activity.type === 'video' && <Video className="h-4 w-4 text-secondary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                Belum ada aktivitas. Mulai buat prompt pertama Anda!
              </div>
            )}
            <Button variant="ghost" className="w-full" onClick={() => navigate('/riwayat')}>
              Lihat Semua Riwayat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
