import { analyzeMockResume } from '../services/ai.service.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const analyzeResume = async (req, res, next) => {
  console.log('--- API HIT: POST /api/resume/analyze ---');
  try {
    if (!req.file) {
      console.error('Error: No file uploaded');
      return res.status(400).json({ error: "Something went wrong" });
    }

    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    console.log(`Extracted resume text length: ${resumeText?.length || 0} characters`);

    if (!resumeText || resumeText.trim().length === 0) {
      console.error('Error: Extracted text is empty');
      return res.json({ feedback: "Could not extract text from resume." });
    }
    
    // Call AI service
    console.log('Sending text to AI service...');
    const feedback = await analyzeMockResume(resumeText);
    
    console.log('AI Response received successfully');

    return res.json({ feedback });
  } catch (error) {
    console.error('Error in analyzeResume controller:', error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
