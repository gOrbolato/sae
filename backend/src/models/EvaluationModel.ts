import pool from '../config/db';

export interface Evaluation {
  id?: number;
  user_id: number;
  institution_id: number;
  course_id: number;
  overall_rating: number;
  category?: string;
  evaluation_date?: Date;
  comments?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EvaluationQuestion {
  id?: number;
  evaluation_id: number;
  question: string;
  rating: number;
  created_at?: Date;
  updated_at?: Date;
}

export class EvaluationModel {
  static async create(evaluation: Evaluation, questions: EvaluationQuestion[]): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO evaluations (user_id, institution_id, course_id, overall_rating, category, comments) VALUES (?, ?, ?, ?, ?, ?)',
      [evaluation.user_id, evaluation.institution_id, evaluation.course_id, evaluation.overall_rating, evaluation.category, evaluation.comments]
    );
    const evaluationId = (result as any).insertId;

    for (const question of questions) {
      await pool.query(
        'INSERT INTO evaluation_questions (evaluation_id, question, rating) VALUES (?, ?, ?)',
        [evaluationId, question.question, question.rating]
      );
    }
    return evaluationId;
  }

  static async findById(id: number): Promise<Evaluation | null> {
    const [rows] = await pool.query<Evaluation[]>('SELECT * FROM evaluations WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findAll(): Promise<Evaluation[]> {
    const [rows] = await pool.query<Evaluation[]>('SELECT * FROM evaluations');
    return rows;
  }

  static async findQuestionsByEvaluationId(evaluationId: number): Promise<EvaluationQuestion[]> {
    const [rows] = await pool.query<EvaluationQuestion[]>('SELECT * FROM evaluation_questions WHERE evaluation_id = ?', [evaluationId]);
    return rows;
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM evaluations WHERE id = ?', [id]);
  }
}
