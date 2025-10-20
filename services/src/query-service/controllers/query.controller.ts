import { Response } from 'express'
import { query } from '../services/query.services'
import { QueryResearchRequest } from '../routes/query.routes'

export const queryResearch = async (req: QueryResearchRequest, res: Response) => {
    try {
        // 🧾 Log request data in a pretty format
        // console.log('--- Incoming Request ---');
        // console.log('Headers:', JSON.stringify(req.headers, null, 2));
        // console.log('Body:', JSON.stringify(req.body, null, 2));
        // console.log('------------------------');

        const {text, store} = req.body

        if (!text) {
            return res.status(400).json({ error: 'Missing query search content..asshole'})
        }

        const queryResponse = await query(text, store ?? false)

        return res.status(200).json( { result: queryResponse})
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
}