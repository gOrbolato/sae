import { useState } from 'react';
import { Menu, Plus, Settings, LogOut, FileText, Clock, CheckCircle2, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Button } from './Button/Button';
import { EvaluationForm } from './EvaluationForm';
import { StudentSettings } from './StudentSettings';
import { EvaluationDetails } from './EvaluationDetails';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import styles from './StudentDashboard.module.css';

interface StudentDashboardProps {
  onLogout: () => void;
}

interface Evaluation {
  id: string;
  title: string;
  subject: string;
  date: string;
  status: 'pending' | 'completed';
  score?: number;
  data?: any;
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [evaluationFormOpen, setEvaluationFormOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  
  const userData = {
    name: 'Guilherme Vinicius Araujo Orbolato',
    email: 'guilherme.orbolato@fatec.sp.gov.br',
    institution: 'Faculdade de Tecnologia de Presidente Prudente',
    course: 'Análise e Desenvolvimento de Sistemas',
    period: 'Noturno',
    ra: '1570482311039',
  };

  const stats = [
    {
      icon: FileText,
      label: 'Total de Avaliações',
      value: evaluations.length.toString(),
      color: 'blue',
    },
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: evaluations.filter(e => e.status === 'completed').length.toString(),
      color: 'green',
    },
    {
      icon: Clock,
      label: 'Pendentes',
      value: evaluations.filter(e => e.status === 'pending').length.toString(),
      color: 'orange',
    },
    {
      icon: TrendingUp,
      label: 'Média Geral',
      value: evaluations.length > 0 
        ? (evaluations.reduce((acc, e) => acc + (e.score || 0), 0) / evaluations.filter(e => e.score).length).toFixed(1)
        : '-',
      color: 'purple',
    },
  ];

  const handleNewEvaluation = () => {
    setEvaluationFormOpen(true);
  };

  const handleSubmitEvaluation = (data: any) => {
    console.log('Evaluation submitted:', data);
    
    // Transform evaluation data to flat structure
    const responses = data.flatMap((category: any) =>
      category.questions.map((q: any) => ({
        category: category.category,
        question: q.text,
        rating: q.rating,
        comment: q.comment,
      }))
    );
    
    // Calculate average score
    const totalRatings = responses.reduce((acc: number, item: any) => acc + item.rating, 0);
    const averageScore = totalRatings / responses.length;
    
    // Add new evaluation to the list
    const newEvaluation: Evaluation = {
      id: Date.now().toString(),
      title: 'Avaliação Institucional',
      subject: 'Avaliação Geral',
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'completed',
      score: parseFloat(averageScore.toFixed(2)),
      data: {
        date: new Date().toLocaleDateString('pt-BR'),
        responses,
      },
    };
    
    setEvaluations([newEvaluation, ...evaluations]);
    setEvaluationFormOpen(false);
    
    toast.success('Avaliação enviada com sucesso!', {
      description: 'Obrigado por sua participação.',
    });
  };
  
  const handleViewDetails = (evaluationId: string) => {
    setSelectedEvaluationId(evaluationId);
  };

  // Show evaluation details
  if (selectedEvaluationId) {
    const selectedEvaluation = evaluations.find(e => e.id === selectedEvaluationId);
    if (selectedEvaluation && selectedEvaluation.data) {
      return (
        <EvaluationDetails
          onBack={() => setSelectedEvaluationId(null)}
          evaluationData={selectedEvaluation.data}
        />
      );
    }
  }

  // Show settings page
  if (showSettings) {
    return (
      <StudentSettings 
        onBack={() => setShowSettings(false)}
        userData={userData}
      />
    );
  }

  return (
    <>
      {evaluationFormOpen && (
        <EvaluationForm
          onClose={() => setEvaluationFormOpen(false)}
          onSubmit={handleSubmitEvaluation}
        />
      )}
      
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <Award className={styles.logoIcon} />
              <span className={styles.logoText}>Avaliação Educacional</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <Button
              variant="gradient"
              onClick={handleNewEvaluation}
              className={styles.newEvaluationButton}
            >
              <Plus className={styles.buttonIcon} />
              Nova Avaliação
            </Button>

            <div className={styles.menuWrapper}>
              <button 
                className={styles.menuButton}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className={styles.menuIcon} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div 
                      className={styles.menuOverlay}
                      onClick={() => setMenuOpen(false)}
                    />
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <button 
                        className={styles.dropdownItem}
                        onClick={() => {
                          setShowSettings(true);
                          setMenuOpen(false);
                        }}
                      >
                        <Settings className={styles.dropdownIcon} />
                        Configurações
                      </button>
                      <div className={styles.dropdownDivider} />
                      <button 
                        className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                        onClick={onLogout}
                      >
                        <LogOut className={styles.dropdownIcon} />
                        Sair
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Welcome Section */}
          <div className={styles.welcome}>
            <h1 className={styles.welcomeTitle}>Minhas Avaliações</h1>
            <p className={styles.welcomeSubtitle}>
              Gerencie suas avaliações e acompanhe seu desempenho
            </p>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className={`${styles.statCard} ${styles[`statCard${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`]}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.statIcon}>
                    <Icon />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Evaluations List */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Avaliações Recentes</h2>
            </div>

            {evaluations.length === 0 ? (
              <motion.div 
                className={styles.emptyState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.emptyStateIcon}>
                  <BookOpen />
                </div>
                <h3 className={styles.emptyStateTitle}>Ainda não há nenhuma avaliação.</h3>
                <p className={styles.emptyStateDescription}>
                  Clique no botão "Nova Avaliação" para começar
                </p>
                <Button
                  variant="gradient"
                  onClick={handleNewEvaluation}
                  className={styles.emptyStateButton}
                >
                  <Plus className={styles.buttonIcon} />
                  Criar minha primeira avaliação
                </Button>
              </motion.div>
            ) : (
              <div className={styles.evaluationsList}>
                {evaluations.map((evaluation) => (
                  <motion.div 
                    key={evaluation.id} 
                    className={styles.evaluationCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.evaluationHeader}>
                      <h3 className={styles.evaluationTitle}>{evaluation.title}</h3>
                      <span className={`${styles.evaluationStatus} ${styles[`status${evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}`]}`}>
                        {evaluation.status === 'completed' ? 'Concluída' : 'Pendente'}
                      </span>
                    </div>
                    <p className={styles.evaluationSubject}>{evaluation.subject}</p>
                    <div className={styles.evaluationFooter}>
                      <div className={styles.evaluationInfo}>
                        <span className={styles.evaluationDate}>{evaluation.date}</span>
                        {evaluation.score && (
                          <span className={styles.evaluationScore}>Média: {evaluation.score}</span>
                        )}
                      </div>
                      {evaluation.data && (
                        <Button
                          variant="outline"
                          onClick={() => handleViewDetails(evaluation.id)}
                          className={styles.detailsButton}
                        >
                          Ver Detalhes
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
