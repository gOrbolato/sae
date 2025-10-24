import pool from '../config/db';
import { User } from './User';
import { RowDataPacket } from 'mysql2/promise';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    return (rows[0] as User) || null;
  }

  static async create(user: User): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO users (anonymous_id, email, password, role, institution, course, semester, status, last_activity_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user.anonymous_id, user.email, user.password, user.role, user.institution, user.course, user.semester, user.status, user.last_activity_date]
    );
    return (result as any).insertId;
  }

  static async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    return (rows[0] as User) || null;
  }

  static async findAll(): Promise<User[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users');
    return rows as User[];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }

  static async update(id: number, user: Partial<User>): Promise<void> {
    const fields = Object.keys(user).map(key => `${key} = ?`).join(', ');
    const values = Object.values(user);
    await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
  }
}