import { cn } from '@/lib/utils';

interface ContentBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentBadge({ children, className }: ContentBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-background-tertiary px-2.5 py-0.5 text-xs text-foreground-secondary',
        className,
      )}
    >
      {children}
    </span>
  );
}
