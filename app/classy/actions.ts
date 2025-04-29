'use server';

import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is in your .env.local
});

// File system paths
const UPLOADS_FOLDER = path.join(process.cwd(), 'public', 'local-uploads', 'uploaded-files');
const METADATA_FOLDER = path.join(process.cwd(), 'app', 'data', 'user-upload-data');

// Fetch uploaded file metadata (JSON) for the current user
export async function fetchUserUploadsByEmail(email: string) {
  try {
    const filePath = path.join(METADATA_FOLDER, `${email}.json`);
    const buffer = await fs.readFile(filePath, 'utf-8');
    
    return JSON.parse(buffer);
  } catch (error) {
    console.error("Could not load uploads:", error);
    return [];
  }
}

// Generate AI feedback on the uploaded file's content
export async function generateFeedbackFromFilename(email: string, filename: string, customInstructions: string = '') {
  const fullPath = path.join(UPLOADS_FOLDER, filename);

  try {
    const buffer = await fs.readFile(fullPath);

    if (!buffer || buffer.length === 0) {
      throw new Error("The file is empty or unreadable.");
    }

    let fileText = '';

    if (filename.endsWith('.pdf')) {
      const extract = require('pdf-text-extract');
      fileText = await new Promise<string>((resolve, reject) => {
        extract(fullPath, (err: any, pages: string[]) => {
          if (err) return reject(err);
          resolve(pages.join('\n'));
        });
      });
    } else {
      fileText = buffer.toString('utf-8');
    }

    const trimmed = fileText.substring(0, 4000);

    const userPrompt = customInstructions
      ? `Please follow these instructions: ${customInstructions}\n\nHere is the uploaded content:\n\n${trimmed}`
      : `Here is the uploaded content:\n\n${trimmed}\n\nPlease give general feedback. Sign the response as "Classy".`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert reviewer. Provide clear, constructive, and polite feedback.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.3,
    });

    return chat.choices[0].message?.content || 'No feedback returned.';
  } catch (err) {
    console.error('Feedback generation failed:', err);
    return 'Error generating feedback.';
  }
}