import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon' | 'icon-sm';
}

export function CopyButton({ text, label, className, variant = 'ghost', size = label ? 'sm' : 'icon-sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Berhasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Gagal menyalin teks');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        'transition-all duration-300',
        copied && 'text-success',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 animate-scale-in" />
          {label && <span className="ml-1">Disalin!</span>}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label && <span className="ml-1">{label}</span>}
        </>
      )}
    </Button>
  );
}
