import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Image, Video, Sparkles, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { CopyButton } from '@/components/common/CopyButton';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const typeIcons: Record<string, React.ElementType> = {
  gambar: Image,
  video: Video,
};

const typeLabels: Record<string, string> = {
  gambar: 'Gambar',
  video: 'Video',
};

export default function FavoritesPage() {
  const { history, isLoading, toggleFavorite, deleteFromHistory } = usePromptHistory();
  const navigate = useNavigate();
  
  const favorites = history.filter(item => item.is_favorite);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-destructive" />
            Prompt Favorit
          </h1>
          <p className="text-muted-foreground mt-1">
            Prompt yang Anda simpan sebagai favorit
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} variant="glass">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-destructive" />
          Prompt Favorit
        </h1>
        <p className="text-muted-foreground mt-1">
          Prompt yang Anda simpan sebagai favorit
        </p>
      </div>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((item) => {
            const Icon = typeIcons[item.type] || Sparkles;
            return (
              <Card key={item.id} variant="glass" className="group hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{item.title}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                          {typeLabels[item.type] || item.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{item.text_content}</p>
                    </div>
                    
                    <div className="flex gap-1">
                      <CopyButton text={item.text_content || ''} />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggleFavorite(item.id, true)}
                        className="text-destructive"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteFromHistory(item.id)}
                        className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="glass">
          <CardContent>
            <EmptyState
              icon={Heart}
              title="Belum Ada Favorit"
              description="Tandai prompt yang Anda sukai dengan menekan tombol hati untuk menyimpannya di sini."
              action={{
                label: 'Lihat Riwayat',
                onClick: () => navigate('/riwayat'),
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
