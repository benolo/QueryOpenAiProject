import { openai } from './lib/openai';
import { analyzeFoodImageSchema, env, analyzeFoodPrompt } from './config/env';
import { createRun, updateRun } from './lib/langsmith';

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

  // Start LangSmith tracing
  const run = await createRun('generate-response', {
    prompt,
    store,
    temperature: options.temperature ?? env.OPENAI_TEMPERATURE,
    model: env.OPENAI_MODEL,
    response_format: isStrictRequired ? 'json_object' : 'text',
    previous_message_id: previousMessageId
  });

  try {
    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      store: store,
      previous_response_id: previousMessageId,
      temperature: options.temperature ?? env.OPENAI_TEMPERATURE,
      input: prompt,
      ...(isStrictRequired ? { response_format: { type: 'json_object' as const } } : {})
    });

    if (store) previousMessageId = response.id

    const answer = response.output_text ?? '';

    // Update LangSmith with successful result
    if (run?.id) {
      await updateRun(run.id, {
        response: answer,
        tokens_used: response.usage?.total_tokens || 0,
        response_id: response.id
      });
    }

  // 🧾 Log request data in a pretty format
  // console.log('--- Incoming Response ---');
  // console.log('Body:', JSON.stringify(response, null, 2));
  // console.log('------------------------');


    return answer;
  } catch (error) {
    // Update LangSmith with error
    if (run?.id) {
      await updateRun(run.id, {
        error: error instanceof Error ? error.message : String(error)
      });
    }
    throw error;
  }
}


export async function analyzeFoodImage(base64Image: string) {
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;
  
  // Start LangSmith tracing
  const run = await createRun('analyze-food-image', {
    prompt: analyzeFoodPrompt,
    image_size: base64Image.length,
    model: env.OPENAI_MODEL
  });

  try {
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
    const result = analyzeFoodImageSchema.parse(JSON.parse(jsonText));
    
    // Update LangSmith with successful result
    if (run?.id) {
      await updateRun(run.id, {
        response: result,
        tokens_used: response.usage?.total_tokens || 0
      });
    }
    
    return result;
  } catch (error) {
    // Update LangSmith with error
    if (run?.id) {
      await updateRun(run.id, {
        error: error instanceof Error ? error.message : String(error)
      });
    }
    throw error;
  }
}


