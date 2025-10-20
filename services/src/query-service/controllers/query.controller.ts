import { Request, Response } from 'express'
import { query, queryWithContext } from '../services/query.services'
import { QueryResearchRequest } from '../routes/query.routes'

export const queryResearch = async (req: QueryResearchRequest, res: Response) => {
    try {
        const {text} = req.body
        const { mode } = req.query;

        // The existence of text will be checked in the next method
        if (mode === 'context') {
            return queryResearchFromContext(req, res)
        }

        if (!text) {
            return res.status(400).json({ error: 'Missing query search content..asshole'})
        }

        const queryResponse = await query(text)
        return res.status(200).json( { result: queryResponse})
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
}

export const queryResearchFromContext = async (req: QueryResearchRequest, res: Response) => {
    try {
        const {text} = req.body
        if (!text) {
            return res.status(400).json({ error: 'Missing query search content..asshole'})
        }
        const queryResponse = await queryWithContext(text)
        return res.status(200).json( { result: queryResponse})
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
}