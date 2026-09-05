import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusType = 'active' | 'limit' | 'error' | 'backup' | 'disabled' | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: 'Aktif',
    className: 'bg-success/20 text-success border-success/30',
  },
  limit: {
    label: 'Limit Hampir Habis',
    className: 'bg-warning/20 text-warning border-warning/30',
  },
  error: {
    label: 'Error',
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
  backup: {
    label: 'Cadangan',
    className: 'bg-secondary/20 text-secondary border-secondary/30',
  },
  disabled: {
    label: 'Nonaktif',
    className: 'bg-muted text-muted-foreground border-muted',
  },
  inactive: {
    label: 'Nonaktif',
    className: 'bg-muted text-muted-foreground border-muted',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium',
        config.className,
        className
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </Badge>
  );
}
