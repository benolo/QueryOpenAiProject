import { Client } from 'langsmith';
import { env } from '../config/env';

// Initialize LangSmith client
export const langsmithClient = env.LANGSMITH_API_KEY ? new Client({
  apiKey: env.LANGSMITH_API_KEY,
}) : null;

// Helper function to create a run
export const createRun = async (name: string, inputs: any, outputs?: any): Promise<any | null> => {
  console.log('LangSmith tracing enabled:', env.LANGSMITH_TRACING);
  console.log('LangSmith API key present:', !!env.LANGSMITH_API_KEY);
  console.log('LangSmith project:', env.LANGSMITH_PROJECT);
  
  if (env.LANGSMITH_TRACING !== 'true') {
    console.log('LangSmith tracing disabled, skipping...');
    return null;
  }
  
  if (!langsmithClient) {
    console.log('LangSmith client not initialized - no API key');
    return null;
  }
  
  try {
    console.log('Creating LangSmith run:', name);
    const run = await langsmithClient.createRun({
      name,
      run_type: 'llm',
      inputs,
      outputs,
      project_name: env.LANGSMITH_PROJECT,
    });
    console.log('LangSmith run created:', (run as any)?.id);
    return run;
  } catch (error) {
    console.error('LangSmith tracing failed:', error);
    return null;
  }
};

// Helper function to update run with outputs
export const updateRun = async (runId: string, outputs: any) => {
  if (env.LANGSMITH_TRACING !== 'true' || !langsmithClient) return;
  
  try {
    console.log('Updating LangSmith run:', runId);
    await langsmithClient.updateRun(runId, { outputs });
    console.log('LangSmith run updated successfully');
  } catch (error) {
    console.error('LangSmith update failed:', error);
  }
};
