import React from 'react';
import { cn } from './utils';

export type CardVariant = 'surface' | 'elevated' | 'outlined';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'surface',
  hoverEffect = false,
  children,
  ...props
}) => {
  const variants: Record<CardVariant, string> = {
    surface: 'bg-[#15171E] border border-[#272B35]',
    elevated: 'bg-[#1D2029] border border-[#272B35] shadow-md',
    outlined: 'bg-[#15171E] border border-[#272B35]',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 text-white transition-all duration-200',
        variants[variant],
        hoverEffect && 'hover:border-[#FF8800]/40 hover:shadow-lg hover:shadow-[#FF8800]/5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';
