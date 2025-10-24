import { Request, Response } from 'express';
import { CourseModel } from '../models/CourseModel';

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await CourseModel.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting all courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findById(parseInt(id));
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error getting course by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Course name is required' });
    }
    const courseId = await CourseModel.create(name);
    res.status(201).json({ message: 'Course created successfully', id: courseId });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Course name is required' });
    }
    const course = await CourseModel.findById(parseInt(id));
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await CourseModel.update(parseInt(id), name);
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findById(parseInt(id));
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await CourseModel.delete(parseInt(id));
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
