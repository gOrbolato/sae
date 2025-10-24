import { Request, Response } from 'express';
import { EvaluationModel, Evaluation, EvaluationQuestion } from '../models/EvaluationModel';

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const createEvaluation = async (req: AuthRequest, res: Response) => {
  const { institution_id, course_id, overall_rating, category, comments, questions } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!institution_id || !course_id || !overall_rating || !questions) {
    return res.status(400).json({ message: 'Missing required evaluation fields' });
  }

  try {
    const newEvaluation: Evaluation = {
      user_id,
      institution_id,
      course_id,
      overall_rating,
      category,
      comments,
    };

    const evaluationId = await EvaluationModel.create(newEvaluation, questions);
    res.status(201).json({ message: 'Evaluation created successfully', id: evaluationId });
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEvaluationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evaluation = await EvaluationModel.findById(parseInt(id));
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    const questions = await EvaluationModel.findQuestionsByEvaluationId(parseInt(id));
    res.status(200).json({ ...evaluation, questions });
  } catch (error) {
    console.error('Error getting evaluation by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllEvaluations = async (req: Request, res: Response) => {
  try {
    const evaluations = await EvaluationModel.findAll();
    res.status(200).json(evaluations);
  } catch (error) {
    console.error('Error getting all evaluations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteEvaluation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evaluation = await EvaluationModel.findById(parseInt(id));
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    await EvaluationModel.delete(parseInt(id));
    res.status(200).json({ message: 'Evaluation deleted successfully' });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
