import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCharacters } from '@/hooks/useCharacters';
import { Users, Plus, Trash2, Edit2, User, Save, X, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Database } from '@/integrations/supabase/types';

type Character = Database['public']['Tables']['characters']['Row'];

export default function CharacterPage() {
  const { characters, isLoading, createCharacter, updateCharacter, deleteCharacter } = useCharacters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    face_features: '',
    clothing: '',
    style: '',
    mood: '',
  });

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Nama karakter wajib diisi');
      return;
    }

    setIsSaving(true);

    try {
      if (editingCharacter) {
        await updateCharacter(editingCharacter.id, formData);
      } else {
        await createCharacter(formData);
      }
      resetForm();
      setIsDialogOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      age: character.age || '',
      gender: character.gender || '',
      face_features: character.face_features || '',
      clothing: character.clothing || '',
      style: character.style || '',
      mood: character.mood || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCharacter(id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      face_features: '',
      clothing: '',
      style: '',
      mood: '',
    });
    setEditingCharacter(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-accent" />
              Konsistensi Karakter
            </h1>
            <p className="text-muted-foreground mt-1">
              Buat dan kelola DNA karakter untuk konsistensi visual
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="glass">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-accent" />
            Konsistensi Karakter
          </h1>
          <p className="text-muted-foreground mt-1">
            Buat dan kelola DNA karakter untuk konsistensi visual
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => resetForm()}>
              <Plus className="h-4 w-4" />
              Karakter Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg glass-strong">
            <DialogHeader>
              <DialogTitle>
                {editingCharacter ? 'Edit Karakter' : 'Buat Karakter Baru'}
              </DialogTitle>
              <DialogDescription>
                Isi detail karakter untuk membuat DNA visual yang konsisten
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Karakter</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Aria"
                    variant="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Usia</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Contoh: 25 tahun"
                    variant="glass"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Input
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  placeholder="Contoh: Perempuan"
                  variant="glass"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="face_features">Ciri Wajah</Label>
                <Textarea
                  id="face_features"
                  value={formData.face_features}
                  onChange={(e) => setFormData({ ...formData, face_features: e.target.value })}
                  placeholder="Contoh: Mata besar berwarna coklat, hidung mancung, bibir penuh..."
                  className="bg-muted/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clothing">Pakaian Khas</Label>
                <Textarea
                  id="clothing"
                  value={formData.clothing}
                  onChange={(e) => setFormData({ ...formData, clothing: e.target.value })}
                  placeholder="Contoh: Jaket kulit hitam, kaos putih polos, jeans biru..."
                  className="bg-muted/30"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Gaya Visual</Label>
                  <Input
                    id="style"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    placeholder="Contoh: Cyberpunk"
                    variant="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mood">Suasana/Mood</Label>
                  <Input
                    id="mood"
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    placeholder="Contoh: Misterius"
                    variant="glass"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                <X className="h-4 w-4" />
                Batal
              </Button>
              <Button variant="gradient" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Characters Grid */}
      {characters.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <Card key={character.id} variant="glass" className="group hover-lift">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{character.name}</CardTitle>
                      <CardDescription>
                        {character.age} • {character.gender}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(character)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(character.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {character.face_features && (
                  <div>
                    <span className="text-muted-foreground">Wajah:</span>{' '}
                    <span className="text-foreground">{character.face_features}</span>
                  </div>
                )}
                {character.style && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      {character.style}
                    </span>
                    {character.mood && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs">
                        {character.mood}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="glass">
          <CardContent>
            <EmptyState
              icon={Users}
              title="Belum Ada Karakter"
              description="Buat karakter pertama Anda untuk menjaga konsistensi visual di setiap konten"
              action={{
                label: 'Buat Karakter',
                onClick: () => setIsDialogOpen(true),
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
