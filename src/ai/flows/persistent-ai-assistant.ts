'use server';

/**
 * @fileOverview This file defines the Genkit flow for the Persistent AI Assistant.
 *
 * The Persistent AI Assistant is an AI-powered chat assistant that provides support,
 * answers questions, and guides users towards relevant services throughout the website.
 *
 * - persistentAIAssistant - A function that handles the chat assistant process.
 * - PersistentAIAssistantInput - The input type for the persistentAIAssistant function.
 * - PersistentAIAssistantOutput - The return type for the persistentAIAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersistentAIAssistantInputSchema = z.object({
  query: z.string().describe('The user query or message for the AI assistant.'),
});
export type PersistentAIAssistantInput = z.infer<typeof PersistentAIAssistantInputSchema>;

const PersistentAIAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type PersistentAIAssistantOutput = z.infer<typeof PersistentAIAssistantOutputSchema>;

export async function persistentAIAssistant(input: PersistentAIAssistantInput): Promise<PersistentAIAssistantOutput> {
  return persistentAIAssistantFlow(input);
}

const persistentAIAssistantPrompt = ai.definePrompt({
  name: 'persistentAIAssistantPrompt',
  input: {schema: PersistentAIAssistantInputSchema},
  output: {schema: PersistentAIAssistantOutputSchema},
  prompt: `You are a helpful and friendly AI assistant available to answer user questions and provide support on the Utility King website.

  Your goal is to understand the user's needs and guide them towards relevant services offered by Utility King, such as energy tariff switching, broadband plan matching, and mobile data savings.
  You should also offer soft email lead prompts during the conversation.

  User Query: {{{query}}}`,
});

const persistentAIAssistantFlow = ai.defineFlow(
  {
    name: 'persistentAIAssistantFlow',
    inputSchema: PersistentAIAssistantInputSchema,
    outputSchema: PersistentAIAssistantOutputSchema,
  },
  async input => {
    const {output} = await persistentAIAssistantPrompt(input);
    return output!;
  }
);
