import { generateResponseWithOptionalContext } from '../../ai.service';

export const query = async(text: string, store?: boolean | null) => {
    try {
        const openAiResponse = await generateResponseWithOptionalContext(text, store)
        return openAiResponse
    } catch (error) {
        console.log(error)
        throw error
    }
}