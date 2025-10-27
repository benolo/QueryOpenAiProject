import { openai } from './lib/openai';
import { analyzeFoodImageSchema, env, analyzeFoodPrompt } from './config/env';
import { traceable } from 'langsmith/traceable';

interface AIOptions {
  temperature?: number;
  model?: string;
  response_format?: 'structured' | 'strict';
}
let previousMessageId: string | null = null

export const generateResponseWithOptionalContext = traceable(async (
  prompt: string,
  store?: boolean | null,
  options: AIOptions = {}
) => {
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
});

export const analyzeFoodImage = traceable(async (base64Image: string) => {
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await openai.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: analyzeFoodPrompt },
          { type: "input_image", image_url: dataUrl, detail: "auto" }
        ]
      }
    ]
  });

  const jsonText = response.output_text ?? "{}";
  return analyzeFoodImageSchema.parse(JSON.parse(jsonText));
});