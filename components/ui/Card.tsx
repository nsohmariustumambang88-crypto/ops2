import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'outlined';
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = true,
}: CardProps) {
  const baseStyles = 'rounded-card transition-all duration-300';

  const variants = {
    default: 'bg-white border border-border shadow-light',
    light: 'bg-light-gray border-0',
    outlined: 'bg-white border-2 border-primary',
  };

  const hoverStyles = hover ? 'hover:shadow-medium hover:translate-y-[-4px]' : '';

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}
