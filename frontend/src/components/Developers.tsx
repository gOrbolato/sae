import { motion } from 'framer-motion';
import developerImage from '../assets/images/developer-placeholder.png';
import styles from './Developers.module.css';

export function Developers() {
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
            Desenvolvedores
          </h2>
          <div className={styles.titleUnderline} />
        </motion.div>
        
        <div className={styles.contentWrapper}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.card}
          >
            <div className={styles.cardContent}>
              <div className={styles.imageWrapper}>
                <img 
                  src={developerImage}
                  alt="Guilherme Orbolato"
                  className={styles.image}
                />
              </div>
              
              <div className={styles.info}>
                <h3 className={styles.name}>
                  Guilherme Orbolato
                </h3>
                <p className={styles.role}>
                  Desenvolvedor Full Stack
                </p>
                <p className={styles.description}>
                  Responsável pela concepção, desenvolvimento e implementação de todas as 
                  funcionalidades do sistema, desde o backend e banco de dados até a interface do 
                  usuário no frontend.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
