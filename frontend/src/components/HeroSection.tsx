import { Search } from 'lucide-react';
import { Input } from './Input/Input';
import { Button } from './Button/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <section className={styles.section}>
      <div className={styles.bgGradient} />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear" 
        }}
        className={styles.bgShape1}
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "linear" 
        }}
        className={styles.bgShape2}
      />
      
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={styles.title}>
              Consulte e Transforme a Educação
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.subtitle}
          >
            Pesquise por instituição, curso ou cidade para ver avaliações. Se é aluno, 
            contribua de forma anônima para a melhoria do seu ensino.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.searchWrapper}
          >
            <div className={styles.searchBox}>
              <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} />
                <Input 
                  type="text"
                  placeholder="Digite o nome da instituição, curso ou cidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className={styles.searchInput}
                />
              </div>
              <Button 
                variant="gradient"
                onClick={handleSearch}
                className={styles.searchButton}
              >
                Buscar
              </Button>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={styles.hint}
          >
            Use a barra de busca para encontrar instituições.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
