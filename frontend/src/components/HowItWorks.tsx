import { Search, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: 1,
    title: 'Pesquisa Aberta',
    description: 'Utilize nossa barra de pesquisa para encontrar avaliações sobre instituições, cursos e localidades de forma livre e gratuita.',
    icon: Search,
    color: 'blue',
  },
  {
    number: 2,
    title: 'Avaliação Anônima',
    description: 'Para contribuir, crie sua conta e responda aos questionários. Sua identidade é sempre preservada para que você se expresse livremente.',
    icon: ShieldCheck,
    color: 'purple',
  },
  {
    number: 3,
    title: 'Análise e Melhorias',
    description: 'As avaliações são compiladas e analisadas pela administração para identificar pontos de melhoria e implementar mudanças efetivas.',
    icon: TrendingUp,
    color: 'pink',
  },
];

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <h2 className={styles.title}>
            Como Funciona?
          </h2>
          <div className={styles.titleUnderline} />
        </motion.div>
        
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={styles.card}
            >
              <div className={`${styles.accentBar} ${styles[step.color]}`} />
              
              <div className={`${styles.iconWrapper} ${styles[step.color]}`}>
                <step.icon className={styles.icon} />
              </div>
              
              <h3 className={styles.cardTitle}>
                {step.number}. {step.title}
              </h3>
              <p className={styles.cardDescription}>
                {step.description}
              </p>
              
              <div className={`${styles.numberBadge} ${styles[step.color]}`}>
                <span>{step.number}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
