import { useState } from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  GraduationCap,
  Star,
  Calendar,
  XCircle
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
import { Input } from './Input/Input';
import { Label } from './Label/Label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AdminDashboard.module.css';
import { AdminReportsSection } from '@/components/AdminReportsSection.tsx';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Evaluation {
  id: string;
  anonymousId: string;
  course: string;
  institution: string;
  date: string;
  overallRating: number;
  category: string;
}

interface CourseStats {
  course: string;
  totalEvaluations: number;
  averageRating: number;
  trend: number;
}

interface InstitutionData {
  id: number;
  name: string;
  totalStudents: number;
  totalEvaluations: number;
  averageRating: number;
  activeUsers: number;
}

interface Student {
  id: number;
  anonymousId: string;
  institution: string;
  course: string;
  semester: number;
  status: 'active' | 'inactive' | 'locked';
  totalEvaluations: number;
  averageRating: number;
  lastEvaluationDate: string;
  lastActivityDate: string; // Data da última atividade no sistema
}

interface StudentEvaluation {
  id: string;
  date: string;
  category: string;
  rating: number;
  questions: {
    question: string;
    rating: number;
  }[];
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'institutions' | 'reports'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  
  // Filtros
  const [filterRA, setFilterRA] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [showOnlyDeletable, setShowOnlyDeletable] = useState(false);
  
  // Exclusão
  const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Gerenciar Instituições e Cursos
  const [institutionsTab, setInstitutionsTab] = useState<'institutions' | 'courses'>('institutions');
  const [searchInstitution, setSearchInstitution] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [editingInstitution, setEditingInstitution] = useState<{ id?: number; name: string; originalName?: string } | null>(null);
  const [editingCourse, setEditingCourse] = useState<{ id?: number; name: string; originalName?: string } | null>(null);
  const [showDeleteInstitutionConfirm, setShowDeleteInstitutionConfirm] = useState<number | null>(null);
  const [showDeleteCourseConfirm, setShowDeleteCourseConfirm] = useState<number | null>(null);
  const [pendingSaveInstitution, setPendingSaveInstitution] = useState(false);
  const [pendingSaveCourse, setPendingSaveCourse] = useState(false);

  // Análise de Avaliações - Estados
  const [reportFilterInstitution, setReportFilterInstitution] = useState('all');
  const [reportFilterCourse, setReportFilterCourse] = useState('all');
  const [reportFilterPeriod, setReportFilterPeriod] = useState('all');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'bars' | 'line' | 'radar' | 'pie'>('bars');
  
  // Lista de instituições e cursos (mock data)
  const [institutionsList, setInstitutionsList] = useState([
    { id: 1, name: 'FATEC Presidente Prudente' },
    { id: 2, name: 'FATEC São Paulo' },
    { id: 3, name: 'FATEC Americana' },
    { id: 4, name: 'FATEC São José dos Campos' },
  ]);

  const [coursesList, setCoursesList] = useState([
    { id: 1, name: 'Análise e Desenvolvimento de Sistemas' },
    { id: 2, name: 'Desenvolvimento de Software Multiplataforma' },
    { id: 3, name: 'Gestão da Tecnologia da Informação' },
    { id: 4, name: 'Banco de Dados' },
    { id: 5, name: 'Gestão da Produção Industrial' },
  ]);

  // Mock data - Dados agregados e anônimos
  const stats = [
    { 
      label: 'Total de Usuários Ativos', 
      value: '1,234', 
      change: '+12%', 
      trend: 'up',
      icon: Users,
      color: '#3b82f6'
    },
    { 
      label: 'Avaliações Este Mês', 
      value: '856', 
      change: '+8%', 
      trend: 'up',
      icon: FileText,
      color: '#10b981'
    },
    { 
      label: 'Instituições Ativas', 
      value: '45', 
      change: '+3%', 
      trend: 'up',
      icon: Building2,
      color: '#8b5cf6'
    },
    { 
      label: 'Satisfação Média', 
      value: '4.2', 
      change: '+0.3', 
      trend: 'up',
      icon: TrendingUp,
      color: '#f59e0b'
    },
  ];

  // Avaliações anônimas - apenas ID, curso, instituição e notas
  const recentEvaluations: Evaluation[] = [
    { id: 'EVAL-001', anonymousId: 'USR-A3F9K', course: 'ADS', institution: 'FATEC PP', date: '2025-10-24', overallRating: 4.5, category: 'Instituição' },
    { id: 'EVAL-002', anonymousId: 'USR-B7M2L', course: 'DSM', institution: 'FATEC PP', date: '2025-10-24', overallRating: 4.8, category: 'Coordenação' },
    { id: 'EVAL-003', anonymousId: 'USR-C9P5N', course: 'GTI', institution: 'FATEC SP', date: '2025-10-23', overallRating: 3.9, category: 'Curso' },
    { id: 'EVAL-004', anonymousId: 'USR-D1Q8R', course: 'ADS', institution: 'FATEC PP', date: '2025-10-23', overallRating: 4.2, category: 'Recursos' },
    { id: 'EVAL-005', anonymousId: 'USR-E4T6W', course: 'BD', institution: 'FATEC AM', date: '2025-10-22', overallRating: 4.0, category: 'Acessibilidade' },
  ];

  // Estatísticas por curso
  const courseStats: CourseStats[] = [
    { course: 'ADS', totalEvaluations: 245, averageRating: 4.3, trend: 5 },
    { course: 'DSM', totalEvaluations: 189, averageRating: 4.5, trend: 8 },
    { course: 'GTI', totalEvaluations: 156, averageRating: 4.1, trend: 3 },
    { course: 'BD', totalEvaluations: 132, averageRating: 4.0, trend: -2 },
    { course: 'GPI', totalEvaluations: 98, averageRating: 4.2, trend: 6 },
  ];

  // Dados das instituições
  const institutions: InstitutionData[] = [
    { id: 1, name: 'FATEC Presidente Prudente', totalStudents: 342, totalEvaluations: 245, averageRating: 4.3, activeUsers: 312 },
    { id: 2, name: 'FATEC São Paulo', totalStudents: 489, totalEvaluations: 356, averageRating: 4.5, activeUsers: 445 },
    { id: 3, name: 'FATEC São José dos Campos', totalStudents: 278, totalEvaluations: 198, averageRating: 4.2, activeUsers: 256 },
    { id: 4, name: 'FATEC Americana', totalStudents: 195, totalEvaluations: 134, averageRating: 4.1, activeUsers: 178 },
  ];

  // Mock data - Estudantes com IDs anônimos
  const allStudents: Student[] = [
    { id: 1, anonymousId: 'USR-A3F9K', institution: 'FATEC PP', course: 'ADS', semester: 4, status: 'active', totalEvaluations: 3, averageRating: 4.5, lastEvaluationDate: '2025-10-20', lastActivityDate: '2025-10-20' },
    { id: 2, anonymousId: 'USR-B7M2L', institution: 'FATEC PP', course: 'DSM', semester: 2, status: 'active', totalEvaluations: 2, averageRating: 4.8, lastEvaluationDate: '2025-10-22', lastActivityDate: '2025-10-22' },
    { id: 3, anonymousId: 'USR-C9P5N', institution: 'FATEC SP', course: 'GTI', semester: 6, status: 'active', totalEvaluations: 5, averageRating: 3.9, lastEvaluationDate: '2025-10-19', lastActivityDate: '2025-10-19' },
    { id: 4, anonymousId: 'USR-D1Q8R', institution: 'FATEC PP', course: 'ADS', semester: 3, status: 'locked', totalEvaluations: 2, averageRating: 4.2, lastEvaluationDate: '2025-09-15', lastActivityDate: '2025-09-15' },
    { id: 5, anonymousId: 'USR-E4T6W', institution: 'FATEC AM', course: 'BD', semester: 5, status: 'active', totalEvaluations: 4, averageRating: 4.0, lastEvaluationDate: '2025-10-21', lastActivityDate: '2025-10-21' },
    { id: 6, anonymousId: 'USR-F2H7X', institution: 'FATEC SP', course: 'ADS', semester: 1, status: 'active', totalEvaluations: 1, averageRating: 4.3, lastEvaluationDate: '2025-10-24', lastActivityDate: '2025-10-24' },
    { id: 7, anonymousId: 'USR-G8K3Y', institution: 'FATEC PP', course: 'DSM', semester: 4, status: 'inactive', totalEvaluations: 0, averageRating: 0, lastEvaluationDate: '2023-08-10', lastActivityDate: '2023-08-10' }, // Inativo há mais de 1 ano
    { id: 8, anonymousId: 'USR-H5L9Z', institution: 'FATEC AM', course: 'GTI', semester: 2, status: 'active', totalEvaluations: 1, averageRating: 4.7, lastEvaluationDate: '2025-10-23', lastActivityDate: '2025-10-23' },
    { id: 9, anonymousId: 'USR-J6N4P', institution: 'FATEC SP', course: 'BD', semester: 3, status: 'inactive', totalEvaluations: 1, averageRating: 3.5, lastEvaluationDate: '2023-05-20', lastActivityDate: '2023-05-20' }, // Inativo há mais de 1 ano
    { id: 10, anonymousId: 'USR-K2M8Q', institution: 'FATEC PP', course: 'GTI', semester: 5, status: 'inactive', totalEvaluations: 2, averageRating: 4.1, lastEvaluationDate: '2022-12-15', lastActivityDate: '2022-12-15' }, // Inativo há mais de 2 anos
  ];

  // Calcular dias de inatividade
  const calculateInactiveDays = (lastActivityDate: string): number => {
    const today = new Date('2025-10-24'); // Data atual mockada
    const lastActivity = new Date(lastActivityDate);
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Verificar se pode ser excluído (inativo há mais de 365 dias)
  const canBeDeleted = (student: Student): boolean => {
    return student.status === 'inactive' && calculateInactiveDays(student.lastActivityDate) > 365;
  };

  // Avaliações detalhadas do estudante selecionado
  const studentEvaluations: StudentEvaluation[] = selectedStudent ? [
    {
      id: 'EVAL-001',
      date: '2025-10-20',
      category: 'Instituição',
      rating: 4.5,
      questions: [
        { question: 'A infraestrutura da instituição atende suas necessidades?', rating: 5 },
        { question: 'Os equipamentos e recursos estão em bom estado?', rating: 4 },
      ]
    },
    {
      id: 'EVAL-002',
      date: '2025-09-15',
      category: 'Coordenação',
      rating: 4.3,
      questions: [
        { question: 'A coordenação é acessível e receptiva?', rating: 4 },
        { question: 'As decisões são comunicadas de forma clara?', rating: 5 },
      ]
    },
    {
      id: 'EVAL-003',
      date: '2025-08-10',
      category: 'Curso',
      rating: 4.7,
      questions: [
        { question: 'O conteúdo do curso é relevante?', rating: 5 },
        { question: 'Os professores são qualificados?', rating: 4 },
      ]
    },
  ] : [];

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'users', label: 'Gerenciar Usuários', icon: Users },
    { id: 'institutions', label: 'Instituições', icon: Building2 },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  // Filtrar estudantes
  const filteredStudents = allStudents.filter(student => {
    const matchRA = filterRA === '' || student.anonymousId.toLowerCase().includes(filterRA.toLowerCase());
    const matchInstitution = filterInstitution === 'all' || student.institution === filterInstitution;
    const matchCourse = filterCourse === 'all' || student.course === filterCourse;
    const matchDeletable = !showOnlyDeletable || canBeDeleted(student);
    return matchRA && matchInstitution && matchCourse && matchDeletable;
  });

  // Contar usuários elegíveis para exclusão
  const deletableCount = allStudents.filter(canBeDeleted).length;

  const handleClearFilters = () => {
    setFilterRA('');
    setFilterInstitution('all');
    setFilterCourse('all');
    setShowOnlyDeletable(false);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const handleToggleSelection = (studentId: number) => {
    setSelectedForDeletion(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const deletableStudents = filteredStudents.filter(canBeDeleted);
    if (selectedForDeletion.length === deletableStudents.length) {
      setSelectedForDeletion([]);
    } else {
      setSelectedForDeletion(deletableStudents.map(s => s.id));
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Aqui seria a chamada para o backend
    console.log('Excluindo usuários:', selectedForDeletion);
    toast.success(`${selectedForDeletion.length} usuário(s) excluído(s) com sucesso!`);
    setSelectedForDeletion([]);
    setShowDeleteConfirm(false);
  };

  // Filtrar instituições e cursos
  const filteredInstitutions = institutionsList.filter(inst => 
    inst.name.toLowerCase().includes(searchInstitution.toLowerCase())
  );

  const filteredCourses = coursesList.filter(course => 
    course.name.toLowerCase().includes(searchCourse.toLowerCase())
  );

  // Funções de gerenciamento de instituições
  const handleRequestSaveInstitution = () => {
    if (!editingInstitution?.name.trim()) {
      toast.error('Nome da instituição é obrigatório');
      return;
    }
    // Abre o popup de confirmação
    setPendingSaveInstitution(true);
  };

  const handleConfirmSaveInstitution = () => {
    if (!editingInstitution?.name.trim()) {
      toast.error('Nome da instituição é obrigatório');
      return;
    }

    if (editingInstitution.id) {
      // Editar existente
      setInstitutionsList(prev => 
        prev.map(inst => inst.id === editingInstitution.id ? { ...inst, name: editingInstitution.name } : inst)
      );
      toast.success('Instituição atualizada com sucesso!');
    } else {
      // Adicionar nova
      const newId = Math.max(...institutionsList.map(i => i.id)) + 1;
      setInstitutionsList(prev => [...prev, { id: newId, name: editingInstitution.name }]);
      toast.success('Instituição adicionada com sucesso!');
    }
    setEditingInstitution(null);
    setPendingSaveInstitution(false);
  };

  const handleDeleteInstitution = (id: number) => {
    if (institutionsList.length <= 1) {
      toast.error('Não é possível excluir a última instituição!');
      return;
    }
    setInstitutionsList(prev => prev.filter(inst => inst.id !== id));
    toast.success('Instituição excluída com sucesso!');
    setShowDeleteInstitutionConfirm(null);
  };

  // Funções de gerenciamento de cursos
  const handleRequestSaveCourse = () => {
    if (!editingCourse?.name.trim()) {
      toast.error('Nome do curso é obrigatório');
      return;
    }
    // Abre o popup de confirmação
    setPendingSaveCourse(true);
  };

  const handleConfirmSaveCourse = () => {
    if (!editingCourse?.name.trim()) {
      toast.error('Nome do curso é obrigatório');
      return;
    }

    if (editingCourse.id) {
      // Editar existente
      setCoursesList(prev => 
        prev.map(course => course.id === editingCourse.id ? { ...course, name: editingCourse.name } : course)
      );
      toast.success('Curso atualizado com sucesso!');
    } else {
      // Adicionar novo
      const newId = Math.max(...coursesList.map(c => c.id)) + 1;
      setCoursesList(prev => [...prev, { id: newId, name: editingCourse.name }]);
      toast.success('Curso adicionado com sucesso!');
    }
    setEditingCourse(null);
    setPendingSaveCourse(false);
  };

  const handleDeleteCourse = (id: number) => {
    if (coursesList.length <= 1) {
      toast.error('Não é possível excluir o último curso!');
      return;
    }
    setCoursesList(prev => prev.filter(course => course.id !== id));
    toast.success('Curso excluído com sucesso!');
    setShowDeleteCourseConfirm(null);
  };

  // Dados da análise (mock)
  const analysisData = {
    totalAvaliacoes: 247,
    mediaGeral: 3.89,
    taxaResposta: 78.5,
    tendencia: '+12%',
    mediasPorPergunta: [
      { pergunta: 'Infraestrutura', nota: 4.2, categoria: 'Instituição' },
      { pergunta: 'Localização', nota: 3.8, categoria: 'Instituição' },
      { pergunta: 'Biblioteca', nota: 4.5, categoria: 'Instituição' },
      { pergunta: 'Dinâmica Prof.', nota: 4.1, categoria: 'Curso' },
      { pergunta: 'Coordenação', nota: 3.9, categoria: 'Curso' },
      { pergunta: 'Acessibilidade', nota: 3.5, categoria: 'Instituição' },
      { pergunta: 'Didática', nota: 4.3, categoria: 'Curso' },
      { pergunta: 'Direção', nota: 3.7, categoria: 'Instituição' },
      { pergunta: 'Disp. Prof.', nota: 4.6, categoria: 'Curso' },
      { pergunta: 'Equipamentos', nota: 3.6, categoria: 'Instituição' },
      { pergunta: 'Conteúdo', nota: 4.0, categoria: 'Curso' },
    ],
    distribuicaoNotas: [
      { nota: '1 Estrela', quantidade: 12, percentual: 4.9 },
      { nota: '2 Estrelas', quantidade: 28, percentual: 11.3 },
      { nota: '3 Estrelas', quantidade: 71, percentual: 28.7 },
      { nota: '4 Estrelas', quantidade: 89, percentual: 36.0 },
      { nota: '5 Estrelas', quantidade: 47, percentual: 19.1 },
    ],
    evolucaoTemporal: [
      { mes: 'Jun', media: 3.5 },
      { mes: 'Jul', media: 3.7 },
      { mes: 'Ago', media: 3.6 },
      { mes: 'Set', media: 3.9 },
      { mes: 'Out', media: 4.1 },
      { mes: 'Nov', media: 3.9 },
    ],
  };

  const handleGenerateAnalysis = () => {
    setAnalysisLoading(true);
    setTimeout(() => {
      setShowAnalysis(true);
      setAnalysisLoading(false);
      toast.success('Análise gerada com sucesso!');
    }, 1500);
  };

  const handleDownloadPDF = () => {
    toast.success('Relatório PDF baixado com sucesso!');
  };

  const handleDownloadExcel = () => {
    toast.success('Dados Excel baixados com sucesso!');
  };

  const handleShareReport = () => {
    toast.success('Link do relatório copiado!');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={styles.sidebar}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <Building2 />
                </div>
                <span className={styles.logoText}>Admin Panel</span>
              </div>
              <button 
                className={styles.closeSidebar}
                onClick={() => setSidebarOpen(false)}
              >
                <X />
              </button>
            </div>

            <nav className={styles.navigation}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
                  onClick={() => setActiveTab(item.id as any)}
                >
                  <item.icon className={styles.navIcon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className={styles.sidebarFooter}>
              <button className={styles.settingsButton}>
                <Settings className={styles.navIcon} />
                <span>Configurações</span>
              </button>
              <button className={styles.logoutButton} onClick={onLogout}>
                <LogOut className={styles.navIcon} />
                <span>Sair</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {!sidebarOpen && (
              <button 
                className={styles.menuButton}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu />
              </button>
            )}
            <div>
              <h1 className={styles.pageTitle}>Painel Administrativo</h1>
              <p className={styles.pageSubtitle}>Bem-vindo(a), Guilherme!</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.adminAvatar}>
              GA
            </div>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.statCard}
                  >
                    <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15` }}>
                      <stat.icon style={{ color: stat.color }} />
                    </div>
                    <div className={styles.statContent}>
                      <p className={styles.statLabel}>{stat.label}</p>
                      <div className={styles.statValueRow}>
                        <h3 className={styles.statValue}>{stat.value}</h3>
                        <span className={`${styles.statChange} ${styles.statChangeUp}`}>
                          <TrendingUp className={styles.trendIcon} />
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts and Tables Row */}
              <div className={styles.chartsRow}>
                {/* Recent Evaluations - Dados Anônimos */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={styles.card}
                >
                  <div className={styles.cardHeader}>
                    <div>
                      <h2 className={styles.cardTitle}>Avaliações Recentes</h2>
                      <p className={styles.cardSubtitle}>Dados agregados e anônimos</p>
                    </div>
                    <Button variant="outline" className={styles.cardAction}>
                      <Download className={styles.buttonIcon} />
                      Exportar
                    </Button>
                  </div>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID Avaliação</th>
                          <th>ID Anônimo</th>
                          <th>Instituição</th>
                          <th>Curso</th>
                          <th>Data</th>
                          <th>Categoria</th>
                          <th>Nota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvaluations.map((evaluation) => (
                          <tr key={evaluation.id}>
                            <td>
                              <span className={styles.idTag}>{evaluation.id}</span>
                            </td>
                            <td>
                              <span className={styles.anonymousTag}>{evaluation.anonymousId}</span>
                            </td>
                            <td>{evaluation.institution}</td>
                            <td>
                              <span className={styles.courseTag}>{evaluation.course}</span>
                            </td>
                            <td>{new Date(evaluation.date).toLocaleDateString('pt-BR')}</td>
                            <td>
                              <span className={styles.categoryTag}>{evaluation.category}</span>
                            </td>
                            <td>
                              <span className={styles.rating}>★ {evaluation.overallRating.toFixed(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Course Statistics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={styles.card}
                >
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Desempenho por Curso</h2>
                  </div>
                  <div className={styles.courseStatsGrid}>
                    {courseStats.map((course, index) => (
                      <motion.div
                        key={course.course}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className={styles.courseStatCard}
                      >
                        <div className={styles.courseStatHeader}>
                          <h3 className={styles.courseName}>{course.course}</h3>
                          <span className={`${styles.trendBadge} ${
                            course.trend > 0 ? styles.trendPositive : styles.trendNegative
                          }`}>
                            {course.trend > 0 ? '+' : ''}{course.trend}%
                          </span>
                        </div>
                        <div className={styles.courseStatBody}>
                          <div className={styles.courseStatItem}>
                            <span className={styles.courseStatLabel}>Avaliações</span>
                            <span className={styles.courseStatValue}>{course.totalEvaluations}</span>
                          </div>
                          <div className={styles.courseStatItem}>
                            <span className={styles.courseStatLabel}>Média</span>
                            <span className={styles.ratingLarge}>★ {course.averageRating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${(course.averageRating / 5) * 100}%` }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={styles.alertsSection}
              >
                <div className={styles.privacyCard}>
                  <CheckCircle className={styles.privacyIcon} />
                  <div className={styles.alertContent}>
                    <h3 className={styles.alertTitle}>Sistema de Avaliação Anônima Ativo</h3>
                    <p className={styles.alertDescription}>
                      Todas as avaliações são processadas de forma anônima. Os dados pessoais dos alunos são protegidos e não são acessíveis através deste painel. Apenas IDs aleatórios e estatísticas agregadas estão disponíveis.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Gerenciar Usuários</h2>
                  <p className={styles.sectionDescription}>
                    Pesquise e visualize informações dos usuários por ID anônimo
                  </p>
                </div>
                <Button variant="outline" className={styles.backButton} onClick={() => setActiveTab('overview')}>
                  ← Voltar ao Painel
                </Button>
              </div>

              {/* Alerta de Usuários Elegíveis para Exclusão */}
              {deletableCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={styles.deletionAlertCard}
                >
                  <AlertCircle className={styles.deletionAlertIcon} />
                  <div className={styles.deletionAlertContent}>
                    <h3 className={styles.deletionAlertTitle}>
                      {deletableCount} usuário{deletableCount !== 1 ? 's' : ''} elegível{deletableCount !== 1 ? 'eis' : ''} para exclusão
                    </h3>
                    <p className={styles.deletionAlertDescription}>
                      {deletableCount === 1 
                        ? 'Há 1 usuário inativo há mais de 365 dias que pode ser excluído.'
                        : `Há ${deletableCount} usuários inativos há mais de 365 dias que podem ser excluídos.`
                      }
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className={styles.deletionAlertButton}
                    onClick={() => setShowOnlyDeletable(!showOnlyDeletable)}
                  >
                    {showOnlyDeletable ? 'Ver Todos' : 'Ver Elegíveis'}
                  </Button>
                </motion.div>
              )}

              {/* Filtros */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={styles.filtersCard}
              >
                <h3 className={styles.filtersTitle}>Filtros</h3>
                <div className={styles.filtersGrid}>
                  <div className={styles.filterGroup}>
                    <Label htmlFor="filterRA" className={styles.filterLabel}>
                      ID do Usuário
                    </Label>
                    <Input
                      id="filterRA"
                      type="text"
                      placeholder="Ex: USR-A3F9K"
                      value={filterRA}
                      onChange={(e) => setFilterRA(e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>

                  <div className={styles.filterGroup}>
                    <Label htmlFor="filterInstitution" className={styles.filterLabel}>
                      Instituição
                    </Label>
                    <select
                      id="filterInstitution"
                      value={filterInstitution}
                      onChange={(e) => setFilterInstitution(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">Todas as Instituições</option>
                      <option value="FATEC PP">FATEC Presidente Prudente</option>
                      <option value="FATEC SP">FATEC São Paulo</option>
                      <option value="FATEC AM">FATEC Americana</option>
                      <option value="FATEC SJC">FATEC São José dos Campos</option>
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <Label htmlFor="filterCourse" className={styles.filterLabel}>
                      Curso
                    </Label>
                    <select
                      id="filterCourse"
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">Todos os Cursos</option>
                      <option value="ADS">ADS</option>
                      <option value="DSM">DSM</option>
                      <option value="GTI">GTI</option>
                      <option value="BD">BD</option>
                      <option value="GPI">GPI</option>
                    </select>
                  </div>
                </div>

                <div className={styles.filtersActions}>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Limpar Filtros
                  </Button>
                  <span className={styles.resultsCount}>
                    {filteredStudents.length} resultado{filteredStudents.length !== 1 ? 's' : ''} encontrado{filteredStudents.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </motion.div>

              {/* Tabela de Usuários */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={styles.card}
              >
                {/* Toolbar de Ações */}
                {selectedForDeletion.length > 0 && (
                  <div className={styles.tableToolbar}>
                    <span className={styles.toolbarText}>
                      {selectedForDeletion.length} usuário{selectedForDeletion.length !== 1 ? 's' : ''} selecionado{selectedForDeletion.length !== 1 ? 's' : ''}
                    </span>
                    <Button 
                      variant="outline" 
                      className={styles.deleteButton}
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className={styles.buttonIcon} />
                      Excluir Selecionados
                    </Button>
                  </div>
                )}

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.checkboxColumn}>
                          <input
                            type="checkbox"
                            checked={filteredStudents.filter(canBeDeleted).length > 0 && 
                                     selectedForDeletion.length === filteredStudents.filter(canBeDeleted).length}
                            onChange={handleSelectAll}
                            disabled={filteredStudents.filter(canBeDeleted).length === 0}
                            className={styles.checkbox}
                          />
                        </th>
                        <th>ID Anônimo</th>
                        <th>Instituição</th>
                        <th>Curso</th>
                        <th>Semestre</th>
                        <th>Status</th>
                        <th>Dias Inativo</th>
                        <th>Média</th>
                        <th>Última Avaliação</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={9} className={styles.emptyState}>
                            <div className={styles.emptyStateContent}>
                              <Search className={styles.emptyStateIcon} />
                              <p>Nenhum usuário encontrado com os filtros aplicados</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const inactiveDays = calculateInactiveDays(student.lastActivityDate);
                          const isDeletable = canBeDeleted(student);
                          
                          return (
                            <tr key={student.id} className={isDeletable ? styles.deletableRow : ''}>
                              <td className={styles.checkboxColumn}>
                                <input
                                  type="checkbox"
                                  checked={selectedForDeletion.includes(student.id)}
                                  onChange={() => handleToggleSelection(student.id)}
                                  disabled={!isDeletable}
                                  className={styles.checkbox}
                                />
                              </td>
                              <td>
                                <div className={styles.idCell}>
                                  <span className={styles.anonymousTag}>{student.anonymousId}</span>
                                  {isDeletable && (
                                    <span className={styles.deletableBadge} title="Elegível para exclusão">
                                      <AlertCircle /> Pode excluir
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>{student.institution}</td>
                              <td>
                                <span className={styles.courseTag}>{student.course}</span>
                              </td>
                              <td>
                                <div className={styles.semesterCell}>
                                  <GraduationCap className={styles.semesterIcon} />
                                  <span>{student.semester}º Semestre</span>
                                </div>
                              </td>
                              <td>
                                <span className={`${styles.badge} ${
                                  student.status === 'active' 
                                    ? styles.badgeSuccess 
                                    : student.status === 'locked'
                                    ? styles.badgeWarning
                                    : styles.badgeError
                                }`}>
                                  {student.status === 'active' ? (
                                    <>
                                      <UserCheck className={styles.badgeIcon} />
                                      Ativo
                                    </>
                                  ) : student.status === 'locked' ? (
                                    <>
                                      <Clock className={styles.badgeIcon} />
                                      Trancado
                                    </>
                                  ) : (
                                    <>
                                      <UserX className={styles.badgeIcon} />
                                      Inativo
                                    </>
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className={`${styles.inactiveDays} ${
                                  isDeletable ? styles.inactiveDaysDanger : ''
                                }`}>
                                  {inactiveDays} dia{inactiveDays !== 1 ? 's' : ''}
                                </span>
                              </td>
                              <td>
                                {student.totalEvaluations > 0 ? (
                                  <span className={styles.rating}>★ {student.averageRating.toFixed(1)}</span>
                                ) : (
                                  <span className={styles.ratingEmpty}>—</span>
                                )}
                              </td>
                              <td>
                                <div className={styles.actionButtons}>
                                  <button 
                                    className={styles.actionButton} 
                                    title="Visualizar Detalhes"
                                    onClick={() => handleViewStudent(student)}
                                  >
                                    <Eye />
                                  </button>
                                  {isDeletable && (
                                    <button 
                                      className={styles.actionButtonDanger} 
                                      title="Excluir Usuário"
                                      onClick={() => {
                                        setSelectedForDeletion([student.id]);
                                        setShowDeleteConfirm(true);
                                      }}
                                    >
                                      <Trash2 />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'institutions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Gerenciar Instituições e Cursos</h2>
                  <p className={styles.sectionDescription}>
                    Adicione, edite ou remova instituições e cursos do sistema
                  </p>
                </div>
                <Button variant="outline" className={styles.backButton} onClick={() => setActiveTab('overview')}>
                  ← Voltar ao Painel
                </Button>
              </div>

              {/* Tabs */}
              <div className={styles.manageTabs}>
                <button
                  className={`${styles.manageTab} ${institutionsTab === 'institutions' ? styles.manageTabActive : ''}`}
                  onClick={() => setInstitutionsTab('institutions')}
                >
                  <Building2 className={styles.manageTabIcon} />
                  Instituições
                </button>
                <button
                  className={`${styles.manageTab} ${institutionsTab === 'courses' ? styles.manageTabActive : ''}`}
                  onClick={() => setInstitutionsTab('courses')}
                >
                  <GraduationCap className={styles.manageTabIcon} />
                  Cursos
                </button>
              </div>

              {/* Conteúdo da aba Instituições */}
              {institutionsTab === 'institutions' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.manageCard}>
                    <h3 className={styles.manageCardTitle}>Instituições</h3>
                    
                    {/* Busca e Ações */}
                    <div className={styles.manageSearchRow}>
                      <Input
                        type="text"
                        placeholder="Buscar instituição por nome..."
                        value={searchInstitution}
                        onChange={(e) => setSearchInstitution(e.target.value)}
                        className={styles.manageSearchInput}
                      />
                      <Button 
                        variant="gradient"
                        onClick={() => setSearchInstitution(searchInstitution)}
                      >
                        Buscar
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSearchInstitution('')}
                      >
                        Limpar
                      </Button>
                    </div>

                    {searchInstitution === '' && (
                      <p className={styles.manageHint}>
                        Use a busca para encontrar instituições
                      </p>
                    )}

                    {/* Botão Adicionar */}
                    <div className={styles.manageAddRow}>
                      <Button 
                        variant="gradient"
                        className={styles.manageAddButton}
                        onClick={() => setEditingInstitution({ name: '' })}
                      >
                        <Plus className={styles.buttonIcon} />
                        Adicionar Nova Instituição
                      </Button>
                    </div>

                    {/* Lista de Instituições */}
                    {filteredInstitutions.length > 0 ? (
                      <div className={styles.manageList}>
                        {filteredInstitutions.map((institution, index) => (
                          <motion.div
                            key={institution.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={styles.manageItem}
                          >
                            <div className={styles.manageItemIcon}>
                              <Building2 />
                            </div>
                            <div className={styles.manageItemContent}>
                              <h4 className={styles.manageItemName}>{institution.name}</h4>
                            </div>
                            <div className={styles.manageItemActions}>
                              <button
                                className={styles.manageActionButton}
                                onClick={() => setEditingInstitution({ 
                                  id: institution.id, 
                                  name: institution.name,
                                  originalName: institution.name 
                                })}
                                title="Editar"
                              >
                                <Edit />
                              </button>
                              <button
                                className={styles.manageActionButtonDanger}
                                onClick={() => setShowDeleteInstitutionConfirm(institution.id)}
                                disabled={institutionsList.length <= 1}
                                title={institutionsList.length <= 1 ? 'Não é possível excluir a última instituição' : 'Excluir'}
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : searchInstitution !== '' ? (
                      <div className={styles.manageEmpty}>
                        <Search className={styles.manageEmptyIcon} />
                        <p>Nenhuma instituição encontrada</p>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              )}

              {/* Conteúdo da aba Cursos */}
              {institutionsTab === 'courses' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.manageCard}>
                    <h3 className={styles.manageCardTitle}>Cursos</h3>
                    
                    {/* Busca e Ações */}
                    <div className={styles.manageSearchRow}>
                      <Input
                        type="text"
                        placeholder="Buscar curso por nome..."
                        value={searchCourse}
                        onChange={(e) => setSearchCourse(e.target.value)}
                        className={styles.manageSearchInput}
                      />
                      <Button 
                        variant="gradient"
                        onClick={() => setSearchCourse(searchCourse)}
                      >
                        Buscar
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSearchCourse('')}
                      >
                        Limpar
                      </Button>
                    </div>

                    {searchCourse === '' && (
                      <p className={styles.manageHint}>
                        Use a busca para encontrar cursos
                      </p>
                    )}

                    {/* Botão Adicionar */}
                    <div className={styles.manageAddRow}>
                      <Button 
                        variant="gradient"
                        className={styles.manageAddButton}
                        onClick={() => setEditingCourse({ name: '' })}
                      >
                        <Plus className={styles.buttonIcon} />
                        Adicionar Novo Curso
                      </Button>
                    </div>

                    {/* Lista de Cursos */}
                    {filteredCourses.length > 0 ? (
                      <div className={styles.manageList}>
                        {filteredCourses.map((course, index) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={styles.manageItem}
                          >
                            <div className={styles.manageItemIcon}>
                              <GraduationCap />
                            </div>
                            <div className={styles.manageItemContent}>
                              <h4 className={styles.manageItemName}>{course.name}</h4>
                            </div>
                            <div className={styles.manageItemActions}>
                              <button
                                className={styles.manageActionButton}
                                onClick={() => setEditingCourse({ 
                                  id: course.id, 
                                  name: course.name,
                                  originalName: course.name 
                                })}
                                title="Editar"
                              >
                                <Edit />
                              </button>
                              <button
                                className={styles.manageActionButtonDanger}
                                onClick={() => setShowDeleteCourseConfirm(course.id)}
                                disabled={coursesList.length <= 1}
                                title={coursesList.length <= 1 ? 'Não é possível excluir o último curso' : 'Excluir'}
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : searchCourse !== '' ? (
                      <div className={styles.manageEmpty}>
                        <Search className={styles.manageEmptyIcon} />
                        <p>Nenhum curso encontrado</p>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <AdminReportsSection 
              institutionsList={institutionsList}
              coursesList={coursesList}
            />
          )}
        </div>
      </main>

      {/* Modal de Edição/Adição de Instituição */}
      <AnimatePresence>
        {editingInstitution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setEditingInstitution(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.editDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.editDialogTitle}>
                {editingInstitution.id ? 'Editar Instituição' : 'Adicionar Instituição'}
              </h2>
              <div className={styles.editDialogBody}>
                <Label htmlFor="institutionName">Nome da Instituição</Label>
                <Input
                  id="institutionName"
                  type="text"
                  placeholder="Ex: FATEC São Paulo"
                  value={editingInstitution.name}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, name: e.target.value })}
                  className={styles.editDialogInput}
                />
              </div>
              <div className={styles.editDialogActions}>
                <Button variant="outline" onClick={() => setEditingInstitution(null)}>
                  Cancelar
                </Button>
                <Button variant="gradient" onClick={handleRequestSaveInstitution}>
                  {editingInstitution.id ? 'Salvar Alterações' : 'Adicionar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Edição/Adição de Curso */}
      <AnimatePresence>
        {editingCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setEditingCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.editDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.editDialogTitle}>
                {editingCourse.id ? 'Editar Curso' : 'Adicionar Curso'}
              </h2>
              <div className={styles.editDialogBody}>
                <Label htmlFor="courseName">Nome do Curso</Label>
                <Input
                  id="courseName"
                  type="text"
                  placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className={styles.editDialogInput}
                />
              </div>
              <div className={styles.editDialogActions}>
                <Button variant="outline" onClick={() => setEditingCourse(null)}>
                  Cancelar
                </Button>
                <Button variant="gradient" onClick={handleRequestSaveCourse}>
                  {editingCourse.id ? 'Salvar Alterações' : 'Adicionar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmação de Salvamento de Instituição */}
      <AnimatePresence>
        {pendingSaveInstitution && editingInstitution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setPendingSaveInstitution(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.confirmDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIconBlue}>
                <CheckCircle />
              </div>
              <h2 className={styles.confirmTitle}>
                {editingInstitution.id ? 'Confirmar Edição' : 'Confirmar Adição'}
              </h2>
              {editingInstitution.id ? (
                <>
                  <p className={styles.confirmMessage}>
                    Você está prestes a alterar o nome da instituição de{' '}
                    <strong className={styles.oldValue}>"{editingInstitution.originalName}"</strong> para{' '}
                    <strong className={styles.newValue}>"{editingInstitution.name}"</strong>.
                  </p>
                  <p className={styles.confirmWarningInfo}>
                    Esta alteração afetará todos os registros relacionados a esta instituição.
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.confirmMessage}>
                    Você está prestes a adicionar a instituição{' '}
                    <strong className={styles.newValue}>"{editingInstitution.name}"</strong>.
                  </p>
                  <p className={styles.confirmWarningInfo}>
                    Certifique-se de que não há duplicatas no sistema.
                  </p>
                </>
              )}
              <div className={styles.confirmActions}>
                <Button variant="outline" onClick={() => setPendingSaveInstitution(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="gradient" 
                  className={styles.confirmSaveButton}
                  onClick={handleConfirmSaveInstitution}
                >
                  <CheckCircle className={styles.buttonIcon} />
                  Confirmar {editingInstitution.id ? 'Edição' : 'Adição'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmação de Salvamento de Curso */}
      <AnimatePresence>
        {pendingSaveCourse && editingCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setPendingSaveCourse(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.confirmDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIconBlue}>
                <CheckCircle />
              </div>
              <h2 className={styles.confirmTitle}>
                {editingCourse.id ? 'Confirmar Edição' : 'Confirmar Adição'}
              </h2>
              {editingCourse.id ? (
                <>
                  <p className={styles.confirmMessage}>
                    Você está prestes a alterar o nome do curso de{' '}
                    <strong className={styles.oldValue}>"{editingCourse.originalName}"</strong> para{' '}
                    <strong className={styles.newValue}>"{editingCourse.name}"</strong>.
                  </p>
                  <p className={styles.confirmWarningInfo}>
                    Esta alteração afetará todos os registros relacionados a este curso.
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.confirmMessage}>
                    Você está prestes a adicionar o curso{' '}
                    <strong className={styles.newValue}>"{editingCourse.name}"</strong>.
                  </p>
                  <p className={styles.confirmWarningInfo}>
                    Certifique-se de que não há duplicatas no sistema.
                  </p>
                </>
              )}
              <div className={styles.confirmActions}>
                <Button variant="outline" onClick={() => setPendingSaveCourse(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="gradient" 
                  className={styles.confirmSaveButton}
                  onClick={handleConfirmSaveCourse}
                >
                  <CheckCircle className={styles.buttonIcon} />
                  Confirmar {editingCourse.id ? 'Edição' : 'Adição'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmação de Exclusão de Instituição */}
      <AnimatePresence>
        {showDeleteInstitutionConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowDeleteInstitutionConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.confirmDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIcon}>
                <AlertCircle />
              </div>
              <h2 className={styles.confirmTitle}>Confirmar Exclusão</h2>
              <p className={styles.confirmMessage}>
                Você está prestes a excluir a instituição <strong>{institutionsList.find(i => i.id === showDeleteInstitutionConfirm)?.name}</strong>.
              </p>
              <p className={styles.confirmWarning}>
                Esta ação é <strong>irreversível</strong>. Todos os dados relacionados a esta instituição podem ser afetados.
              </p>
              <div className={styles.confirmActions}>
                <Button variant="outline" onClick={() => setShowDeleteInstitutionConfirm(null)}>
                  Cancelar
                </Button>
                <Button 
                  variant="gradient" 
                  className={styles.confirmDeleteButton}
                  onClick={() => handleDeleteInstitution(showDeleteInstitutionConfirm)}
                >
                  <Trash2 className={styles.buttonIcon} />
                  Confirmar Exclusão
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmação de Exclusão de Curso */}
      <AnimatePresence>
        {showDeleteCourseConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowDeleteCourseConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.confirmDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIcon}>
                <AlertCircle />
              </div>
              <h2 className={styles.confirmTitle}>Confirmar Exclusão</h2>
              <p className={styles.confirmMessage}>
                Você está prestes a excluir o curso <strong>{coursesList.find(c => c.id === showDeleteCourseConfirm)?.name}</strong>.
              </p>
              <p className={styles.confirmWarning}>
                Esta ação é <strong>irreversível</strong>. Todos os dados relacionados a este curso podem ser afetados.
              </p>
              <div className={styles.confirmActions}>
                <Button variant="outline" onClick={() => setShowDeleteCourseConfirm(null)}>
                  Cancelar
                </Button>
                <Button 
                  variant="gradient" 
                  className={styles.confirmDeleteButton}
                  onClick={() => handleDeleteCourse(showDeleteCourseConfirm)}
                >
                  <Trash2 className={styles.buttonIcon} />
                  Confirmar Exclusão
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog de Confirmação de Exclusão de Usuários */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.confirmDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIcon}>
                <AlertCircle />
              </div>
              <h2 className={styles.confirmTitle}>Confirmar Exclusão</h2>
              <p className={styles.confirmMessage}>
                Você está prestes a excluir <strong>{selectedForDeletion.length}</strong> usuário{selectedForDeletion.length !== 1 ? 's' : ''} inativo{selectedForDeletion.length !== 1 ? 's' : ''}.
              </p>
              <p className={styles.confirmWarning}>
                Esta ação é <strong>irreversível</strong>. Todos os dados destes usuários serão permanentemente removidos do sistema.
              </p>
              <div className={styles.confirmActions}>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="gradient" 
                  className={styles.confirmDeleteButton}
                  onClick={confirmDelete}
                >
                  <Trash2 className={styles.buttonIcon} />
                  Confirmar Exclusão
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes do Usuário */}
      <AnimatePresence>
        {showStudentDetails && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowStudentDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header do Modal */}
              <div className={styles.modalHeader}>
                <div>
                  <h2 className={styles.modalTitle}>Detalhes do Usuário</h2>
                  <p className={styles.modalSubtitle}>Informações completas e avaliações</p>
                </div>
                <button 
                  className={styles.modalClose}
                  onClick={() => setShowStudentDetails(false)}
                >
                  <XCircle />
                </button>
              </div>

              {/* Informações do Estudante */}
              <div className={styles.modalBody}>
                <div className={styles.studentInfoCard}>
                  <div className={styles.studentInfoHeader}>
                    <div className={styles.studentAvatar}>
                      {selectedStudent.anonymousId.split('-')[1].substring(0, 2)}
                    </div>
                    <div>
                      <h3 className={styles.studentId}>{selectedStudent.anonymousId}</h3>
                      <span className={`${styles.badge} ${
                        selectedStudent.status === 'active' 
                          ? styles.badgeSuccess 
                          : selectedStudent.status === 'locked'
                          ? styles.badgeWarning
                          : styles.badgeError
                      }`}>
                        {selectedStudent.status === 'active' ? 'Ativo' : selectedStudent.status === 'locked' ? 'Trancado' : 'Inativo'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.studentInfoGrid}>
                    <div className={styles.infoItem}>
                      <Building2 className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Instituição</span>
                        <span className={styles.infoValue}>{selectedStudent.institution}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <GraduationCap className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Curso</span>
                        <span className={styles.infoValue}>{selectedStudent.course}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <Calendar className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Semestre</span>
                        <span className={styles.infoValue}>{selectedStudent.semester}º Semestre</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <Star className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Média Geral</span>
                        <span className={styles.infoValue}>
                          {selectedStudent.totalEvaluations > 0 
                            ? `★ ${selectedStudent.averageRating.toFixed(1)}`
                            : '—'
                          }
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <FileText className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Total de Avaliações</span>
                        <span className={styles.infoValue}>{selectedStudent.totalEvaluations}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <Clock className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Última Avaliação</span>
                        <span className={styles.infoValue}>
                          {selectedStudent.totalEvaluations > 0
                            ? new Date(selectedStudent.lastEvaluationDate).toLocaleDateString('pt-BR')
                            : '—'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avaliações do Estudante */}
                {selectedStudent.totalEvaluations > 0 && (
                  <div className={styles.evaluationsSection}>
                    <h3 className={styles.evaluationsSectionTitle}>
                      Histórico de Avaliações
                    </h3>
                    <div className={styles.evaluationsList}>
                      {studentEvaluations.map((evaluation, index) => (
                        <motion.div
                          key={evaluation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={styles.evaluationCard}
                        >
                          <div className={styles.evaluationHeader}>
                            <div>
                              <span className={styles.evaluationId}>{evaluation.id}</span>
                              <span className={styles.evaluationCategory}>{evaluation.category}</span>
                            </div>
                            <div className={styles.evaluationMeta}>
                              <span className={styles.evaluationDate}>
                                {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span className={styles.evaluationRating}>
                                ★ {evaluation.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div className={styles.evaluationQuestions}>
                            {evaluation.questions.map((q, qIndex) => (
                              <div key={qIndex} className={styles.questionItem}>
                                <span className={styles.questionText}>{q.question}</span>
                                <div className={styles.questionRating}>
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`${styles.star} ${i < q.rating ? styles.starFilled : ''}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStudent.totalEvaluations === 0 && (
                  <div className={styles.noEvaluations}>
                    <FileText className={styles.noEvaluationsIcon} />
                    <p>Este usuário ainda não realizou nenhuma avaliação</p>
                  </div>
                )}
              </div>

              {/* Footer do Modal */}
              <div className={styles.modalFooter}>
                <Button variant="outline" onClick={() => setShowStudentDetails(false)}>
                  Fechar
                </Button>
                <Button variant="gradient">
                  <Download className={styles.buttonIcon} />
                  Exportar Dados
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
