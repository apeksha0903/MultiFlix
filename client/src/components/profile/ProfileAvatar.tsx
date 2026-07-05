import { memo } from 'react';
import { motion } from 'framer-motion';
import { getInitials } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

const sizeMap = {
  sm: 'h-12 w-12 text-sm',
  md: 'h-24 w-24 text-2xl',
  lg: 'h-32 w-32 text-3xl',
};

export const ProfileAvatar = memo(function ProfileAvatar({
  name,
  size = 'md',
  onClick,
  className,
  selected = false,
}: ProfileAvatarProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.08, rotate: 2 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover font-bold text-white shadow-lg ring-0 transition-all',
        sizeMap[size],
        selected && 'shadow-[0_0_0_3px_#7C3AED,0_0_24px_rgba(124,58,237,0.45)]',
        className,
      )}
    >
      {getInitials(name)}
    </motion.button>
  );
});
