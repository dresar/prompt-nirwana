import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Image, Video, Grid3X3, Settings } from 'lucide-react';

const mobileMenuItems = [
  { icon: Home, label: 'Beranda', path: '/' },
  { icon: Image, label: 'Gambar', path: '/generator-gambar' },
  { icon: Video, label: 'Video', path: '/generator-video' },
  { icon: Grid3X3, label: 'Template', path: '/template' },
  { icon: Settings, label: 'Pengaturan', path: '/pengaturan' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-strong border-t border-border">
        <div className="flex items-center justify-around py-2">
          {mobileMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'animate-pulse-slow')} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary shadow-glow" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
