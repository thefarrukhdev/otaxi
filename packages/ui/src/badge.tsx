import React from 'react';
import { cn } from './utils';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'
  | 'international'
  | 'brand';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  dot = false,
  children,
  ...props
}) => {
  const variants: Record<BadgeVariant, { pill: string; dot: string }> = {
    brand: { pill: 'bg-[#FF8800]/15 text-[#FF8800]', dot: 'bg-[#FF8800]' },
    success: { pill: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
    warning: { pill: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-400' },
    info: { pill: 'bg-sky-500/15 text-sky-400', dot: 'bg-sky-400' },
    danger: { pill: 'bg-rose-500/15 text-rose-400', dot: 'bg-rose-400' },
    international: { pill: 'bg-purple-500/15 text-purple-400', dot: 'bg-purple-400' },
    neutral: { pill: 'bg-[#1A1D26] text-slate-300', dot: 'bg-slate-400' },
  };

  const selected = variants[variant] || variants.neutral;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border-0',
        selected.pill,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', selected.dot)} />}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
