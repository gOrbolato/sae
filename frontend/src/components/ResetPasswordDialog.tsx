import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog/Dialog';
import { Input } from './Input/Input';
import { Label } from './Label/Label';
import { Button } from './Button/Button';
import { useState } from 'react';
import { KeyRound, Hash, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import styles from './ResetPasswordDialog.module.css';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ResetPasswordDialog({ open, onOpenChange, email, onSuccess, onBack }: ResetPasswordDialogProps) {
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular validação de código
    setTimeout(() => {
      setLoading(false);
      setStep('password');
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    
    // Simular redefinição de senha
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  const handleBack = () => {
    if (step === 'password') {
      setStep('code');
    } else {
      onOpenChange(false);
      setTimeout(() => onBack(), 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className={styles.iconWrapper}>
            <KeyRound className={styles.icon} />
          </div>
          <DialogTitle>Recuperar Senha</DialogTitle>
          {step === 'code' ? (
            <>
              <div className={styles.successAlert}>
                <CheckCircle2 className={styles.successIcon} />
                <span>Se o e-mail estiver cadastrado, um código foi enviado.</span>
              </div>
              <DialogDescription>
                Um código foi enviado para <strong>{email}</strong>. Digite o código abaixo para continuar.
              </DialogDescription>
            </>
          ) : (
            <DialogDescription>
              Agora defina sua nova senha.
            </DialogDescription>
          )}
        </DialogHeader>
        
        {step === 'code' ? (
          <form onSubmit={handleValidateCode} className={styles.form}>
            <div className={styles.field}>
              <Label htmlFor="recovery-code">Código de Recuperação</Label>
              <div className={styles.inputWrapper}>
                <Hash className={styles.inputIcon} />
                <Input
                  id="recovery-code"
                  type="text"
                  placeholder="Digite o código"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
              {loading ? 'Validando...' : 'Validar Código'}
            </Button>
            
            <div className={styles.footer}>
              <button type="button" onClick={handleBack} className={styles.backLink}>
                <ArrowLeft className={styles.backIcon} />
                Voltar
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.field}>
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
            
            <div className={styles.footer}>
              <button type="button" onClick={handleBack} className={styles.backLink}>
                <ArrowLeft className={styles.backIcon} />
                Voltar
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
