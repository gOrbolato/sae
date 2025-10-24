import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileDown,
  Sparkles,
  Target,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Building2,
  GraduationCap,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Button } from './Button/Button';

import { Select } from './Select/Select';
import { toast } from 'sonner';
import styles from './AdminReportsSection.module.css';

interface AdminReportsSectionProps {
  institutionsList: { id: number; name: string }[];
  coursesList: { id: number; name: string }[];
}

export function AdminReportsSection({ institutionsList, coursesList }: AdminReportsSectionProps) {
  const [reportFilterInstitution, setReportFilterInstitution] = useState('all');
  const [reportFilterCourse, setReportFilterCourse] = useState('all');
  const [reportFilterPeriod, setReportFilterPeriod] = useState('last_6_months');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'bars' | 'line' | 'radar' | 'pie'>('bars');

  // Dados da análise (mock)
  const analysisData = {
    totalAvaliacoes: 247,
    mediaGeral: 3.89,
    taxaResposta: 78.5,
    tendencia: '+12%',
    mediasPorPergunta: [
      { pergunta: 'Infraestrutura', nota: 4.2, categoria: 'Instituição', fullMark: 5 },
      { pergunta: 'Localização', nota: 3.8, categoria: 'Instituição', fullMark: 5 },
      { pergunta: 'Biblioteca', nota: 4.5, categoria: 'Instituição', fullMark: 5 },
      { pergunta: 'Dinâmica Prof.', nota: 4.1, categoria: 'Curso', fullMark: 5 },
      { pergunta: 'Coordenação', nota: 3.9, categoria: 'Curso', fullMark: 5 },
      { pergunta: 'Acessibilidade', nota: 3.5, categoria: 'Instituição', fullMark: 5 },
      { pergunta: 'Didática', nota: 4.3, categoria: 'Curso', fullMark: 5 },
      { pergunta: 'Direção', nota: 3.7, categoria: 'Instituição', fullMark: 5 },
      { pergunta: 'Disp. Prof.', nota: 4.6, categoria: 'Curso', fullMark: 5 },
      { pergunta: 'Equipamentos', nota: 3.6, categoria: 'Instituição', fullMark: 5 },
      { pergunta: 'Conteúdo', nota: 4.0, categoria: 'Curso', fullMark: 5 },
    ],
    distribuicaoNotas: [
      { nota: '1 ★', quantidade: 12, percentual: 4.9, fill: '#ef4444' },
      { nota: '2 ★', quantidade: 28, percentual: 11.3, fill: '#f97316' },
      { nota: '3 ★', quantidade: 71, percentual: 28.7, fill: '#f59e0b' },
      { nota: '4 ★', quantidade: 89, percentual: 36.0, fill: '#84cc16' },
      { nota: '5 ★', quantidade: 47, percentual: 19.1, fill: '#22c55e' },
    ],
    evolucaoTemporal: [
      { mes: 'Jun/24', media: 3.5 },
      { mes: 'Jul/24', media: 3.7 },
      { mes: 'Ago/24', media: 3.6 },
      { mes: 'Set/24', media: 3.9 },
      { mes: 'Out/24', media: 4.1 },
      { mes: 'Nov/24', media: 3.9 },
    ],
  };

  const handleGenerateAnalysis = () => {
    if (reportFilterInstitution === 'all' && reportFilterCourse === 'all') {
      toast.error('Selecione pelo menos uma instituição ou curso');
      return;
    }

    setAnalysisLoading(true);
    setTimeout(() => {
      setShowAnalysis(true);
      setAnalysisLoading(false);
      toast.success('Análise gerada com sucesso!');
    }, 1500);
  };

  const handleClearFilters = () => {
    setReportFilterInstitution('all');
    setReportFilterCourse('all');
    setReportFilterPeriod('last_6_months');
    setShowAnalysis(false);
  };

  const handleDownloadPDF = () => {
    toast.success('Relatório PDF baixado com sucesso!');
  };

  // Análise Escrita Automática
  const escritaAnalise = {
    resumo: `Com base em ${analysisData.totalAvaliacoes} avaliações analisadas, a média geral de satisfação é de ${analysisData.mediaGeral.toFixed(2)} estrelas (de 5), representando uma tendência positiva de ${analysisData.tendencia} em relação ao período anterior.`,
    
    pontosFortes: [
      'Disponibilidade dos Professores (4.6/5) - Destaque máximo',
      'Biblioteca e Acervo (4.5/5) - Excelente avaliação',
      'Didática e Metodologia (4.3/5) - Bem avaliado',
      'Infraestrutura Geral (4.2/5) - Acima da média',
    ],
    
    pontosFracos: [
      'Acessibilidade (3.5/5) - Requer atenção imediata',
      'Equipamentos e Laboratórios (3.6/5) - Abaixo do esperado',
      'Direção Institucional (3.7/5) - Margem para melhoria',
      'Localização e Acesso (3.8/5) - Pode ser otimizado',
    ],
    
    insights: [
      '55% das avaliações são de 4 ou 5 estrelas, indicando satisfação geral',
      'Aumento consistente na média nos últimos 6 meses (+0.6 pontos)',
      'Categoria "Curso" (4.2 média) supera "Instituição" (3.9 média)',
      'Taxa de resposta de 78.5% demonstra engajamento elevado',
    ],
  };

  // Recomendações de Melhoria Priorizadas
  const recomendacoes = [
    {
      prioridade: 'ALTA',
      area: 'Acessibilidade',
      nota: 3.5,
      acao: 'Investir em rampas, elevadores e sinalização tátil',
      impacto: 'Melhoria estimada: +0.8 pontos',
      prazo: 'Curto prazo (3-6 meses)',
      cor: '#ef4444'
    },
    {
      prioridade: 'ALTA',
      area: 'Equipamentos',
      nota: 3.6,
      acao: 'Renovar computadores e equipamentos de laboratório',
      impacto: 'Melhoria estimada: +0.7 pontos',
      prazo: 'Médio prazo (6-12 meses)',
      cor: '#f97316'
    },
    {
      prioridade: 'MÉDIA',
      area: 'Direção',
      nota: 3.7,
      acao: 'Aumentar canais de comunicação e transparência',
      impacto: 'Melhoria estimada: +0.5 pontos',
      prazo: 'Curto prazo (1-3 meses)',
      cor: '#f59e0b'
    },
    {
      prioridade: 'BAIXA',
      area: 'Localização',
      nota: 3.8,
      acao: 'Melhorar sinalização externa e parcerias de transporte',
      impacto: 'Melhoria estimada: +0.3 pontos',
      prazo: 'Longo prazo (12+ meses)',
      cor: '#84cc16'
    },
  ];

  const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.container}
    >
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Análise de Avaliações</h1>
          <p className={styles.subtitle}>
            Visualize análises detalhadas, insights e relatórios de melhoria
          </p>
        </div>
      </div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={styles.filtersCard}
      >
        <div className={styles.filtersHeader}>
          <h3 className={styles.filtersTitle}>
            <Filter className={styles.filtersIcon} />
            Filtros
          </h3>
        </div>

        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Instituição</label>
            <Select
              value={reportFilterInstitution}
              onChange={(e) => setReportFilterInstitution(e.target.value)}
            >
              <option value="all">Todas as Instituições</option>
              {institutionsList.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </Select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Curso</label>
            <Select
              value={reportFilterCourse}
              onChange={(e) => setReportFilterCourse(e.target.value)}
            >
              <option value="all">Todos os Cursos</option>
              {coursesList.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </Select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Período</label>
            <Select
              value={reportFilterPeriod}
              onChange={(e) => setReportFilterPeriod(e.target.value)}
            >
              <option value="last_month">Último mês</option>
              <option value="last_3_months">Últimos 3 meses</option>
              <option value="last_6_months">Últimos 6 meses</option>
              <option value="last_year">Último ano</option>
              <option value="all_time">Todo período</option>
            </Select>
          </div>
        </div>

        <div className={styles.filtersActions}>
          <Button
            variant="gradient"
            onClick={handleGenerateAnalysis}
            disabled={analysisLoading}
            className={styles.generateButton}
          >
            {analysisLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className={styles.spinner}
                />
                Gerando Análise...
              </>
            ) : (
              <>
                <Sparkles className={styles.buttonIcon} />
                Gerar Análise Completa
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
        </div>

        {!showAnalysis && (
          <p className={styles.hint}>
            Preencha os filtros e clique em "Gerar Análise Completa" para ver os resultados.
          </p>
        )}
      </motion.div>

      {/* Análise Completa */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={styles.analysisContainer}
          >
            {/* Botão de Download PDF */}
            <div className={styles.actionsBar}>
              <div className={styles.actionsLeft}>
                <span className={styles.actionsLabel}>Exportar Relatório:</span>
              </div>
              <div className={styles.actionsRight}>
                <Button variant="gradient" onClick={handleDownloadPDF} className={styles.actionButton}>
                  <FileDown className={styles.buttonIcon} />
                  Baixar PDF
                </Button>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className={styles.metricsGrid}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={styles.metricCard}
              >
                <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <BarChart3 />
                </div>
                <div className={styles.metricContent}>
                  <p className={styles.metricLabel}>Total de Avaliações</p>
                  <h3 className={styles.metricValue}>{analysisData.totalAvaliacoes}</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={styles.metricCard}
              >
                <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                  <svg className={styles.starIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className={styles.metricContent}>
                  <p className={styles.metricLabel}>Média Geral</p>
                  <h3 className={styles.metricValue}>{analysisData.mediaGeral.toFixed(2)} ★</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={styles.metricCard}
              >
                <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <TrendingUp />
                </div>
                <div className={styles.metricContent}>
                  <p className={styles.metricLabel}>Tendência</p>
                  <h3 className={styles.metricValue}>{analysisData.tendencia}</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className={styles.metricCard}
              >
                <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <Target />
                </div>
                <div className={styles.metricContent}>
                  <p className={styles.metricLabel}>Taxa de Resposta</p>
                  <h3 className={styles.metricValue}>{analysisData.taxaResposta}%</h3>
                </div>
              </motion.div>
            </div>

            {/* Relatório Geral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={styles.section}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Relatório Geral</h2>
              </div>
              <div className={styles.sectionContent}>
                <p className={styles.summaryText}>{escritaAnalise.resumo}</p>
              </div>
            </motion.div>

            {/* Análise Escrita */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={styles.section}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Sparkles className={styles.sectionIcon} />
                  Análise Escrita
                </h2>
              </div>

              <div className={styles.analysisGrid}>
                {/* Pontos Fortes */}
                <div className={styles.analysisColumn}>
                  <div className={styles.columnHeader} style={{ borderColor: '#22c55e' }}>
                    <div className={styles.columnIcon} style={{ background: '#dcfce7', color: '#22c55e' }}>
                      <TrendingUp />
                    </div>
                    <h3 className={styles.columnTitle}>Pontos Fortes</h3>
                  </div>
                  <ul className={styles.analysisList}>
                    {escritaAnalise.pontosFortes.map((ponto, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={styles.analysisItem}
                      >
                        <ArrowRight className={styles.listIcon} style={{ color: '#22c55e' }} />
                        {ponto}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Pontos Fracos */}
                <div className={styles.analysisColumn}>
                  <div className={styles.columnHeader} style={{ borderColor: '#ef4444' }}>
                    <div className={styles.columnIcon} style={{ background: '#fee2e2', color: '#ef4444' }}>
                      <TrendingDown />
                    </div>
                    <h3 className={styles.columnTitle}>Áreas de Atenção</h3>
                  </div>
                  <ul className={styles.analysisList}>
                    {escritaAnalise.pontosFracos.map((ponto, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={styles.analysisItem}
                      >
                        <ArrowRight className={styles.listIcon} style={{ color: '#ef4444' }} />
                        {ponto}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Insights */}
              <div className={styles.insightsBox}>
                <div className={styles.insightsHeader}>
                  <Lightbulb className={styles.insightsIcon} />
                  <h4 className={styles.insightsTitle}>Insights e Observações</h4>
                </div>
                <ul className={styles.insightsList}>
                  {escritaAnalise.insights.map((insight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className={styles.insightItem}
                    >
                      {insight}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Análise Gráfica */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={styles.section}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <BarChart3 className={styles.sectionIcon} />
                  Análise Gráfica
                </h2>
              </div>

              {/* Tabs de Gráficos */}
              <div className={styles.chartTabs}>
                <button
                  className={`${styles.chartTab} ${activeChartTab === 'bars' ? styles.chartTabActive : ''}`}
                  onClick={() => setActiveChartTab('bars')}
                >
                  Médias por Pergunta
                </button>
                <button
                  className={`${styles.chartTab} ${activeChartTab === 'line' ? styles.chartTabActive : ''}`}
                  onClick={() => setActiveChartTab('line')}
                >
                  Evolução Temporal
                </button>
                <button
                  className={`${styles.chartTab} ${activeChartTab === 'radar' ? styles.chartTabActive : ''}`}
                  onClick={() => setActiveChartTab('radar')}
                >
                  Análise 360°
                </button>
                <button
                  className={`${styles.chartTab} ${activeChartTab === 'pie' ? styles.chartTabActive : ''}`}
                  onClick={() => setActiveChartTab('pie')}
                >
                  Distribuição de Notas
                </button>
              </div>

              <div className={styles.chartContainer}>
                {/* Gráfico de Barras */}
                {activeChartTab === 'bars' && (
                  <motion.div
                    key="bars"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.chart}
                  >
                    <h3 className={styles.chartTitle}>Gráfico de Médias por Pergunta</h3>
                    <ResponsiveContainer width="100%" height={450}>
                      <BarChart data={analysisData.mediasPorPergunta} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="pergunta" 
                          angle={-45}
                          textAnchor="end"
                          height={120}
                          tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <YAxis domain={[0, 5]} tick={{ fill: '#64748b' }} label={{ value: 'Média das Notas', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }} />
                        <RechartsTooltip 
                          contentStyle={{ 
                            background: 'white', 
                            border: '2px solid #3b82f6',
                            borderRadius: '0.75rem',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                            padding: '0.75rem'
                          }}
                          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '1rem' }}
                          iconType="circle"
                        />
                        <Bar 
                          dataKey="nota" 
                          fill="url(#colorGradient)" 
                          name="Média das Notas" 
                          radius={[8, 8, 0, 0]}
                          label={{ position: 'top', fill: '#1e293b', fontSize: 12, fontWeight: 600 }}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* Gráfico de Linha */}
                {activeChartTab === 'line' && (
                  <motion.div
                    key="line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.chart}
                  >
                    <h3 className={styles.chartTitle}>Evolução Temporal das Avaliações</h3>
                    <ResponsiveContainer width="100%" height={450}>
                      <LineChart data={analysisData.evolucaoTemporal} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="mes" tick={{ fill: '#64748b' }} />
                        <YAxis domain={[0, 5]} tick={{ fill: '#64748b' }} label={{ value: 'Média', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }} />
                        <RechartsTooltip 
                          contentStyle={{ 
                            background: 'white', 
                            border: '2px solid #8b5cf6',
                            borderRadius: '0.75rem',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                            padding: '0.75rem'
                          }}
                          cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '1rem' }}
                          iconType="line"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="media" 
                          stroke={CHART_COLORS.secondary} 
                          strokeWidth={4}
                          name="Média Mensal"
                          dot={{ fill: CHART_COLORS.secondary, r: 7, strokeWidth: 2, stroke: 'white' }}
                          activeDot={{ r: 9, strokeWidth: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* Gráfico de Radar */}
                {activeChartTab === 'radar' && (
                  <motion.div
                    key="radar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.chart}
                  >
                    <h3 className={styles.chartTitle}>Análise 360° - Visão Holística</h3>
                    <ResponsiveContainer width="100%" height={500}>
                      <RadarChart data={analysisData.mediasPorPergunta}>
                        <PolarGrid stroke="#cbd5e1" strokeWidth={1.5} />
                        <PolarAngleAxis 
                          dataKey="pergunta" 
                          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                        />
                        <PolarRadiusAxis 
                          domain={[0, 5]} 
                          tick={{ fill: '#64748b' }}
                          axisLine={{ stroke: '#94a3b8' }}
                        />
                        <Radar 
                          name="Desempenho por Categoria" 
                          dataKey="nota" 
                          stroke={CHART_COLORS.success} 
                          fill={CHART_COLORS.success} 
                          fillOpacity={0.5} 
                          strokeWidth={3}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            background: 'white', 
                            border: '2px solid #22c55e',
                            borderRadius: '0.75rem',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                            padding: '0.75rem'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '1rem' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* Gráfico de Pizza */}
                {activeChartTab === 'pie' && (
                  <motion.div
                    key="pie"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.chart}
                  >
                    <h3 className={styles.chartTitle}>Distribuição de Notas</h3>
                    <ResponsiveContainer width="100%" height={450}>
                      <PieChart>
                        <Pie
                          data={analysisData.distribuicaoNotas}
                          cx="50%"
                          cy="50%"
                          labelLine={{ stroke: '#64748b', strokeWidth: 2 }}
                          label={(entry) => `${entry.nota}: ${entry.percentual}%`}
                          outerRadius={140}
                          fill="#8884d8"
                          dataKey="quantidade"
                          strokeWidth={3}
                          stroke="white"
                        >
                          {analysisData.distribuicaoNotas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ 
                            background: 'white', 
                            border: '2px solid #e2e8f0',
                            borderRadius: '0.75rem',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                            padding: '0.75rem'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '1.5rem' }}
                          iconType="circle"
                          formatter={(_, entry: any) => `${entry.payload.nota} (${entry.payload.quantidade} avaliações)`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Sugestões e Insights Detalhados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className={styles.section}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Lightbulb className={styles.sectionIcon} />
                  Sugestões e Insights
                </h2>
              </div>

              <div className={styles.suggestionsContainer}>
                {analysisData.mediasPorPergunta.map((item, index) => {
                  // Classificação automática baseada na nota
                  let classificacao = '';
                  let statusColor = '';
                  let statusBg = '';
                  
                  if (item.nota >= 4.5) {
                    classificacao = 'good point';
                    statusColor = '#22c55e';
                    statusBg = '#dcfce7';
                  } else if (item.nota >= 3.5) {
                    classificacao = 'good point';
                    statusColor = '#3b82f6';
                    statusBg = '#dbeafe';
                  } else if (item.nota >= 2.5) {
                    classificacao = 'attention';
                    statusColor = '#f59e0b';
                    statusBg = '#fef3c7';
                  } else {
                    classificacao = 'critical';
                    statusColor = '#ef4444';
                    statusBg = '#fee2e2';
                  }

                  // Sentimento automático
                  let sentimento = '';
                  if (item.nota >= 4.0) {
                    sentimento = 'é boa e o sentimento é neutro a positivo';
                  } else if (item.nota >= 3.0) {
                    sentimento = 'é razoável e o sentimento é neutro';
                  } else {
                    sentimento = 'é baixa e o sentimento é fortemente negativo';
                  }

                  // Sugestão automática
                  let sugestao = '';
                  if (item.nota >= 4.0) {
                    sugestao = 'Continue monitorando e buscando pequenas melhorias para manter a qualidade.';
                  } else if (item.nota >= 3.0) {
                    sugestao = 'Identifique os pontos específicos que podem ser melhorados através de feedback direto com os alunos.';
                  } else {
                    sugestao = 'É urgente investigar as causas e implementar um plano de ação corretivo imediato. Priorize esta área dos alunos para entender os problemas específicos.';
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.05 }}
                      className={styles.suggestionCard}
                      style={{ borderLeftColor: statusColor }}
                    >
                      <div className={styles.suggestionHeader}>
                        <h4 className={styles.suggestionTitle}>{item.pergunta}</h4>
                        <span 
                          className={styles.suggestionStatus}
                          style={{ background: statusBg, color: statusColor }}
                        >
                          ({classificacao})
                        </span>
                      </div>
                      <p className={styles.suggestionText}>
                        <strong style={{ color: statusColor }}>**Ponto {classificacao === 'good point' ? 'Positivo' : classificacao === 'critical' ? 'Crítico' : 'de Atenção'} em {item.pergunta}:**</strong>{' '}
                        A média ({item.nota.toFixed(1)}) {sentimento}. {sugestao}
                      </p>
                      <div className={styles.suggestionFooter}>
                        <span className={styles.suggestionCategory}>
                          {item.categoria === 'Instituição' ? (
                            <Building2 className={styles.categoryIcon} />
                          ) : (
                            <GraduationCap className={styles.categoryIcon} />
                          )}
                          {item.categoria}
                        </span>
                        <span className={styles.suggestionRating}>
                          Média: <strong>{item.nota.toFixed(1)} / 5.0</strong>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Relatório de Melhoria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className={styles.section}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Target className={styles.sectionIcon} />
                  Relatório de Melhoria Prioritário
                </h2>
              </div>

              <div className={styles.improvementList}>
                {recomendacoes.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    className={styles.improvementCard}
                  >
                    <div className={styles.improvementHeader}>
                      <div className={styles.improvementPriority} style={{ background: rec.cor }}>
                        {rec.prioridade}
                      </div>
                      <h4 className={styles.improvementArea}>{rec.area}</h4>
                      <span className={styles.improvementNota}>Nota Atual: {rec.nota.toFixed(1)} ★</span>
                    </div>
                    <p className={styles.improvementAcao}>
                      <strong>Ação Recomendada:</strong> {rec.acao}
                    </p>
                    <div className={styles.improvementFooter}>
                      <span className={styles.improvementImpacto}>{rec.impacto}</span>
                      <span className={styles.improvementPrazo}>
                        <Calendar className={styles.calendarIcon} />
                        {rec.prazo}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Resumo Final e Conclusão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
              className={styles.conclusionCard}
            >
              <div className={styles.conclusionHeader}>
                <Sparkles className={styles.conclusionIcon} />
                <h3 className={styles.conclusionTitle}>Conclusão da Análise</h3>
              </div>
              <p className={styles.conclusionText}>
                Com base nos dados analisados, a instituição demonstra um desempenho satisfatório geral, 
                com destaque para a qualidade do corpo docente e infraestrutura de aprendizado. As áreas 
                identificadas para melhoria representam oportunidades estratégicas de crescimento e aumento 
                da satisfação estudantil. Recomenda-se priorizar as ações de <strong>alta prioridade</strong> nos 
                próximos 6 meses para maximizar o impacto positivo nas avaliações futuras.
              </p>
              <div className={styles.conclusionStats}>
                <div className={styles.conclusionStat}>
                  <span className={styles.conclusionStatValue}>85%</span>
                  <span className={styles.conclusionStatLabel}>Taxa de Satisfação</span>
                </div>
                <div className={styles.conclusionStat}>
                  <span className={styles.conclusionStatValue}>+12%</span>
                  <span className={styles.conclusionStatLabel}>Crescimento Semestral</span>
                </div>
                <div className={styles.conclusionStat}>
                  <span className={styles.conclusionStatValue}>4 áreas</span>
                  <span className={styles.conclusionStatLabel}>Oportunidades de Melhoria</span>
                </div>
              </div>
            </motion.div>

            {/* Ações Finais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className={styles.finalActions}
            >
              <p className={styles.finalActionsLabel}>Análise completa gerada em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <Button variant="gradient" onClick={handleDownloadPDF} className={styles.finalActionButton}>
                <FileDown className={styles.buttonIcon} />
                Baixar Análise Completa em PDF
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
