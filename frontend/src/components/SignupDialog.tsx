import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog/Dialog';
import { Input } from './Input/Input';
import { Label } from './Label/Label';
import { Select } from './Select/Select';
import { Button } from './Button/Button';
import { useState } from 'react';
import { UserPlus, Mail, Lock, User, CreditCard, Hash, Calendar, GraduationCap, BookOpen, Clock, CalendarCheck } from 'lucide-react';
import styles from './SignupDialog.module.css';

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function SignupDialog({ open, onOpenChange, onSwitchToLogin }: SignupDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    ra: '',
    age: '',
    institution: '',
    course: '',
    period: '',
    semester: '',
    expectedCompletion: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt:', formData);
  };

  const handleSwitchToLogin = () => {
    onOpenChange(false);
    setTimeout(() => onSwitchToLogin(), 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className={styles.iconWrapper}>
            <UserPlus className={styles.icon} />
          </div>
          <DialogTitle>Crie sua conta</DialogTitle>
          <DialogDescription>
            Junte-se a nós e contribua para melhorar a educação.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.scrollArea}>
            <div className={styles.field}>
              <Label htmlFor="name">Nome Completo</Label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="signup-email">E-mail</Label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <Label htmlFor="cpf">CPF</Label>
              <div className={styles.inputWrapper}>
                <CreditCard className={styles.inputIcon} />
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.twoColumns}>
              <div className={styles.field}>
                <Label htmlFor="ra">RA</Label>
                <div className={styles.inputWrapper}>
                  <Hash className={styles.inputIcon} />
                  <Input
                    id="ra"
                    name="ra"
                    type="text"
                    placeholder="Seu RA"
                    value={formData.ra}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="age">Idade</Label>
                <div className={styles.inputWrapper}>
                  <Calendar className={styles.inputIcon} />
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Sua idade"
                    value={formData.age}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="institution">Instituição</Label>
              <div className={styles.inputWrapper}>
                <GraduationCap className={styles.inputIcon} />
                <Input
                  id="institution"
                  name="institution"
                  type="text"
                  placeholder="Nome da sua instituição"
                  value={formData.institution}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="course">Curso</Label>
              <div className={styles.inputWrapper}>
                <BookOpen className={styles.inputIcon} />
                <Input
                  id="course"
                  name="course"
                  type="text"
                  placeholder="Nome do seu curso"
                  value={formData.course}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.twoColumns}>
              <div className={styles.field}>
                <Label htmlFor="period">Período</Label>
                <div className={styles.inputWrapper}>
                  <Clock className={styles.inputIcon} />
                  <Select
                    id="period"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="noturno">Noturno</option>
                    <option value="integral">Integral</option>
                  </Select>
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="semester">Semestre</Label>
                <div className={styles.inputWrapper}>
                  <Hash className={styles.inputIcon} />
                  <Input
                    id="semester"
                    name="semester"
                    type="text"
                    placeholder="Ex: 8º"
                    value={formData.semester}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <Label htmlFor="expectedCompletion">Previsão de Término do Curso</Label>
              <div className={styles.inputWrapper}>
                <CalendarCheck className={styles.inputIcon} />
                <Input
                  id="expectedCompletion"
                  name="expectedCompletion"
                  type="month"
                  placeholder="mm/aaaa"
                  value={formData.expectedCompletion}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="signup-password">Senha</Label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit"
            variant="gradient-purple"
            className={styles.submitButton}
          >
            Criar Conta
          </Button>
          
          <div className={styles.footer}>
            <span className={styles.footerText}>Já tem uma conta?</span>
            <button type="button" onClick={handleSwitchToLogin} className={styles.link}>
              Faça login
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
