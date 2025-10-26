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

  // --- LangSmith ---
  LANGSMITH_API_KEY: z.string().optional(),
  LANGSMITH_PROJECT: z.string().default('default'),
  LANGSMITH_TRACING: z.enum(['true', 'false']).default('false'),
});
export const env = EnvSchema.parse(process.env);


const FoodAnalysisSchema = z.object({
  meal_name: z.string(),
  total_weight: z.object({
    grams: z.number(),
    ounces: z.number()
  }),
  total_calories: z.number(),
  total_macronutrients: z.object({
    protein_g: z.number(),
    carbohydrates_g: z.number(),
    fat_g: z.number()
  }),
  ingredients: z.array(
    z.object({
      name: z.string(),
      weight: z.object({
        grams: z.number(),
        ounces: z.number()
      }),
      calories: z.number(),
      macronutrients: z.object({
        protein_g: z.number(),
        carbohydrates_g: z.number(),
        fat_g: z.number()
      })
    })
  )
});

export const analyzeFoodImageSchema = FoodAnalysisSchema;


export const analyzeFoodPrompt = `
You are a nutrition analysis assistant.
Analyze the food items visible in the image and return a JSON object that strictly follows this structure:

{
  "meal_name": string,
  "total_weight": {
    "grams": number,
    "ounces": number
  },
  "total_calories": number,
  "total_macronutrients": {
    "protein_g": number,
    "carbohydrates_g": number,
    "fat_g": number
  },
  "ingredients": [
    {
      "name": string,
      "weight": {
        "grams": number,
        "ounces": number
      },
      "calories": number,
      "macronutrients": {
        "protein_g": number,
        "carbohydrates_g": number,
        "fat_g": number
      }
    }
  ]
}

CRITICAL: Return ONLY the raw JSON object. Do NOT wrap it in markdown code blocks, do NOT add explanations, do NOT include any text before or after the JSON. Start your response with { and end with }.

Rules:
- Respond ONLY in valid JSON format
- Round all numeric values to 1 decimal place
- Include both grams and ounces for all weights
- Summarize the meal under 'meal_name'
- No markdown formatting, no code blocks, no explanations
`;