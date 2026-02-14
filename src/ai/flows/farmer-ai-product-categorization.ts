'use server';
/**
 * @fileOverview A Genkit flow for AI-powered product categorization from an image.
 *
 * - categorizeProductImage - A function that handles the product image categorization process.
 * - CategorizeProductImageInput - The input type for the categorizeProductImage function.
 * - CategorizeProductImageOutput - The return type for the categorizeProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeProductImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CategorizeProductImageInput = z.infer<typeof CategorizeProductImageInputSchema>;

const CategorizeProductImageOutputSchema = z.object({
  suggestedCategory: z
    .enum(['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Eggs', 'Honey', 'Pickles', 'Other'])
    .describe('The AI-suggested category for the product.'),
});
export type CategorizeProductImageOutput = z.infer<typeof CategorizeProductImageOutputSchema>;

export async function categorizeProductImage(
  input: CategorizeProductImageInput
): Promise<CategorizeProductImageOutput> {
  return categorizeProductImageFlow(input);
}

const productCategorizationPrompt = ai.definePrompt({
  name: 'productCategorizationPrompt',
  input: {schema: CategorizeProductImageInputSchema},
  output: {schema: CategorizeProductImageOutputSchema},
  model: 'googleai/gemini-2.5-flash-image', // Specify the image-capable model here
  prompt: `Analyze the provided image and identify the main agricultural product.
Suggest the single most appropriate category from the following list: Vegetables, Fruits, Grains, Dairy, Eggs, Honey, Pickles.
If the product does not fit clearly into any of these categories, or if the image does not contain an identifiable agricultural product, suggest 'Other'.

Your response must be a JSON object with a single key 'suggestedCategory' and its value being one of the allowed categories.

Example:
User input: image of tomatoes
AI response: {"suggestedCategory": "Vegetables"}

User input: image of apples
AI response: {"suggestedCategory": "Fruits"}

User input: image of milk
AI response: {"suggestedCategory": "Dairy"}

User input: image of a car
AI response: {"suggestedCategory": "Other"}

Image: {{media url=photoDataUri}}`,
});

const categorizeProductImageFlow = ai.defineFlow(
  {
    name: 'categorizeProductImageFlow',
    inputSchema: CategorizeProductImageInputSchema,
    outputSchema: CategorizeProductImageOutputSchema,
  },
  async input => {
    const {output} = await productCategorizationPrompt(input);
    return output;
  }
);
