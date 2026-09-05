import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SheetClose } from '@/components/ui/sheet';
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
  Zap,
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Beranda', path: '/' },
  { icon: Image, label: 'Generator Prompt Gambar', path: '/generator-gambar' },
  { icon: Video, label: 'Generator Prompt Video', path: '/generator-video' },
  { icon: Users, label: 'Konsistensi Karakter', path: '/karakter' },
  { icon: Sparkles, label: 'Penyempurna Prompt', path: '/penyempurna' },
  { icon: MinusCircle, label: 'Generator Prompt Negatif', path: '/negatif' },
  { icon: Layout, label: 'Studio Workflow', path: '/workflow' },
  { icon: History, label: 'Riwayat', path: '/riwayat' },
  { icon: Heart, label: 'Favorit', path: '/favorit' },
  { icon: Grid3X3, label: 'Eksplor Template', path: '/template' },
  { icon: Settings, label: 'Pengaturan', path: '/pengaturan' },
];

export function MobileMenu() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold gradient-text">PromptAI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <SheetClose asChild>
                  <NavLink
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-glow'
                        : 'text-sidebar-foreground'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                    <span>{item.label}</span>
                  </NavLink>
                </SheetClose>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>Sistem Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
