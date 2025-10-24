import { Request, Response } from 'express';
import { InstitutionModel } from '../models/InstitutionModel';

export const getAllInstitutions = async (req: Request, res: Response) => {
  try {
    const institutions = await InstitutionModel.findAll();
    res.status(200).json(institutions);
  } catch (error) {
    console.error('Error getting all institutions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInstitutionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const institution = await InstitutionModel.findById(parseInt(id));
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    res.status(200).json(institution);
  } catch (error) {
    console.error('Error getting institution by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createInstitution = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Institution name is required' });
    }
    const institutionId = await InstitutionModel.create(name);
    res.status(201).json({ message: 'Institution created successfully', id: institutionId });
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateInstitution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Institution name is required' });
    }
    const institution = await InstitutionModel.findById(parseInt(id));
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    await InstitutionModel.update(parseInt(id), name);
    res.status(200).json({ message: 'Institution updated successfully' });
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteInstitution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const institution = await InstitutionModel.findById(parseInt(id));
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    await InstitutionModel.delete(parseInt(id));
    res.status(200).json({ message: 'Institution deleted successfully' });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
