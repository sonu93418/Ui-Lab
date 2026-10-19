import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden', {
  variants: {
    size: {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      default: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded-[var(--radius-md)]',
    },
    ring: {
      true: 'ring-2 ring-[var(--color-primary)] ring-offset-2',
      false: '',
    },
  },
  defaultVariants: {
    size: 'default',
    shape: 'circle',
    ring: false,
  },
});

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

function Avatar({ className, src, alt, fallback, size, shape, ring, ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const initials = fallback
    ? fallback
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className={cn(avatarVariants({ size, shape, ring }), className)} {...props}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt ?? fallback ?? 'avatar'}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-[var(--color-muted)] font-medium text-[var(--color-muted-foreground)]">
          {initials}
        </span>
      )}
    </div>
  );
}

export { Avatar };
