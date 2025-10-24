import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: object): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const expiresInValue: string = JWT_EXPIRES_IN;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInValue } as jwt.SignOptions);
};

export const verifyToken = (token: string): string | object => {
  return jwt.verify(token, JWT_SECRET);
};
