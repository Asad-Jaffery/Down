'use client';

interface ProfilePicProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  className?: string;
}

export default function ProfilePic({
  src,
  alt,
  size = 'md',
  name,
  className = '',
}: ProfilePicProps) {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'md':
        return 'w-10 h-10 text-sm';
      case 'lg':
        return 'w-12 h-12 text-base';
      case 'xl':
        return 'w-16 h-16 text-lg';
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = getSizeClasses(size);
  const initials = name ? getInitials(name) : alt.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeClasses} ${className} rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-[var(--background)] font-medium overflow-hidden`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className='w-full h-full object-cover'
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <span className={src ? 'hidden' : ''}>{initials}</span>
    </div>
  );
}
