interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'Nothing here yet.',
  onRetry,
  skeleton,
  children,
}: QueryStateProps) {
  if (isLoading) return <>{skeleton}</>;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-foreground-secondary">
          {error?.message || 'Something went wrong.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-hover"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="py-12 text-center text-foreground-secondary">{emptyMessage}</div>
    );
  }

  return <>{children}</>;
}

export function RowSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden px-4 md:px-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[180px] w-[120px] shrink-0 animate-pulse rounded-md bg-background-tertiary" />
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-background-tertiary" />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="h-64 animate-pulse rounded-lg bg-background-tertiary" />
      <div className="h-8 w-48 animate-pulse rounded bg-background-tertiary" />
      <RowSkeleton />
    </div>
  );
}
