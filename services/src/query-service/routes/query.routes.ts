import { Router, Request, Response } from 'express'
import { queryResearch, queryResearchFromContext } from '../controllers/query.controller';
import { env } from '../../config/env';

export const queryRouter: Router = Router();

export interface QueryResearchRequest {
    body: {
        text: string;
    };
    query: {
        mode?: string;
    };
}

console.log('Using OpenAI key ending:', env.OPENAI_API_KEY.slice(-6));
console.log('Using model:', env.OPENAI_MODEL);

queryRouter.post('/query', queryResearch);