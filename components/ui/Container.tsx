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
    xl: 'max-w-[1180px]',
  };

  return (
    <div className={`mx-auto px-7 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
