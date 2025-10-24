import { useState } from 'react';
import { Input } from './Input/Input';
import { Label } from './Label/Label';
import { Button } from './Button/Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onClose, onSwitchToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={onClose}>
        ✕
      </button>
      
      <div className={styles.leftPanel}>
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800"
          alt="Biblioteca"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay} />
        <h1 className={styles.leftTitle}>Avaliação Educacional</h1>
      </div>
      
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Login</h2>
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.field}>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.options}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Lembrar-me</span>
              </label>
              <button type="button" className={styles.forgotLink}>
                Esqueci minha senha
              </button>
            </div>
            
            <Button type="submit" className={styles.submitButton}>
              Entrar
            </Button>
            
            <div className={styles.switchLink}>
              Não tem uma conta?{' '}
              <button type="button" onClick={onSwitchToSignup} className={styles.link}>
                Registre-se
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
