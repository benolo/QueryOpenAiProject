import { Router, Request, Response } from 'express'
import { queryResearch } from '../controllers/query.controller';

export const queryRouter: Router = Router();

export interface QueryResearchRequest extends Request{
    body: {
        text: string;
        store?: boolean | null 
    };
}

/**
 * @openapi
 * /query:
 *   post:
 *     summary: Run a query research
 *     description: Sends a query text and optional store flag to process.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "What is the meaning of life?"
 *               store:
 *                 type: boolean
 *                 example: false
 *                 description: Optional flag to store the result
 *     responses:
 *       200:
 *         description: The query result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       400:
 *         description: Missing query content
 *       500:
 *         description: Internal server error
 */
queryRouter.post('/query', queryResearch);