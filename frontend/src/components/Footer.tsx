import { motion } from 'framer-motion';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={styles.footer}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>
            Plataforma de Avaliação Educacional
          </p>
          <p className={styles.copyright}>
            © 2025 Todos os direitos reservados
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
