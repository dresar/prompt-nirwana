import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useApp } from '@/contexts/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Settings, User, Key, Palette, Bell, Plus, Trash2, GripVertical, Upload, Download, Edit2, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/integrations/supabase/types';

type ApiProvider = Database['public']['Enums']['api_provider'];

export default function SettingsPage() {
  const { signOut } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { apiKeys, isLoading: keysLoading, addApiKey, toggleApiKey, deleteApiKey, importKeys, exportKeys } = useApiKeys();
  const { appearance, setAppearance, notifications, setNotifications, activeProvider, setActiveProvider } = useApp();
  
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyProvider, setNewKeyProvider] = useState<ApiProvider>('gemini');
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [editName, setEditName] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddApiKey = async () => {
    if (!newKeyName || !newKeyValue) {
      toast.error('Nama dan API Key wajib diisi');
      return;
    }
    
    setIsAddingKey(true);
    try {
      await addApiKey({
        provider: newKeyProvider,
        key_name: newKeyName,
        key_value: newKeyValue,
      });
      setNewKeyName('');
      setNewKeyValue('');
    } finally {
      setIsAddingKey(false);
    }
  };

  const handleImportKeys = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          await importKeys(data);
        } else {
          toast.error('Format file tidak valid');
        }
      } catch {
        toast.error('Gagal membaca file');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveProfile = async () => {
    await updateProfile({ full_name: editName });
    setIsEditingProfile(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Berhasil keluar');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Pengaturan
          </h1>
          <p className="text-muted-foreground mt-1">Kelola akun dan preferensi aplikasi</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profil</TabsTrigger>
          <TabsTrigger value="api"><Key className="h-4 w-4 mr-2" />API Key</TabsTrigger>
          <TabsTrigger value="provider"><Key className="h-4 w-4 mr-2" />Provider</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" />Tampilan</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifikasi</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Profil Pengguna</CardTitle>
              <CardDescription>Kelola informasi akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileLoading ? (
                <div className="flex items-center gap-6">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-2xl">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline"><Upload className="h-4 w-4" />Unggah Foto</Button>
                  </div>
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Nama</Label>
                      {isEditingProfile ? (
                        <Input 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          variant="glass" 
                        />
                      ) : (
                        <p className="text-foreground">{profile?.full_name || 'Belum diatur'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <p className="text-muted-foreground">{profile?.email}</p>
                    </div>
                    {isEditingProfile ? (
                      <div className="flex gap-2">
                        <Button variant="gradient" onClick={handleSaveProfile}>
                          <Edit2 className="h-4 w-4" />Simpan
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Batal
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => { setEditName(profile?.full_name || ''); setIsEditingProfile(true); }}>
                        <Edit2 className="h-4 w-4" />Edit Profil
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Key Tab */}
        <TabsContent value="api">
          <Card variant="glow">
            <CardHeader>
              <CardTitle>Manajemen API Key</CardTitle>
              <CardDescription>
                Tambah dan kelola API key untuk berbagai provider AI. 
                Sistem akan otomatis beralih ke key berikutnya jika limit tercapai.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Key */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
                <h4 className="font-medium">Tambah API Key Baru</h4>
                <div className="grid sm:grid-cols-4 gap-3">
                  <Input 
                    placeholder="Nama Key" 
                    value={newKeyName} 
                    onChange={(e) => setNewKeyName(e.target.value)} 
                    variant="glass" 
                  />
                  <Input 
                    placeholder="API Key" 
                    type="password" 
                    value={newKeyValue} 
                    onChange={(e) => setNewKeyValue(e.target.value)} 
                    variant="glass" 
                  />
                  <Select value={newKeyProvider} onValueChange={(v) => setNewKeyProvider(v as ApiProvider)}>
                    <SelectTrigger className="glass"><SelectValue /></SelectTrigger>
                    <SelectContent className="glass">
                      <SelectItem value="gemini">Gemini 2.5 Flash</SelectItem>
                      <SelectItem value="groq">Groq Visual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="gradient" onClick={handleAddApiKey} disabled={isAddingKey}>
                    {isAddingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Tambah
                  </Button>
                </div>
              </div>

              {/* API Keys List */}
              <div className="space-y-3">
                {keysLoading ? (
                  [1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                      <Skeleton className="h-5 w-5" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-10" />
                    </div>
                  ))
                ) : apiKeys.length > 0 ? (
                  apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border group">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{key.key_name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                            {key.provider === 'gemini' ? 'Gemini' : 'Groq'}
                          </span>
                          <StatusBadge status={key.is_enabled ? key.status : 'inactive'} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          •••••••••••{key.key_value.slice(-4)}
                        </p>
                      </div>
                      <Switch 
                        checked={key.is_enabled || false} 
                        onCheckedChange={() => toggleApiKey(key.id, key.is_enabled || false)} 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        onClick={() => deleteApiKey(key.id)} 
                        className="text-destructive opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Belum ada API Key. Tambahkan untuk mulai menggunakan AI.
                  </p>
                )}
              </div>

              {/* Import/Export */}
              <div className="flex gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleImportKeys} 
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" />Import JSON
                </Button>
                <Button variant="outline" onClick={exportKeys} disabled={apiKeys.length === 0}>
                  <Download className="h-4 w-4" />Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Provider Tab */}
        <TabsContent value="provider">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Provider Utama</CardTitle>
              <CardDescription>Pilih provider AI yang akan digunakan secara default</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {(['gemini', 'groq'] as const).map((p) => (
                  <Card 
                    key={p} 
                    variant={activeProvider === p ? 'glow' : 'default'} 
                    className={`flex-1 cursor-pointer ${activeProvider === p ? 'ring-2 ring-primary' : ''}`} 
                    onClick={() => setActiveProvider(p)}
                  >
                    <CardContent className="p-6 text-center">
                      <h4 className="font-semibold">{p === 'gemini' ? 'Gemini 2.5 Flash' : 'Groq Visual'}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {p === 'gemini' ? 'Analisis gambar & video' : 'Model visual cepat'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Tampilan</CardTitle>
              <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode Gelap</Label>
                  <p className="text-sm text-muted-foreground">Aktifkan tema gelap</p>
                </div>
                <Switch 
                  checked={appearance.theme === 'dark'} 
                  onCheckedChange={(c) => setAppearance({ ...appearance, theme: c ? 'dark' : 'light' })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Kepadatan Tampilan</Label>
                <div className="flex gap-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                    <Button 
                      key={d} 
                      variant={appearance.density === d ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setAppearance({ ...appearance, density: d })}
                    >
                      {d === 'compact' ? 'Padat' : d === 'comfortable' ? 'Nyaman' : 'Luas'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>Kelola preferensi notifikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Peringatan Limit API</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi saat limit hampir habis</p>
                </div>
                <Switch 
                  checked={notifications.apiLimit} 
                  onCheckedChange={(c) => setNotifications({ ...notifications, apiLimit: c })} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Error API</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi saat terjadi error</p>
                </div>
                <Switch 
                  checked={notifications.apiError} 
                  onCheckedChange={(c) => setNotifications({ ...notifications, apiError: c })} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
