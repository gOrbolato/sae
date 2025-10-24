import { Request, Response } from 'express';
import { runAnalysisScript } from '../services/AnalysisService';

export const getAnalysisReport = async (req: Request, res: Response) => {
  const { institutionId, courseId, period } = req.query;

  try {
    const report = await runAnalysisScript(
      institutionId as string,
      courseId as string,
      period as string
    );
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating analysis report:', error);
    res.status(500).json({ message: 'Failed to generate analysis report' });
  }
};
