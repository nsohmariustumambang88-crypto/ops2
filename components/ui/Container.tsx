import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Container({
  children,
  className = '',
  size = 'xl',
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 md:px-12 lg:px-20 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
