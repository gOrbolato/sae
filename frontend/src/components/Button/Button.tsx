import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'gradient' | 'gradient-purple' | 'outline';
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const variantClass = styles[variant] || styles.primary;
  
  return (
    <button 
      className={`${styles.button} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
