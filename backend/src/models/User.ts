export interface User {
  id?: number;
  anonymous_id: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  institution?: string;
  course?: string;
  semester?: number;
  status?: 'active' | 'inactive' | 'locked';
  last_evaluation_date?: Date;
  last_activity_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}
