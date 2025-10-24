import pool from '../config/db';

export interface Course {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export class CourseModel {
  static async create(name: string): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO courses (name) VALUES (?)',
      [name]
    );
    return (result as any).insertId;
  }

  static async findAll(): Promise<Course[]> {
    const [rows] = await pool.query<Course[]>('SELECT * FROM courses');
    return rows;
  }

  static async findById(id: number): Promise<Course | null> {
    const [rows] = await pool.query<Course[]>('SELECT * FROM courses WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async update(id: number, name: string): Promise<void> {
    await pool.query('UPDATE courses SET name = ? WHERE id = ?', [name, id]);
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
  }
}
