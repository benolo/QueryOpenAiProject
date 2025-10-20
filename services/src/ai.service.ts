import { openai } from './lib/openai';
import { env } from './config/env';

interface AIOptions {
  temperature?: number;
  model?: string;
  response_format?: 'structured' | 'strict';
}
let previousMessageId: string | null = null

export async function generateResponseWithOptionalContext(
  prompt: string,
  store?: boolean | null,
  options: AIOptions = {}
) {
  const isStrictRequired =
    options.response_format === 'strict' ||
    env.OPENAI_RESPONSE_FORMAT === 'strict';

  const response = await openai.responses.create({
    model: env.OPENAI_MODEL,
    store: store,
    previous_response_id: previousMessageId,
    temperature: options.temperature ?? env.OPENAI_TEMPERATURE,
    input: prompt,
    ...(isStrictRequired ? { response_format: { type: 'json_object' as const } } : {})
  });

  if (store) previousMessageId = response.id

  // 🧾 Log request data in a pretty format
  // console.log('--- Incoming Response ---');
  // console.log('Body:', JSON.stringify(response, null, 2));
  // console.log('------------------------');

  const answer = response.output_text ?? '';
  
  return answer;
}