
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
  userName: z.string().describe("The name of the user for a personalized greeting."),
  selections: z.any().describe("The user's selections from the comparison wizard, including postcode and preferences."),
  results: z.array(PlanSchema).describe("The array of recommended utility plans from the comparison engine."),
});
export type SummarizeComparisonInput = z.infer<typeof SummarizeComparisonInputSchema>;

const SummarizeComparisonOutputSchema = z.object({
  summary: z.string().describe("A conversational, insightful summary of the comparison results, formatted in Markdown."),
});
export type SummarizeComparisonOutput = z.infer<typeof SummarizeComparisonOutputSchema>;

export async function summarizeComparison(input: SummarizeComparisonInput): Promise<SummarizeComparisonOutput> {
  return summarizeComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeComparisonPrompt',
  input: {schema: SummarizeComparisonInputSchema},
  output: {schema: SummarizeComparisonOutputSchema},
  prompt: `You are UKi, an expert AI assistant for UK utilities. Your task is to provide a clear, concise, and helpful summary of energy tariff comparison results.

Analyze the provided data:
- User's Name: {{{userName}}}
- User's Selections: {{{json selections}}}
- Comparison Results: {{{json results}}}

Based on this data, craft a conversational summary using clean Markdown. Follow these rules STRICTLY:
1.  Start with a friendly, personalized greeting to the user.
2.  Acknowledge their key preferences.
3.  Add a line break, then use a Markdown heading for key findings like this: '### Key Findings'.
4.  Use a bulleted list for the findings. Each bullet point MUST start on a new line with an asterisk and a space (e.g., '* ').
5.  Inside each bullet point:
    - Start with a bolded title (e.g., '**Your Top Pick:**').
    - State the supplier, annual cost, and contract length clearly.
    - Provide a brief, insightful comment.
6.  End with a concluding sentence encouraging them to review the deals below.

**CRITICAL: Ensure the output is clean Markdown. There must be a newline before the '### Key Findings' heading and each asterisk for the bulleted list.**

Example Markdown Output:
Hello, {{{userName}}}! I've analyzed the results based on your preferences.

### Key Findings
*   **Best Value:** The cheapest option is from **Some Supplier** at **£1234.56/year** for a 24-month contract. This is a great deal.
*   **Greener Choice:** The top 100% renewable tariff is from **Green Energy Co** for only a little more.
*   **Flexible Option:** For no exit fees, consider the plan from **Flexi-Bill** at **£1250.00/year**.

Please review the detailed plans below to make your choice.
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
