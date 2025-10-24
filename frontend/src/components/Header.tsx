import { GraduationCap } from 'lucide-react';
import { Button } from './Button/Button';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.header}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <GraduationCap className={styles.icon} />
            </div>
            <h1 className={styles.logoText}>
              Avaliação Educacional
            </h1>
          </div>
          
          <div className={styles.actions}>
            <Button 
              variant="ghost" 
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Button 
              variant="gradient"
              onClick={onSignupClick}
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
