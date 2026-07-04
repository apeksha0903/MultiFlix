import { getInitials } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: 'h-12 w-12 text-sm',
  md: 'h-24 w-24 text-2xl',
  lg: 'h-32 w-32 text-3xl',
};

export function ProfileAvatar({ name, size = 'md', onClick, className }: ProfileAvatarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover font-bold text-white transition-transform hover:scale-105',
        sizeMap[size],
        className,
      )}
    >
      {getInitials(name)}
    </button>
  );
}
