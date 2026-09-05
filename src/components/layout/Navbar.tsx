import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Command, Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MobileMenu } from './MobileMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onCommandOpen: () => void;
}

export function Navbar({ onCommandOpen }: NavbarProps) {
  const { sidebarCollapsed } = useApp();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Berhasil keluar');
    navigate('/masuk');
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 border-b border-border transition-all duration-300',
        'bg-background/80 backdrop-blur-lg',
        sidebarCollapsed ? 'left-16' : 'left-64',
        'md:left-auto md:right-0',
        sidebarCollapsed ? 'md:left-16' : 'md:left-64'
      )}
      style={{ left: 'var(--sidebar-width, 0px)' }}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
            <MobileMenu />
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              variant="glass"
              placeholder="Cari prompt, template, atau fitur..."
              className={cn(
                'pl-10 pr-20 transition-all duration-300',
                searchFocused && 'ring-2 ring-primary shadow-glow'
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onCommandOpen}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Command className="h-3 w-3 mr-1" />
              <span>K</span>
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.full_name || 'Pengguna'}</span>
                  <span className="text-xs text-muted-foreground">{profile?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/pengaturan')}>
                <User className="mr-2 h-4 w-4" />
                Profil Saya
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/pengaturan')}>
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
