import { Router, Request, Response } from 'express'
import { queryResearch } from '../controllers/query.controller';

export const queryRouter: Router = Router();

export interface QueryResearchRequest extends Request{
    body: {
        text: string;
        store?: boolean | null 
    };
}

queryRouter.post('/query', queryResearch);