import React from 'react';
import { cn } from './utils';

export type ButtonVariant = 'primary' | 'amber' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0C0D11] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[#FF8800] text-[#0C0D11] hover:bg-[#FFA033] font-bold focus:ring-[#FF8800] shadow-sm',
      amber: 'bg-[#FF8800] text-[#0C0D11] hover:bg-[#FFA033] font-bold focus:ring-[#FF8800] shadow-sm',
      secondary: 'bg-[#1D2029] border border-[#272B35] text-white hover:bg-[#252934] focus:ring-[#FF8800]',
      outline: 'border border-[#272B35] bg-[#15171E] text-white hover:bg-[#1D2029] focus:ring-[#FF8800]',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
      ghost: 'bg-transparent text-[#FF8800] hover:bg-[#FF8800]/10 hover:text-[#FFA033] focus:ring-[#FF8800]',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-9',
      md: 'text-sm px-4 py-2.5 gap-2 h-12',
      lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold h-14',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
