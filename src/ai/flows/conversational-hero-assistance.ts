'use server';

/**
 * @fileOverview A conversational hero AI agent that understands user needs and guides them to appropriate utility services.
 *
 * - conversationalHeroAssistance - A function that handles the conversational hero assistance process.
 * - ConversationalHeroAssistanceInput - The input type for the conversationalHeroAssistance function.
 * - ConversationalHeroAssistanceOutput - The return type for the conversationalHeroAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationalHeroAssistanceInputSchema = z.object({
  userInput: z.string().describe('The user input describing their utility needs.'),
});
export type ConversationalHeroAssistanceInput = z.infer<typeof ConversationalHeroAssistanceInputSchema>;

const ConversationalHeroAssistanceOutputSchema = z.object({
  suggestedServices: z.array(z.string()).describe('An array of suggested utility services based on the user input.'),
  aiResponse: z.string().describe('A conversational response from the AI assistant.'),
});
export type ConversationalHeroAssistanceOutput = z.infer<typeof ConversationalHeroAssistanceOutputSchema>;

export async function conversationalHeroAssistance(input: ConversationalHeroAssistanceInput): Promise<ConversationalHeroAssistanceOutput> {
  return conversationalHeroAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conversationalHeroPrompt',
  input: {schema: ConversationalHeroAssistanceInputSchema},
  output: {schema: ConversationalHeroAssistanceOutputSchema},
  prompt: `You are a helpful AI assistant on a utility service comparison website.
  Your goal is to understand the user's utility needs and guide them towards the appropriate services.
  Based on the user input, suggest relevant utility services and provide a conversational response.

  User Input: {{{userInput}}}

  Consider these services: Energy Tariff Switch, Broadband Plan Match, Mobile Data Savings, Smart Meter Insight, and Bill Breakdown Explainer.
  Return the suggested services as an array of strings and a conversational response to the user.
  `,
});

const conversationalHeroAssistanceFlow = ai.defineFlow(
  {
    name: 'conversationalHeroAssistanceFlow',
    inputSchema: ConversationalHeroAssistanceInputSchema,
    outputSchema: ConversationalHeroAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
