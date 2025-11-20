
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
  prompt: `You are UKi, an expert AI assistant specializing in UK utility markets. Your task is to provide a clear, concise, and helpful summary of energy tariff comparison results for a user.

Analyze the provided data, which includes the user's name, their wizard selections, and the list of recommended plans.

**User's Name:** {{{userName}}}

**User's Selections:**
\`\`\`json
{{{json selections}}}
\`\`\`

**Comparison Results (Top Plans):**
\`\`\`json
{{{json results}}}
\`\`\`

Based on this data, craft a conversational summary formatted in clean Markdown. Your summary should:
1.  Start with a friendly, personalized greeting addressing the user by their name (e.g., "Hello, Jane!").
2.  Acknowledge their key preferences (e.g., "I see you're looking for a fixed-rate plan...").
3.  Use a Markdown heading like '### Key Findings'.
4.  Use a bulleted list to highlight the most important deals. For each bullet point:
    - Start with a bolded title (e.g., "**Your Top Pick:**").
    - Clearly state the supplier, annual cost, and contract length.
    - Provide a brief, insightful comment on why it's a good choice.
5.  Provide a concluding sentence to encourage them to review the deals below.

Keep the tone helpful, expert, and reassuring. Do not simply list the plans; provide insight. Ensure the output is clean Markdown with no extra characters or formatting issues.

**Example Markdown Output Structure:**
Hello, {{{userName}}}! I've analyzed your results.

### Key Findings
*   **Best Value:** The cheapest option is from **[Supplier]** at **£[Price]/year** for a [Length] contract. This is a great deal.
*   **Long-Term Pick:** For more peace of mind, the 2-year fixed deal from **[Supplier]** is only slightly more.

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
