import { spawn } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PYTHON_PATH = process.env.PYTHON_PATH || 'python';

export const runAnalysisScript = (institutionId: string = 'all', courseId: string = 'all', period: string = 'all'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../scripts/analyze_evaluations.py');
    const pythonProcess = spawn(PYTHON_PATH, [scriptPath, institutionId, courseId, period]);

    let scriptOutput = '';
    let scriptError = '';

    pythonProcess.stdout.on('data', (data) => {
      scriptOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      scriptError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}: ${scriptError}`);
        return reject(new Error(`Python script error: ${scriptError}`));
      }
      try {
        resolve(JSON.parse(scriptOutput));
      } catch (e) {
        console.error('Failed to parse Python script output:', scriptOutput, e);
        reject(new Error('Failed to parse Python script output'));
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python subprocess:', err);
      reject(new Error(`Failed to start Python subprocess: ${err.message}`));
    });
  });
};
