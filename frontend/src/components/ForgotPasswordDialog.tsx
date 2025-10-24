import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog/Dialog';
import { Input } from './Input/Input';
import { Label } from './Label/Label';
import { Button } from './Button/Button';
import { useState } from 'react';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import styles from './ForgotPasswordDialog.module.css';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCodeSent: (email: string) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordDialog({ open, onOpenChange, onCodeSent, onBackToLogin }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envio de código
    setTimeout(() => {
      setLoading(false);
      onCodeSent(email);
    }, 1500);
  };

  const handleBackToLogin = () => {
    onOpenChange(false);
    setTimeout(() => onBackToLogin(), 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className={styles.iconWrapper}>
            <KeyRound className={styles.icon} />
          </div>
          <DialogTitle>Recuperar Senha</DialogTitle>
          <DialogDescription>
            Digite seu e-mail cadastrado e enviaremos um código para você redefinir sua senha.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="forgot-email">E-mail</Label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <Input
                id="forgot-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            variant="gradient"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Código'}
          </Button>
          
          <div className={styles.footer}>
            <button type="button" onClick={handleBackToLogin} className={styles.backLink}>
              <ArrowLeft className={styles.backIcon} />
              Lembrou sua senha? Faça login
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
