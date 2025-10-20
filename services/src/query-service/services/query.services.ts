import { generateResponse, generateResponseFromContext } from '../../ai.service';

export const query = async(text: string) => {
    try {
        const openAiResponse = await generateResponse(text)
        return openAiResponse
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const queryWithContext = async(text: string) => {
    try {
        const openAiResponse = await generateResponseFromContext(text)
        return openAiResponse
    } catch (error) {
        console.log(error)
        throw error
    }
}