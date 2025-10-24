import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { AboutPlatform } from './components/AboutPlatform';
import { Developers } from './components/Developers';
import { ProjectPresentation } from './components/ProjectPresentation';
import { Footer } from './components/Footer';
import { LoginDialog } from './components/LoginDialog';
import { SignupDialog } from './components/SignupDialog';
import { ForgotPasswordDialog } from './components/ForgotPasswordDialog';
import { ResetPasswordDialog } from './components/ResetPasswordDialog';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster, toast } from 'sonner';
import styles from './App.module.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleLogin = (email?: string) => {
    setLoginOpen(false);
    setIsLoggedIn(true);
    
    // Simula login de admin se o email contiver 'admin'
    if (email && email.toLowerCase().includes('admin')) {
      setUserRole('admin');
      toast.success('Login Administrativo realizado!', {
        description: 'Bem-vindo ao painel de controle!',
      });
    } else {
      setUserRole('student');
      toast.success('Login realizado com sucesso!', {
        description: 'Bem-vindo de volta!',
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('student');
    toast.info('Você saiu da sua conta', {
      description: 'Até logo!',
    });
  };

  if (isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" richColors />
        {userRole === 'admin' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <StudentDashboard onLogout={handleLogout} />
        )}
      </>
    );
  }

  return (
    <div className={styles.app}>
      <Toaster position="top-right" richColors />
      <Header 
        onLoginClick={() => setLoginOpen(true)}
        onSignupClick={() => setSignupOpen(true)}
      />
      <HeroSection />
      <HowItWorks />
      <AboutPlatform />
      <Developers />
      <ProjectPresentation />
      <Footer />
      
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
        onForgotPassword={() => {
          setLoginOpen(false);
          setForgotPasswordOpen(true);
        }}
        onLoginSuccess={handleLogin}
      />
      
      <SignupDialog 
        open={signupOpen} 
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
      
      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen}
        onCodeSent={(email) => {
          setRecoveryEmail(email);
          setForgotPasswordOpen(false);
          setResetPasswordOpen(true);
        }}
        onBackToLogin={() => {
          setForgotPasswordOpen(false);
          setLoginOpen(true);
        }}
      />
      
      <ResetPasswordDialog 
        open={resetPasswordOpen} 
        onOpenChange={setResetPasswordOpen}
        email={recoveryEmail}
        onSuccess={() => {
          setResetPasswordOpen(false);
          toast.success('Senha redefinida com sucesso!', {
            description: 'Você já pode fazer login com sua nova senha.',
          });
          setTimeout(() => setLoginOpen(true), 500);
        }}
        onBack={() => {
          setResetPasswordOpen(false);
          setForgotPasswordOpen(true);
        }}
      />
    </div>
  );
}
