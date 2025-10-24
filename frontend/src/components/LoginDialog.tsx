import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog/Dialog';
import { Input } from './Input/Input';
import { Label } from './Label/Label';
import { Button } from './Button/Button';
import { useState } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import styles from './LoginDialog.module.css';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
  onLoginSuccess?: (email?: string) => void;
}

export function LoginDialog({ open, onOpenChange, onSwitchToSignup, onForgotPassword, onLoginSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    onOpenChange(false);
    if (onLoginSuccess) {
      onLoginSuccess(email);
    }
  };

  const handleSwitchToSignup = () => {
    onOpenChange(false);
    setTimeout(() => onSwitchToSignup(), 200);
  };

  const handleForgotPassword = () => {
    onOpenChange(false);
    setTimeout(() => onForgotPassword(), 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className={styles.iconWrapper}>
            <LogIn className={styles.icon} />
          </div>
          <DialogTitle>Bem-vindo de volta!</DialogTitle>
          <DialogDescription>
            Entre com suas credenciais para acessar sua conta.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="email">E-mail</Label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>
          
          <div className={styles.field}>
            <Label htmlFor="password">Senha</Label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
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
            <button type="button" onClick={handleForgotPassword} className={styles.forgotLink}>
              Esqueci minha senha
            </button>
          </div>
          
          <Button 
            type="submit"
            variant="gradient"
            className={styles.submitButton}
          >
            Entrar
          </Button>
          
          <div className={styles.footer}>
            <span className={styles.footerText}>Não tem uma conta?</span>
            <button type="button" onClick={handleSwitchToSignup} className={styles.link}>
              Registre-se
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
