// src/utils/llmClient.ts
import axios from 'axios';

// Define a simple type for the messages array
interface SimpleMessage {
  role: string;
  content: string;
}

// Ensure you have the GROQ_API_KEY environment variable set
import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

export async function callLLM(messages: SimpleMessage[]): Promise<string> {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      { logLevel: 'debug',
        model: MODEL,
        messages,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices?.[0]?.message?.content?.trim() || '';
  } catch (error: any) {
    console.error('🛑 Error calling Groq LLM:', error?.message || error);
    throw new Error('LLM call failed');
  }
}