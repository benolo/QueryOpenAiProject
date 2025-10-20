import 'dotenv/config';            
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  // --- OpenAI ---
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_ORG_ID: z.string().optional(),

  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  OPENAI_MAX_RETRIES: z.coerce.number().min(0).default(3),
  OPENAI_RESPONSE_FORMAT: z.enum(['structured', 'strict']).default('structured'),
});
export const env = EnvSchema.parse(process.env);