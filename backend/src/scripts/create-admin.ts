import readline from 'readline';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

console.log('DEBUG: DB_USER =', process.env.DB_USER);
console.log('DEBUG: DB_PASSWORD =', process.env.DB_PASSWORD);
import { hashPassword } from '../services/AuthService';
import pool from '../config/db';
import { User } from '../models/User';
import { RowDataPacket } from 'mysql2/promise';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string) => new Promise<string>(resolve => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    console.log('\n--- Criar Usuário Administrador ---');
    const email = await question('Email do Administrador: ');
    const password = await question('Senha do Administrador: ');

    if (!email || !password) {
      console.error('Email e senha são obrigatórios.');
      rl.close();
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    const existingUser = rows as User[];

    if (existingUser.length > 0) {
      console.error('Usuário com este email já existe.');
      rl.close();
      return;
    }

    const hashedPassword = await hashPassword(password);
    const anonymous_id = `ADM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const newAdmin: User = {
      anonymous_id,
      email,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      last_activity_date: new Date(),
    };

    await pool.query(
      'INSERT INTO users (anonymous_id, email, password, role, status, last_activity_date) VALUES (?, ?, ?, ?, ?, ?)',
      [newAdmin.anonymous_id, newAdmin.email, newAdmin.password, newAdmin.role, newAdmin.status, newAdmin.last_activity_date]
    );

    console.log('Usuário administrador criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
};

createAdmin();
