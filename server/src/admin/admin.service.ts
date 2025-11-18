import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AdminService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async normalChat(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in normal chat:', error);
      throw new InternalServerErrorException(`AI chat failed: ${error.message}`);
    }
  }

  async runCrewAI(prompt: string, password?: string): Promise<any> {
    const pythonScriptPath = path.join(process.cwd(), 'src', 'admin', 'agents', 'main_crew.py');

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [pythonScriptPath, prompt, password || '']);

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(`Python stdout: ${data.toString()}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(`Python stderr: ${data.toString()}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}: ${stderr}`);
          try {
            const errorOutput = JSON.parse(stderr);
            return reject(new InternalServerErrorException(errorOutput.error || 'Python script error.'));
          } catch {
            return reject(new InternalServerErrorException(`Python script failed: ${stderr || 'Unknown error'}`));
          }
        }
        try {
          const result = JSON.parse(stdout.split('\n').filter(Boolean).pop() || '{}');
          resolve(result);
        } catch (parseError) {
          console.error('Failed to parse Python script output as JSON:', stdout);
          reject(new InternalServerErrorException(`Failed to parse Python script output: ${parseError.message}. Raw output: ${stdout}`));
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python subprocess:', err);
        reject(new InternalServerErrorException(`Failed to start Python process: ${err.message}`));
      });
    });
  }
}