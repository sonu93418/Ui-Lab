// Button component template
export const buttonTemplate = `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow hover:opacity-90',
        destructive:
          'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] shadow-sm hover:opacity-90',
        outline:
          'border border-[var(--color-border)] bg-transparent shadow-sm hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
        secondary:
          'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] shadow-sm hover:opacity-90',
        ghost:
          'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
        link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-[var(--radius-sm)] px-3 text-xs',
        lg: 'h-11 rounded-[var(--radius-lg)] px-8 text-base',
        xl: 'h-12 rounded-[var(--radius-lg)] px-10 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
`;

// Input component template
export const inputTemplate = `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-[var(--color-muted-foreground)]">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              'flex h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-input)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
              'placeholder:text-[var(--color-muted-foreground)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? \`\${inputId}-error\` : hint ? \`\${inputId}-hint\` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute right-3 text-[var(--color-muted-foreground)]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={\`\${inputId}-error\`} className="text-xs text-[var(--color-destructive)]">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={\`\${inputId}-hint\`} className="text-xs text-[var(--color-muted-foreground)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
`;

// Badge component template
export const badgeTemplate = `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        secondary:
          'border-transparent bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]',
        destructive:
          'border-transparent bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]',
        success:
          'border-transparent bg-[var(--color-success,#10b981)] text-white',
        outline:
          'border-[var(--color-border)] text-[var(--color-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
`;

// Card component template
export const cardTemplate = `import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-[var(--color-muted-foreground)]', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
`;

// Avatar component template
export const avatarTemplate = `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden',
  {
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
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
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
    <div
      className={cn(avatarVariants({ size, shape, ring }), className)}
      {...props}
    >
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
`;

// Skeleton component template
export const skeletonTemplate = `import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-md)] bg-[var(--color-muted)]',
        className
      )}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonList };
`;

// Spinner component template
export const spinnerTemplate = `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: { size: 'default' },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

function Spinner({ size, className, label = 'Loading...' }: SpinnerProps) {
  return (
    <div role="status" aria-label={label} className={cn('inline-flex', className)}>
      <svg
        className={cn('animate-spin text-[var(--color-primary)]', spinnerVariants({ size }))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { Spinner };
`;

// Modal component template
export const modalTemplate = `'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  default: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

function Modal({ open, onClose, title, description, children, className, size = 'default' }: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full rounded-[var(--radius-xl)] border border-[var(--color-border)]',
          'bg-[var(--color-card)] text-[var(--color-card-foreground)] shadow-2xl',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-6 py-4">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold leading-none">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-[var(--radius-sm)] p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export { Modal };
`;

// Tabs component template
export const tabsTemplate = `'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  children: (activeTab: string) => React.ReactNode;
  variant?: 'default' | 'pills' | 'underline' | 'boxed';
  className?: string;
}

const listVariants = cva('flex', {
  variants: {
    variant: {
      default: 'gap-1 rounded-[var(--radius-lg)] bg-[var(--color-muted)] p-1',
      pills: 'gap-2',
      underline: 'gap-0 border-b border-[var(--color-border)]',
      boxed: 'gap-0 border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden',
    },
  },
  defaultVariants: { variant: 'default' },
});

const triggerVariants = cva(
  'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-[var(--radius-md)] data-[active=true]:bg-[var(--color-card)] data-[active=true]:shadow-sm text-[var(--color-muted-foreground)] data-[active=true]:text-[var(--color-foreground)]',
        pills: 'rounded-[var(--radius-full)] data-[active=true]:bg-[var(--color-primary)] data-[active=true]:text-[var(--color-primary-foreground)] text-[var(--color-muted-foreground)]',
        underline: 'border-b-2 border-transparent rounded-none px-4 data-[active=true]:border-[var(--color-primary)] data-[active=true]:text-[var(--color-primary)] text-[var(--color-muted-foreground)]',
        boxed: 'border-r border-[var(--color-border)] last:border-r-0 data-[active=true]:bg-[var(--color-accent)] data-[active=true]:text-[var(--color-foreground)] text-[var(--color-muted-foreground)] px-4',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Tabs({ tabs, defaultTab, onChange, children, variant = 'default', className }: TabsProps) {
  const [active, setActive] = React.useState(defaultTab ?? tabs[0]?.id ?? '');

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div role="tablist" className={listVariants({ variant })}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={\`tab-\${tab.id}\`}
            aria-selected={active === tab.id}
            aria-controls={\`panel-\${tab.id}\`}
            data-active={active === tab.id}
            disabled={tab.disabled}
            onClick={() => handleChange(tab.id)}
            className={triggerVariants({ variant })}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={\`panel-\${active}\`} aria-labelledby={\`tab-\${active}\`}>
        {children(active)}
      </div>
    </div>
  );
}

export { Tabs, type Tab };
`;

// Toast component template
export const toastTemplate = `'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

const icons: Record<ToastType, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  success: <CheckCircle className="h-4 w-4 text-[var(--color-success,#10b981)]" />,
  error: <AlertCircle className="h-4 w-4 text-[var(--color-destructive)]" />,
  warning: <AlertTriangle className="h-4 w-4 text-[var(--color-warning,#f59e0b)]" />,
  info: <Info className="h-4 w-4 text-[var(--color-primary)]" />,
};

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  React.useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]',
        'bg-[var(--color-card)] p-4 shadow-lg',
        'animate-in slide-in-from-bottom-4 fade-in-0 duration-300'
      )}
    >
      <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export { ToastItem, type ToastData, type ToastType };
`;

// Dropdown component template
export const dropdownTemplate = `'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}

interface DropdownSeparator {
  type: 'separator';
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | DropdownSeparator)[];
  align?: 'left' | 'right';
  className?: string;
}

function Dropdown({ trigger, items, align = 'left', className }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-1 min-w-[10rem] rounded-[var(--radius-lg)] border border-[var(--color-border)]',
            'bg-[var(--color-popover)] text-[var(--color-popover-foreground)] shadow-md p-1',
            'animate-in fade-in-0 zoom-in-95 duration-100',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) => {
            if ('type' in item && item.type === 'separator') {
              return <div key={i} className="my-1 border-t border-[var(--color-border)]" />;
            }

            const d = item as DropdownItem;
            return (
              <button
                key={d.id}
                role="menuitem"
                disabled={d.disabled}
                onClick={() => { d.onClick?.(); setOpen(false); }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm transition-colors',
                  'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
                  'focus:bg-[var(--color-accent)] focus:outline-none',
                  d.disabled && 'pointer-events-none opacity-50',
                  d.destructive && 'text-[var(--color-destructive)] hover:bg-[var(--color-destructive)] hover:text-white'
                )}
              >
                {d.icon}
                {d.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { Dropdown, type DropdownItem };
`;

// Table component template
export const tableTemplate = `'use client';

import * as React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  className?: string;
  emptyMessage?: string;
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = false,
  className,
  emptyMessage = 'No data found.',
}: TableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);
  const [search, setSearch] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
    );
  }, [data, search]);

  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof T];
      const bv = b[sortKey as keyof T];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
    if (sortDir === 'asc') setSortDir('desc');
    else { setSortKey(null); setSortDir(null); }
  };

  const SortIcon = ({ col }: { col: Column<T> }) => {
    if (!col.sortable) return null;
    const key = String(col.key);
    if (sortKey !== key) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5" />
      : <ChevronDown className="h-3.5 w-3.5" />;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {searchable && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-input)] bg-transparent pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]',
                    col.sortable && 'cursor-pointer select-none hover:text-[var(--color-foreground)]',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-[var(--color-muted-foreground)]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--color-muted)]/50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn('px-4 py-3', col.className)}>
                      {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { DataTable, type Column };
`;

// Stats Card component template
export const statsCardTemplate = `import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'compact';
}

function StatsCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  className,
  variant = 'default',
}: StatsCardProps) {
  const isPositive = (change ?? 0) > 0;
  const isNeutral = change === 0 || change === undefined;

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral
    ? 'text-[var(--color-muted-foreground)]'
    : isPositive
    ? 'text-[var(--color-success,#10b981)]'
    : 'text-[var(--color-destructive)]';

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3', className)}>
        <div>
          <p className="text-xs text-[var(--color-muted-foreground)]">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
        {icon && <span className="text-[var(--color-primary)] opacity-80">{icon}</span>}
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={cn('rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-px', className)}>
        <div className="rounded-[calc(var(--radius-lg)-1px)] bg-[var(--color-card)] p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{title}</p>
            {icon && <span className="text-[var(--color-primary)]">{icon}</span>}
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className={cn('mt-2 flex items-center gap-1 text-xs', trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>{Math.abs(change)}% {changeLabel}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-5', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{title}</p>
        {icon && <span className="rounded-[var(--radius-md)] bg-[var(--color-accent)] p-2 text-[var(--color-primary)]">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {change !== undefined && (
        <div className={cn('mt-2 flex items-center gap-1 text-xs', trendColor)}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>{Math.abs(change)}% {changeLabel}</span>
        </div>
      )}
    </div>
  );
}

export { StatsCard };
`;

// Sidebar component template
export const sidebarTemplate = `'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

function Sidebar({ items, activeId, logo, footer, className, defaultCollapsed = false }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      {logo && (
        <div className={cn('flex h-16 items-center border-b border-[var(--color-border)] px-4', collapsed && 'justify-center px-2')}>
          {logo}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {items.map((item) => (
          <SidebarNavItem key={item.id} item={item} activeId={activeId} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="border-t border-[var(--color-border)] p-2">{footer}</div>
      )}

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className={cn(
          'absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-colors hover:bg-[var(--color-accent)]',
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}

function SidebarNavItem({
  item,
  activeId,
  collapsed,
}: {
  item: SidebarItem;
  activeId?: string;
  collapsed: boolean;
}) {
  const isActive = activeId === item.id;
  const Element = item.href ? 'a' : 'button';

  return (
    <Element
      href={item.href}
      onClick={item.onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
          : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]',
        collapsed && 'justify-center px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs text-[var(--color-primary-foreground)]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Element>
  );
}

export { Sidebar, type SidebarItem };
`;

// Select component template
export const selectTemplate = `'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled,
  className,
  id,
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-foreground)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            'h-9 w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-input)] bg-transparent px-3 pr-8 py-1 text-sm shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--color-destructive)]',
            !value && 'text-[var(--color-muted-foreground)]',
            className
          )}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
      </div>
      {error && (
        <p className="text-xs text-[var(--color-destructive)]">{error}</p>
      )}
    </div>
  );
}

export { Select, type SelectOption };
`;
