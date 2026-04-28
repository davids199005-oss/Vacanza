

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";


export const mcpSystemPrompt: ChatCompletionMessageParam = {
    
    role: "system",
    
    content: `You are a helpful assistant that answers questions about vacation data.
    Use the available tools to get data from the database and answer precisely.
    Be concise and clear in your answers.
    Always base your answers on the data from the database.`,
};


export const mcpUserPrompt = (question: string): ChatCompletionMessageParam => ({
    
    role: "user",
    
    content: question,
});
