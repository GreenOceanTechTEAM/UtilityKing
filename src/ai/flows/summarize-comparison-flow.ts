
'use server';

/**
 * @fileOverview Implements a Genkit flow to summarize utility comparison results.
 *
 * - summarizeComparison - A function that takes user inputs and comparison results to generate an AI-powered summary.
 * - SummarizeComparisonInput - The input type for the summarizeComparison function.
 * - SummarizeComparisonOutput - The return type for the summarizeComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a single plan in the comparison results.
const PlanSchema = z.object({
  planName: z.string(),
  provider: z.string(),
  price: z.number(),
  contractLength: z.string(),
  features: z.array(z.string()),
});

const SummarizeComparisonInputSchema = z.object({
  selections: z.any().describe("The user's selections from the comparison wizard, including postcode and preferences."),
  results: z.array(PlanSchema).describe("The array of recommended utility plans from the comparison engine."),
});
export type SummarizeComparisonInput = z.infer<typeof SummarizeComparisonInputSchema>;

const SummarizeComparisonOutputSchema = z.object({
  summary: z.string().describe("A conversational, insightful summary of the comparison results, tailored to the user's inputs."),
});
export type SummarizeComparisonOutput = z.infer<typeof SummarizeComparisonOutputSchema>;

export async function summarizeComparison(input: SummarizeComparisonInput): Promise<SummarizeComparisonOutput> {
  return summarizeComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeComparisonPrompt',
  input: {schema: SummarizeComparisonInputSchema},
  output: {schema: SummarizeComparisonOutputSchema},
  prompt: `You are UKi, an expert AI assistant specializing in UK utility markets. Your task is to provide a clear, concise, and helpful summary of energy tariff comparison results for a user.

Analyze the provided data, which includes the user's wizard selections and the list of recommended plans.

**User's Selections:**
\`\`\`json
{{{json selections}}}
\`\`\`

**Comparison Results (Top Plans):**
\`\`\`json
{{{json results}}}
\`\`\`

Based on this data, craft a conversational summary. Address the user directly. Your summary should:
1.  Acknowledge their key preferences (e.g., "I see you're looking for a fixed-rate plan...").
2.  Highlight the absolute cheapest plan found and state its annual cost.
3.  Point out any other noteworthy deals, such as the best 2-year fixed plan if it offers good value or a plan with excellent features if they prioritized that.
4.  Provide a concluding sentence to encourage them to review the deals below.

Keep the tone helpful, expert, and reassuring. Do not simply list the plans; provide insight. For example: "The cheapest option is from [Supplier] at £[Price], which is a great value. However, for a longer-term peace of mind, the 2-year deal from [Supplier] is only slightly more expensive and locks in your rate."
`,
});

const summarizeComparisonFlow = ai.defineFlow(
  {
    name: 'summarizeComparisonFlow',
    inputSchema: SummarizeComparisonInputSchema,
    outputSchema: SummarizeComparisonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
