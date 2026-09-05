import { CopyButton } from './CopyButton';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  content: string;
  label?: string;
  className?: string;
}

export function CodeBlock({ content, label, className }: CodeBlockProps) {
  return (
    <div className={cn('relative rounded-xl overflow-hidden', className)}>
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <CopyButton text={content} />
        </div>
      )}
      <div className="relative glass p-4">
        <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-mono leading-relaxed">
          {content}
        </pre>
        {!label && (
          <div className="absolute top-2 right-2">
            <CopyButton text={content} />
          </div>
        )}
      </div>
    </div>
  );
}
