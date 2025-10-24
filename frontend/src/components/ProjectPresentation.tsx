import { motion } from 'framer-motion';
import styles from './ProjectPresentation.module.css';

export function ProjectPresentation() {
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
            Apresentação do Projeto
          </h2>
          <div className={styles.titleUnderline} />
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.card}
        >
          <p className={styles.description}>
            Este sistema é o resultado de um Trabalho de Conclusão de Curso (TCC) dedicado a 
            aprimorar a comunicação e o feedback no ambiente educacional. O objetivo foi 
            desenvolver uma ferramenta robusta, segura e de fácil utilização para alunos e 
            administradores, promovendo um ciclo de melhoria contínua nas instituições de ensino.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
