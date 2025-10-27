import OpenAI from 'openai';
import { wrapOpenAI } from 'langsmith/wrappers';
import { env } from '../config/env';

// Create OpenAI client and wrap it for automatic LangSmith tracing
const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  organization: env.OPENAI_ORG_ID,
  maxRetries: env.OPENAI_MAX_RETRIES,
});

export const openai = env.LANGSMITH_TRACING === 'true' 
  ? wrapOpenAI(client) 
  : client;