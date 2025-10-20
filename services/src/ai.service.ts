import { openai } from './lib/openai';
import { env } from './config/env';

interface AIOptions {
  temperature?: number;
  model?: string;
  response_format?: 'structured' | 'strict';
}

// Simple array to keep chat messages in memory
const chatHistory: { role: string; content: string }[] = [];

export async function generateResponse(
  prompt: string,
  options: AIOptions = {}
) {
  const isStrictRequired =
    options.response_format === 'strict' ||
    env.OPENAI_RESPONSE_FORMAT === 'strict';

  const response = await openai.responses.create({
    model: env.OPENAI_MODEL,
    input: prompt,
    temperature: options.temperature ?? env.OPENAI_TEMPERATURE,
    ...(isStrictRequired ? { response_format: { type: 'json_object' as const } } : {})
  });

  return response.output_text ?? '';
}

export async function generateResponseFromContext(
  prompt: string,
  options: AIOptions = {}
) {
  const isStrictRequired =
    options.response_format === 'strict' ||
    env.OPENAI_RESPONSE_FORMAT === 'strict';

  // Add user message to history
  chatHistory.push({ role: 'user', content: prompt });

  const response = await openai.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: chatHistory.map((m) => `${m.role}: ${m.content}`).join('\n'),
          },
        ],
      },
    ],
    ...(isStrictRequired ? { response_format: { type: 'json_object' as const } } : {})
  });

  const answer = response.output_text ?? '';

  // Add model reply to history for next call
  chatHistory.push({ role: "assistant", content: answer });
  
  return answer;
}