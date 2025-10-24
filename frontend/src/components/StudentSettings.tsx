import { useState } from 'react';
import { ArrowLeft, User, Mail, Building2, BookOpen, Clock, IdCard, Save, AlertTriangle, CalendarCheck, Hash } from 'lucide-react';
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Select } from './Select/Select';
import { Label } from './Label/Label';
import { toast } from 'sonner';
import styles from './StudentSettings.module.css';

interface StudentSettingsProps {
  onBack: () => void;
  userData?: {
    name: string;
    email: string;
    institution: string;
    course: string;
    period: string;
    semester?: string;
    expectedCompletion?: string;
    ra: string;
  };
}

export function StudentSettings({ onBack, userData }: StudentSettingsProps) {
  const [formData, setFormData] = useState({
    institution: userData?.institution || 'fatec-pp',
    course: userData?.course || 'ads',
    period: userData?.period || 'noturno',
    semester: userData?.semester || '',
    expectedCompletion: userData?.expectedCompletion || '',
    ra: userData?.ra || '',
  });

  const [showLockCourseDialog, setShowLockCourseDialog] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Alterações salvas com sucesso!', {
      description: 'Suas informações foram atualizadas.',
    });
  };

  const handleLockCourse = () => {
    toast.warning('Curso trancado', {
      description: 'Seu curso foi trancado. Entre em contato com a coordenação.',
    });
    setShowLockCourseDialog(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Configurações do Perfil</h1>
          <Button
            variant="outline"
            onClick={onBack}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.backIcon} />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Academic Data Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meus Dados Acadêmicos</h2>
            <div className={styles.titleUnderline}></div>
          </div>

          <form onSubmit={handleSave} className={styles.form}>
            {/* Name (Read Only) */}
            <div className={styles.field}>
              <Label htmlFor="name">Nome</Label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <Input
                  id="name"
                  type="text"
                  value={userData?.name || 'Guilherme Vinicius Araujo Orbolato'}
                  disabled
                  className={styles.input}
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className={styles.field}>
              <Label htmlFor="email">Email</Label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <Input
                  id="email"
                  type="email"
                  value={userData?.email || 'guilherme.orbolato@fatec.sp.gov.br'}
                  disabled
                  className={styles.input}
                />
              </div>
            </div>

            {/* Institution */}
            <div className={styles.field}>
              <Label htmlFor="institution">Instituição</Label>
              <div className={styles.inputWrapper}>
                <Building2 className={styles.inputIcon} />
                <Select
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className={styles.select}
                >
                  <option value="fatec-pp">Faculdade de Tecnologia de Presidente Prudente</option>
                  <option value="fatec-sp">Faculdade de Tecnologia de São Paulo</option>
                  <option value="fatec-sjc">Faculdade de Tecnologia de São José dos Campos</option>
                </Select>
              </div>
            </div>

            {/* Course */}
            <div className={styles.field}>
              <Label htmlFor="course">Curso</Label>
              <div className={styles.inputWrapper}>
                <BookOpen className={styles.inputIcon} />
                <Select
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className={styles.select}
                >
                  <option value="ads">Análise e Desenvolvimento de Sistemas</option>
                  <option value="dsi">Desenvolvimento de Software Multiplataforma</option>
                  <option value="gestao-ti">Gestão da Tecnologia da Informação</option>
                  <option value="banco-dados">Banco de Dados</option>
                </Select>
              </div>
            </div>

            {/* Period and Semester */}
            <div className={styles.twoColumns}>
              <div className={styles.field}>
                <Label htmlFor="period">Período</Label>
                <div className={styles.inputWrapper}>
                  <Clock className={styles.inputIcon} />
                  <Select
                    id="period"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className={styles.select}
                  >
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="noturno">Noturno</option>
                    <option value="integral">Integral</option>
                  </Select>
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="semester">Semestre Atual</Label>
                <div className={styles.inputWrapper}>
                  <Hash className={styles.inputIcon} />
                  <Input
                    id="semester"
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    placeholder="Ex: 8º"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Expected Completion */}
            <div className={styles.field}>
              <Label htmlFor="expectedCompletion">Previsão de Término do Curso</Label>
              <div className={styles.inputWrapper}>
                <CalendarCheck className={styles.inputIcon} />
                <Input
                  id="expectedCompletion"
                  type="month"
                  value={formData.expectedCompletion}
                  onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
                  placeholder="mm/aaaa"
                  className={styles.input}
                />
              </div>
              <p className={styles.helpText}>
                Selecione o mês e ano previstos para conclusão do seu curso.
              </p>
            </div>

            {/* RA */}
            <div className={styles.field}>
              <Label htmlFor="ra">RA (Registro Acadêmico)</Label>
              <div className={styles.inputWrapper}>
                <IdCard className={styles.inputIcon} />
                <Input
                  id="ra"
                  type="text"
                  value={formData.ra}
                  onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
                  placeholder="Digite seu RA"
                  className={styles.input}
                />
              </div>
              <p className={styles.helpText}>
                O RA só pode ser alterado se você trocar de instituição e de curso.
              </p>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              variant="gradient"
              className={styles.saveButton}
            >
              <Save className={styles.saveIcon} />
              Salvar Alterações
            </Button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className={styles.dangerSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.dangerTitle}>Zona de Perigo</h2>
            <div className={styles.dangerUnderline}></div>
          </div>

          <div className={styles.dangerContent}>
            <div className={styles.dangerWarning}>
              <AlertTriangle className={styles.dangerIcon} />
              <p className={styles.dangerText}>
                A ação abaixo é irreversível e só pode ser desfeita no próximo período de rematrícula.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowLockCourseDialog(true)}
              className={styles.dangerButton}
            >
              Trancar Curso
            </Button>
          </div>
        </div>
      </div>

      {/* Lock Course Confirmation Dialog */}
      {showLockCourseDialog && (
        <div className={styles.dialogOverlay} onClick={() => setShowLockCourseDialog(false)}>
          <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogIcon}>
              <AlertTriangle />
            </div>
            <h3 className={styles.dialogTitle}>Confirmar Trancamento de Curso</h3>
            <p className={styles.dialogDescription}>
              Tem certeza que deseja trancar seu curso? Esta ação é irreversível e só poderá ser 
              desfeita no próximo período de rematrícula. Você perderá acesso a todas as funcionalidades 
              da plataforma.
            </p>
            <div className={styles.dialogActions}>
              <Button
                variant="outline"
                onClick={() => setShowLockCourseDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={handleLockCourse}
                className={styles.confirmDangerButton}
              >
                Sim, Trancar Curso
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
