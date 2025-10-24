import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle2 } from 'lucide-react';
import styles from './AboutPlatform.module.css';

const benefits = [
  'Feedback construtivo é a chave para aprimorar a qualidade da infraestrutura',
  'Melhoria do material didático e da experiência acadêmica',
  'Processo de avaliação seguro, anônimo e eficiente',
];

export function AboutPlatform() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.imageWrapper}
          >
            <div className={styles.imageGlow} />
            <div className={styles.imageContainer}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758270704025-0e1a1793e1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZ3JvdXB8ZW58MXx8fHwxNzYwOTA1Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Estudantes colaborando"
                className={styles.image}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.content}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>
                Sobre a Plataforma
              </h2>
              <div className={styles.titleUnderline} />
            </div>
            
            <p className={styles.description}>
              O Sistema de Avaliação Educacional é uma ferramenta desenvolvida para 
              fortalecer a comunicação entre alunos e instituições de ensino. Acreditamos que 
              o feedback construtivo é a chave para aprimorar a qualidade da infraestrutura, 
              do material didático e da experiência acadêmica como um todo. Nossa plataforma 
              garante um processo de avaliação seguro, anônimo e eficiente.
            </p>
            
            <div className={styles.benefits}>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={styles.benefitItem}
                >
                  <div className={styles.benefitIcon}>
                    <CheckCircle2 className={styles.checkIcon} />
                  </div>
                  <p className={styles.benefitText}>{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
