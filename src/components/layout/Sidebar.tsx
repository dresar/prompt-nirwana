import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
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
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const menuItems = [
  { icon: Home, label: 'Beranda', path: '/' },
  { icon: Image, label: 'Prompt Gambar', path: '/generator-gambar' },
  { icon: Video, label: 'Prompt Video', path: '/generator-video' },
  { icon: Users, label: 'Karakter', path: '/karakter' },
  { icon: Sparkles, label: 'Penyempurna', path: '/penyempurna' },
  { icon: MinusCircle, label: 'Prompt Negatif', path: '/negatif' },
  { icon: Layout, label: 'Studio Workflow', path: '/workflow' },
  { icon: History, label: 'Riwayat', path: '/riwayat' },
  { icon: Heart, label: 'Favorit', path: '/favorit' },
  { icon: Grid3X3, label: 'Template', path: '/template' },
  { icon: Settings, label: 'Pengaturan', path: '/pengaturan' },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'bg-sidebar border-r border-sidebar-border',
        'hidden md:flex flex-col',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text">PromptAI</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="mx-auto h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-lg hover:bg-muted"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            const linkContent = (
              <NavLink
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-glow'
                    : 'text-sidebar-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );

            if (sidebarCollapsed) {
              return (
                <li key={item.path}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="glass">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return <li key={item.path}>{linkContent}</li>;
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="glass rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>Sistem Aktif</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
