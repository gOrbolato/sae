import { ArrowLeft, Star, TrendingUp } from 'lucide-react';
import { Button } from './Button/Button';
import { motion } from 'framer-motion';
import styles from './EvaluationDetails.module.css';

interface EvaluationDetailsProps {
  onBack: () => void;
  evaluationData: {
    date: string;
    responses: {
      category: string;
      question: string;
      rating: number;
      comment: string;
    }[];
  };
}

export function EvaluationDetails({ onBack, evaluationData }: EvaluationDetailsProps) {
  // Calculate average rating
  const totalRatings = evaluationData.responses.reduce((acc, item) => acc + item.rating, 0);
  const averageRating = (totalRatings / evaluationData.responses.length).toFixed(2);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Detalhes da Avaliação</h1>
          <Button
            variant="outline"
            onClick={onBack}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.backIcon} />
            Voltar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <motion.div
          className={styles.mainCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Evaluation Title */}
          <div className={styles.evaluationHeader}>
            <h2 className={styles.evaluationTitle}>
              Avaliação de {evaluationData.date}
            </h2>
            <div className={styles.titleUnderline}></div>
          </div>

          {/* Average Score */}
          <div className={styles.averageSection}>
            <div className={styles.averageCard}>
              <TrendingUp className={styles.averageIcon} />
              <div className={styles.averageContent}>
                <span className={styles.averageLabel}>Média Final</span>
                <span className={styles.averageValue}>{averageRating}</span>
              </div>
              <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`${styles.star} ${
                      star <= Math.round(parseFloat(averageRating))
                        ? styles.starFilled
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Responses Grid */}
          <div className={styles.responsesGrid}>
            {evaluationData.responses.map((response, index) => (
              <motion.div
                key={index}
                className={styles.responseCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.responseHeader}>
                  <h3 className={styles.questionTitle}>{response.question}</h3>
                  <div className={styles.ratingBadge}>
                    <Star className={styles.ratingIcon} />
                    <span className={styles.ratingText}>
                      {response.rating}/5
                    </span>
                  </div>
                </div>
                
                {response.comment && (
                  <div className={styles.commentSection}>
                    <p className={styles.comment}>"{response.comment}"</p>
                  </div>
                )}
                
                {/* Category Tag */}
                <div className={styles.categoryTag}>
                  {response.category}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
