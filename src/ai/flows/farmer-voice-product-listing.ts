'use server';
/**
 * @fileOverview A Genkit flow for farmers to list produce using voice input.
 *
 * - farmerVoiceProductListing - A function that transcribes, translates, and parses voice input into structured product data.
 * - FarmerVoiceProductListingInput - The input type for the farmerVoiceProductListing function.
 * - FarmerVoiceProductListingOutput - The return type for the farmerVoiceProductListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the Genkit flow
// This assumes the `processVoiceInput` Cloud Function has already handled the audio-to-text and translation
// and provides the transcribed and translated text.
const FarmerVoiceProductListingInputSchema = z.object({
  transcribedText: z.string().describe('The transcribed and translated text from the farmer\'s voice input, describing the product.')
});
export type FarmerVoiceProductListingInput = z.infer<typeof FarmerVoiceProductListingInputSchema>;

// Output Schema for the Genkit flow
const FarmerVoiceProductListingOutputSchema = z.object({
  productName: z.string().describe('The name of the product (e.g., "Tomatoes", "Onions", "Grapes").'),
  category: z.enum(['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Eggs', 'Honey', 'Pickles']).describe('The category of the product, chosen from a predefined list.'),
  quantity: z.number().describe('The available quantity of the product.'),
  unit: z.string().describe('The unit of quantity (e.g., "kg", "piece", "liter", "dozen").'),
  price: z.number().describe('The price per unit of the product.'),
  currency: z.string().describe('The currency used for the price (e.g., "₹", "INR").')
});
export type FarmerVoiceProductListingOutput = z.infer<typeof FarmerVoiceProductListingOutputSchema>;

// Wrapper function that calls the Genkit flow
export async function farmerVoiceProductListing(input: FarmerVoiceProductListingInput): Promise<FarmerVoiceProductListingOutput> {
  return farmerVoiceProductListingFlow(input);
}

// Define the Genkit prompt
const productParsingPrompt = ai.definePrompt({
  name: 'productParsingPrompt',
  input: { schema: FarmerVoiceProductListingInputSchema },
  output: { schema: FarmerVoiceProductListingOutputSchema },
  prompt: `You are an AI assistant specialized in parsing farmer's product descriptions.\nThe farmer provides a spoken description of their produce which has already been transcribed and translated.\nYour task is to extract the product name, its category, available quantity, unit, price, and currency from the provided text.\n\nHere are the allowed categories: Vegetables, Fruits, Grains, Dairy, Eggs, Honey, Pickles.\nIf a specific unit is not explicitly mentioned but quantity is, infer a common unit like 'kg' or 'piece' based on the product.\nIf currency is not explicitly mentioned, assume '₹' (INR).\n\nExample 1 Input: "50 kg tomatoes, twenty rupees per kg"\nExample 1 Output:\n{\n  "productName": "Tomatoes",\n  "category": "Vegetables",\n  "quantity": 50,\n  "unit": "kg",\n  "price": 20,\n  "currency": "₹"\n}\n\nExample 2 Input: "100 pieces of fresh mangoes, at sixty rupees each"\nExample 2 Output:\n{\n  "productName": "Mangoes",\n  "category": "Fruits",\n  "quantity": 100,\n  "unit": "piece",\n  "price": 60,\n  "currency": "₹"\n}\n\nExample 3 Input: "Milk, 5 liters, 30 rupees per liter"\nExample 3 Output:\n{\n  "productName": "Milk",\n  "category": "Dairy",\n  "quantity": 5,\n  "unit": "liter",\n  "price": 30,\n  "currency": "₹"\n}\n\nExample 4 Input: "Honey, one kilo, 300 rupees"\nExample 4 Output:\n{\n  "productName": "Honey",\n  "category": "Honey",\n  "quantity": 1,\n  "unit": "kg",\n  "price": 300,\n  "currency": "₹"\n}\n\nNow, parse the following:\n{{{transcribedText}}}`
});

// Define the Genkit flow
const farmerVoiceProductListingFlow = ai.defineFlow(
  {
    name: 'farmerVoiceProductListingFlow',
    inputSchema: FarmerVoiceProductListingInputSchema,
    outputSchema: FarmerVoiceProductListingOutputSchema
  },
  async (input) => {
    const {output} = await productParsingPrompt(input);
    if (!output) {
      throw new Error('Failed to parse product details from voice input.');
    }
    return output;
  }
);
