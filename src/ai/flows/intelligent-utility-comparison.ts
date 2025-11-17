
'use server';

/**
 * @fileOverview Implements the IntelligentUtilityComparison flow, providing AI-powered utility plan comparisons based on user requirements.
 *
 * - intelligentUtilityComparison - A function that handles the utility plan comparison process.
 * - IntelligentUtilityComparisonInput - The input type for the intelligentUtilityComparison function.
 * - IntelligentUtilityComparisonOutput - The return type for the intelligentUtilityComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentUtilityComparisonInputSchema = z.object({
  usageData: z
    .string()
    .describe("The user's utility usage data, including energy consumption, broadband usage, etc."),
  preferences: z
    .string()
    .describe('The user preferences for utility plans, such as desired price range, contract length, etc.'),
  location: z.string().describe('The location of the user.'),
});
export type IntelligentUtilityComparisonInput = z.infer<typeof IntelligentUtilityComparisonInputSchema>;

const IntelligentUtilityComparisonOutputSchema = z.object({
  comparisonSummary: z
    .string()
    .describe('A summary of the comparison, including the best plans based on the user input.'),
  recommendedPlans: z.array(
    z.object({
      planName: z.string().describe('The name of the recommended plan.'),
      provider: z.string().describe('The provider of the recommended plan.'),
      price: z.number().describe('The price of the recommended plan.'),
      contractLength: z.string().describe('The contract length of the recommended plan.'),
      link: z.string().describe('A link to the plan details'),
    })
  ),
});
export type IntelligentUtilityComparisonOutput = z.infer<typeof IntelligentUtilityComparisonOutputSchema>;

export async function intelligentUtilityComparison(
  input: IntelligentUtilityComparisonInput
): Promise<IntelligentUtilityComparisonOutput> {
  return intelligentUtilityComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentUtilityComparisonPrompt',
  input: {schema: IntelligentUtilityComparisonInputSchema},
  output: {schema: IntelligentUtilityComparisonOutputSchema},
  prompt: `You are an AI assistant that compares utility plans based on user data and preferences.
  You will be given a list of pre-vetted, recommended plans from our live database. Your only job is to provide a friendly, conversational summary of the results.
  Do not create your own recommendations. Your summary should highlight why the provided plans are a good fit for the user based on their stated preferences.
  You must also pass through the recommended plans you were given, unmodified, in the 'recommendedPlans' field of your response.

  User's Location: {{{location}}}
  User's Usage Data: {{{usageData}}}
  User's Preferences: {{{preferences}}}

  JSON Output:
  `,
});

const intelligentUtilityComparisonFlow = ai.defineFlow(
  {
    name: 'intelligentUtilityComparisonFlow',
    inputSchema: IntelligentUtilityComparisonInputSchema,
    outputSchema: IntelligentUtilityComparisonOutputSchema,
  },
  async input => {
    // In a real RAG implementation, this is where we would call a tool
    // to fetch live data based on the input.
    // For now, we simulate the AI just creating a summary.
    const {output} = await prompt(input);
    return output!;
  }
);

    