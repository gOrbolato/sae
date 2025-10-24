import { Request, Response } from 'express';
import { hashPassword, comparePasswords, generateToken } from '../services/AuthService';
import pool from '../config/db';
import { User } from '../models/User';
import { RowDataPacket } from 'mysql2/promise';

export const register = async (req: Request, res: Response) => {
  const { email, password, role, institution, course, semester } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>( 'SELECT * FROM users WHERE email = ?', [email]);
    const existingUser = rows as User[];

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const anonymous_id = `USR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const newUser: User = {
      anonymous_id,
      email,
      password: hashedPassword,
      role: role || 'student',
      institution: institution || null,
      course: course || null,
      semester: semester || null,
      status: 'active',
      last_activity_date: new Date(),
    };

    const [result] = await pool.query(
      'INSERT INTO users (anonymous_id, email, password, role, institution, course, semester, status, last_activity_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newUser.anonymous_id, newUser.email, newUser.password, newUser.role, newUser.institution, newUser.course, newUser.semester, newUser.status, newUser.last_activity_date]
    );

    const insertedId = (result as any).insertId;
    const token = generateToken({ id: insertedId, role: newUser.role });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>( 'SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (!user.password) {
      return res.status(500).json({ message: 'User password not found' });
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>( 'SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Gerar token de redefinição de senha (exemplo simples, em produção usar algo mais robusto)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, resetToken, expiresAt]
    );

    // Em um ambiente de produção, você enviaria este token por e-mail ao usuário.
    console.log(`Password reset token for ${user.email}: ${resetToken}`);

    res.status(200).json({ message: 'Password reset token sent to email (check console for now)' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const [tokens] = await pool.query<any[]>( 'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()', [token]);

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const resetToken = tokens[0];

    const hashedPassword = await hashPassword(newPassword);

    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, resetToken.user_id]
    );

    await pool.query(
      'DELETE FROM password_reset_tokens WHERE id = ?',
      [resetToken.id]
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};