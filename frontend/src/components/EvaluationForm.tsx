import { useState } from 'react';
import { X, AlertCircle, Send, Frown, Meh, Smile, Laugh, CheckCircle } from 'lucide-react';
import { Button } from './Button/Button';
import { motion } from 'framer-motion';
import styles from './EvaluationForm.module.css';

interface EvaluationFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface Question {
  id: string;
  category: string;
  questions: {
    id: string;
    text: string;
    rating: number;
    comment: string;
  }[];
}

const ratingEmojis = [
  { value: 1, icon: Frown, label: 'Muito insatisfeito', color: '#ef4444' },
  { value: 2, icon: Frown, label: 'Insatisfeito', color: '#f97316' },
  { value: 3, icon: Meh, label: 'Neutro', color: '#eab308' },
  { value: 4, icon: Smile, label: 'Satisfeito', color: '#84cc16' },
  { value: 5, icon: Laugh, label: 'Muito satisfeito', color: '#22c55e' },
];

export function EvaluationForm({ onClose, onSubmit }: EvaluationFormProps) {
  const [evaluationData, setEvaluationData] = useState<Question[]>([
    {
      id: 'instituicao',
      category: 'Avaliação da Instituição',
      questions: [
        { id: 'infraestrutura', text: 'Infraestrutura geral (salas, laboratórios, etc.)', rating: 0, comment: '' },
        { id: 'limpeza', text: 'Limpeza e conservação', rating: 0, comment: '' },
        { id: 'seguranca', text: 'Segurança do campus', rating: 0, comment: '' },
      ],
    },
    {
      id: 'coordenacao',
      category: 'Coordenação',
      questions: [
        { id: 'acessibilidade_coord', text: 'Acessibilidade e prestatividade da Coordenação', rating: 0, comment: '' },
        { id: 'acessibilidade_dir', text: 'Acessibilidade e prestatividade da Direção', rating: 0, comment: '' },
      ],
    },
    {
      id: 'acessibilidade',
      category: 'Acessibilidade e Inclusão',
      questions: [
        { id: 'localizacao', text: 'Localização e facilidade de acesso à instituição', rating: 0, comment: '' },
        { id: 'deficiencia', text: 'Acessibilidade para pessoas com deficiência', rating: 0, comment: '' },
      ],
    },
    {
      id: 'recursos',
      category: 'Recursos e Equipamentos',
      questions: [
        { id: 'equipamentos', text: 'Qualidade e modernidade dos equipamentos', rating: 0, comment: '' },
        { id: 'biblioteca', text: 'Qualidade do acervo da biblioteca', rating: 0, comment: '' },
      ],
    },
    {
      id: 'curso',
      category: 'Avaliação do Curso',
      questions: [
        { id: 'didatica', text: 'Didática e clareza dos professores', rating: 0, comment: '' },
        { id: 'relevancia', text: 'Relevância e atualização do conteúdo das matérias', rating: 0, comment: '' },
        { id: 'dinamismo', text: 'Dinamismo dos professores na aplicação das matérias', rating: 0, comment: '' },
        { id: 'disponibilidade', text: 'Disponibilidade dos professores para tirar dúvidas', rating: 0, comment: '' },
      ],
    },
  ]);

  const handleRatingChange = (categoryId: string, questionId: string, rating: number) => {
    setEvaluationData((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              questions: category.questions.map((q) =>
                q.id === questionId ? { ...q, rating } : q
              ),
            }
          : category
      )
    );
  };

  const handleCommentChange = (categoryId: string, questionId: string, comment: string) => {
    setEvaluationData((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              questions: category.questions.map((q) =>
                q.id === questionId ? { ...q, comment } : q
              ),
            }
          : category
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se todas as perguntas foram respondidas
    const allAnswered = evaluationData.every(category =>
      category.questions.every(q => q.rating > 0)
    );
    
    if (!allAnswered) {
      alert('Por favor, avalie todos os itens antes de enviar.');
      return;
    }
    
    onSubmit(evaluationData);
  };
  
  const getTotalQuestions = () => {
    return evaluationData.reduce((sum, category) => sum + category.questions.length, 0);
  };
  
  const getAnsweredQuestions = () => {
    return evaluationData.reduce((sum, category) => {
      return sum + category.questions.filter(q => q.rating > 0).length;
    }, 0);
  };
  
  const progress = Math.round((getAnsweredQuestions() / getTotalQuestions()) * 100);

  return (
    <div className={styles.overlay}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Nova Avaliação</h1>
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className={styles.headerCancelButton}
            >
              Cancelar
            </Button>
          </div>
        </div>

        {/* Alert */}
        <div className={styles.alert}>
          <div className={styles.alertWrapper}>
            <h3 className={styles.alertTitle}>Aviso Importante</h3>
            <p className={styles.alertText}>
              Após o envio, sua avaliação <strong>não poderá ser editada no prazo de 60 dias</strong>. 
              Você só poderá enviar uma nova avaliação daqui a <strong>60 dias</strong>. 
              Responda com atenção e honestidade.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <motion.div 
            className={styles.progressWrapper}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className={styles.progressInfo}>
              <span className={styles.progressText}>
                Progresso: {getAnsweredQuestions()} de {getTotalQuestions()} perguntas
              </span>
              <span className={styles.progressPercentage}>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.scrollArea}>
            {evaluationData.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                className={styles.section}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: categoryIndex * 0.08,
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{category.category}</h2>
                  {category.questions.every(q => q.rating > 0) && (
                    <motion.div
                      className={styles.sectionComplete}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle className={styles.sectionCompleteIcon} />
                      <span>Completo</span>
                    </motion.div>
                  )}
                </div>
                
                {category.questions.map((question) => (
                  <div key={question.id} className={styles.question}>
                    <h3 className={styles.questionText}>{question.text}</h3>
                    
                    {/* Rating Emojis */}
                    <div className={styles.ratingContainer}>
                      {ratingEmojis.map((emoji) => {
                        const EmojiIcon = emoji.icon;
                        const isSelected = question.rating === emoji.value;
                        
                        return (
                          <button
                            key={emoji.value}
                            type="button"
                            className={`${styles.ratingButton} ${isSelected ? styles.ratingButtonActive : ''}`}
                            onClick={() => handleRatingChange(category.id, question.id, emoji.value)}
                            title={emoji.label}
                            style={{
                              '--emoji-color': emoji.color,
                            } as React.CSSProperties}
                          >
                            <EmojiIcon className={styles.ratingIcon} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Comment */}
                    <div className={styles.commentSection}>
                      <label className={styles.commentLabel}>
                        Sua opinião descritiva é fundamental para a melhoria contínua:
                      </label>
                      <textarea
                        className={styles.textarea}
                        placeholder="Descreva os pontos positivos e/ou negativos..."
                        value={question.comment}
                        onChange={(e) => handleCommentChange(category.id, question.id, e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className={`${styles.submitButton} ${progress === 100 ? styles.submitButtonReady : ''}`}
              disabled={progress === 0}
            >
              <Send className={styles.submitIcon} />
              {progress === 100 ? 'Enviar Avaliação' : `Enviar (${progress}%)`}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
