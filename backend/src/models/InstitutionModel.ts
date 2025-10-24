import pool from '../config/db';

export interface Institution {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export class InstitutionModel {
  static async create(name: string): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO institutions (name) VALUES (?)',
      [name]
    );
    return (result as any).insertId;
  }

  static async findAll(): Promise<Institution[]> {
    const [rows] = await pool.query<Institution[]>('SELECT * FROM institutions');
    return rows;
  }

  static async findById(id: number): Promise<Institution | null> {
    const [rows] = await pool.query<Institution[]>('SELECT * FROM institutions WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async update(id: number, name: string): Promise<void> {
    await pool.query('UPDATE institutions SET name = ? WHERE id = ?', [name, id]);
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM institutions WHERE id = ?', [id]);
  }
}
