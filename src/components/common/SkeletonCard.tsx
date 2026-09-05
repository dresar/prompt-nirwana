import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  hasImage?: boolean;
}

export function SkeletonCard({ className, lines = 3, hasImage = false }: SkeletonCardProps) {
  return (
    <div className={cn('glass rounded-xl p-4 space-y-4', className)}>
      {hasImage && (
        <Skeleton className="h-40 w-full rounded-lg" />
      )}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4', i === lines - 1 ? 'w-1/2' : 'w-full')}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
