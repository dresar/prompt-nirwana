import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from '@/components/common/CommandPalette';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export function Layout() {
  const { sidebarCollapsed } = useApp();
  const [commandOpen, setCommandOpen] = useState(false);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Navbar */}
      <div
        className={cn(
          'transition-all duration-300',
          'md:ml-64',
          sidebarCollapsed && 'md:ml-16'
        )}
      >
        <Navbar onCommandOpen={() => setCommandOpen(true)} />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 pb-20 md:pb-8 transition-all duration-300',
          'md:ml-64',
          sidebarCollapsed && 'md:ml-16'
        )}
      >
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
