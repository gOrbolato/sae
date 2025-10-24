import type { LabelHTMLAttributes, ReactNode } from 'react';
import styles from './Label.module.css';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={`${styles.label} ${className}`} {...props}>
      {children}
    </label>
  );
}
