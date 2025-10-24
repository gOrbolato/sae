import { useState } from 'react';
import { Input } from './Input/Input';
import { Label } from './Label/Label';
import { Select } from './Select/Select';
import { Button } from './Button/Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import styles from './SignupPage.module.css';

interface SignupPageProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onClose, onSwitchToLogin }: SignupPageProps) {
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
          <h2 className={styles.title}>Crie sua Conta</h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className={styles.twoColumns}>
              <div className={styles.field}>
                <Label htmlFor="ra">RA</Label>
                <Input
                  id="ra"
                  name="ra"
                  type="text"
                  value={formData.ra}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.field}>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="institution">Instituição</Label>
              <Input
                id="institution"
                name="institution"
                type="text"
                placeholder="Digite o nome da sua instituição"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                name="course"
                type="text"
                placeholder="Digite o nome do seu curso"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.twoColumns}>
              <div className={styles.field}>
                <Label htmlFor="period">Período</Label>
                <Select
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="matutino">Matutino</option>
                  <option value="vespertino">Vespertino</option>
                  <option value="noturno">Noturno</option>
                  <option value="integral">Integral</option>
                </Select>
              </div>
              
              <div className={styles.field}>
                <Label htmlFor="semester">Semestre</Label>
                <Input
                  id="semester"
                  name="semester"
                  type="text"
                  placeholder="Ex: 8º"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="expectedCompletion">Previsão de Término do Curso</Label>
              <Input
                id="expectedCompletion"
                name="expectedCompletion"
                type="month"
                placeholder="mm/aaaa"
                value={formData.expectedCompletion}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className={styles.submitButton}>
              Registrar
            </Button>
            
            <div className={styles.switchLink}>
              Já tem uma conta?{' '}
              <button type="button" onClick={onSwitchToLogin} className={styles.link}>
                Faça login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
