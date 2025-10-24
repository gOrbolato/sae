import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { hashPassword } from '../services/AuthService';

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { anonymous_id, email, password, role, institution, course, semester, status } = req.body;

    if (!email || !password || !anonymous_id) {
      return res.status(400).json({ message: 'Anonymous ID, email and password are required' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const userId = await UserModel.create({
      anonymous_id,
      email,
      password: hashedPassword,
      role: role || 'student',
      institution,
      course,
      semester,
      status: status || 'active',
      last_activity_date: new Date(),
    });

    res.status(201).json({ message: 'User created successfully', id: userId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, role, institution, course, semester, status } = req.body;

    const user = await UserModel.findById(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedFields: any = {};
    if (email) updatedFields.email = email;
    if (role) updatedFields.role = role;
    if (institution) updatedFields.institution = institution;
    if (course) updatedFields.course = course;
    if (semester) updatedFields.semester = semester;
    if (status) updatedFields.status = status;
    if (password) updatedFields.password = await hashPassword(password);

    await UserModel.update(parseInt(id), updatedFields);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await UserModel.delete(parseInt(id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
