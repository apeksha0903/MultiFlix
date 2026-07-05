import { generateAvatarUrl } from '@/utils/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  email: string;
  avatarStyle?: string;
  size?: number;
  className?: string;
}

export function UserAvatar({
  email,
  avatarStyle = 'avataaars',
  size = 48,
  className,
}: UserAvatarProps) {
  return (
    <img
      src={generateAvatarUrl(email, avatarStyle)}
      alt="avatar"
      width={size}
      height={size}
      className={cn('rounded-full bg-white/5 object-cover', className)}
    />
  );
}
