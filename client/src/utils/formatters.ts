export const formatRuntime = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getMediaTitle = (item: {
  title?: string;
  name?: string;
}): string => {
  return item.title ?? item.name ?? 'Unknown';
};

export const getReleaseYear = (item: {
  release_date?: string;
  first_air_date?: string;
}): string => {
  const date = item.release_date ?? item.first_air_date;
  return date ? date.slice(0, 4) : '';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
