'use client';

interface StatusBadgeProps {
  status: 'online' | 'busy' | 'down' | 'offline';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return {
          bgColor: 'bg-[var(--success)]/20',
          textColor: 'text-[var(--success)]',
          dotColor: 'bg-[var(--success)]',
          text: 'Online',
        };
      case 'busy':
        return {
          bgColor: 'bg-[var(--warning)]/20',
          textColor: 'text-[var(--warning)]',
          dotColor: 'bg-[var(--warning)]',
          text: 'Busy',
        };
      case 'down':
        return {
          bgColor: 'bg-[var(--primary)]/20',
          textColor: 'text-[var(--primary)]',
          dotColor: 'bg-[var(--primary)]',
          text: 'Down',
        };
      case 'offline':
        return {
          bgColor: 'bg-[var(--text-muted)]/20',
          textColor: 'text-[var(--text-muted)]',
          dotColor: 'bg-[var(--text-muted)]',
          text: 'Offline',
        };
      default:
        return {
          bgColor: 'bg-[var(--text-muted)]/20',
          textColor: 'text-[var(--text-muted)]',
          dotColor: 'bg-[var(--text-muted)]',
          text: 'Unknown',
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          dot: 'w-1.5 h-1.5',
        };
      case 'md':
        return {
          container: 'px-2.5 py-1 text-sm',
          dot: 'w-2 h-2',
        };
      case 'lg':
        return {
          container: 'px-3 py-1.5 text-base',
          dot: 'w-2.5 h-2.5',
        };
      default:
        return {
          container: 'px-2.5 py-1 text-sm',
          dot: 'w-2 h-2',
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses.container}`}
    >
      <div
        className={`${config.dotColor} rounded-full mr-1.5 ${sizeClasses.dot}`}
      />
      {config.text}
    </span>
  );
}
