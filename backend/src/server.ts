import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar rotas
import authRoutes from './routes/AuthRoutes';
import userRoutes from './routes/UserRoutes';
import institutionRoutes from './routes/InstitutionRoutes';
import courseRoutes from './routes/CourseRoutes';
import analysisRoutes from './routes/AnalysisRoutes';
import evaluationRoutes from './routes/EvaluationRoutes';

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Teste de conexão com o banco de dados
db.getConnection()
  .then(connection => {
    console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados MySQL:', err);
  });

app.get('/', (req, res) => {
  res.send('Backend da Plataforma de Avaliação Educacional está rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
