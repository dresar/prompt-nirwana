import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
  preview?: string | null;
  onClear?: () => void;
}

export function UploadArea({
  onFileSelect,
  accept = 'image/*',
  className,
  preview,
  onClear,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  if (preview) {
    return (
      <div className={cn('relative rounded-xl overflow-hidden', className)}>
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        {onClear && (
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={onClear}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer',
        'flex flex-col items-center justify-center gap-4 p-8',
        isDragging
          ? 'border-primary bg-primary/10 shadow-glow'
          : 'border-border hover:border-primary/50 hover:bg-muted/30',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      
      <div
        className={cn(
          'h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300',
          isDragging ? 'bg-primary/20' : 'bg-muted'
        )}
      >
        {isDragging ? (
          <Upload className="h-8 w-8 text-primary animate-bounce" />
        ) : (
          <Image className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragging ? 'Lepaskan file di sini' : 'Seret dan lepas gambar'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          atau klik untuk memilih file
        </p>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Format: PNG, JPG, WEBP (Maks. 10MB)
      </p>
    </div>
  );
}
