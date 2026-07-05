export const AVATAR_STYLES = [
  { id: 'avataaars', label: 'Cartoon' },
  { id: 'bottts', label: 'Robot' },
  { id: 'pixel-art', label: 'Pixel' },
  { id: 'lorelei', label: 'Portrait' },
  { id: 'thumbs', label: 'Thumbs' },
] as const;

export type AvatarStyle = typeof AVATAR_STYLES[number]['id'];

export function generateAvatarUrl(seed: string, style: string = 'avataaars'): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}
