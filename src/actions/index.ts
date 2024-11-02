'use server';

import { validators, moldSchema } from '@/types';
import { createMoldCalculator } from '@/lib/moldCalculator';
import { z } from 'zod';

// 下面这个是暂时定义的，所以没写到types.ts，后面可能需要修改
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  mold: moldSchema.optional(),
  price: z.number().optional(),
});

type CalculationResult = z.infer<typeof ResultSchema>;

export async function calculateMold(jsonInput: string): Promise<CalculationResult> {
  try {
    // Parse and validate input JSON
    const parsedInput = JSON.parse(jsonInput) as unknown;
    const validatedInput = validators.validateQuote(parsedInput);

    // Create calculator instance
    const calculator = await createMoldCalculator(
      validatedInput.products.map(product => product.dimensions),
      validatedInput.mold.moldMaterial
    );

    // Calculate mold size
    const moldLayout = calculator.calculateMoldSize();
    if (!moldLayout) {
      return {
        success: false,
        error: 'Could not find a valid mold layout',
      };
    }

    // Calculate price
    const price = await calculator.calculateMoldPrice();

    return {
      success: true,
      mold: moldLayout,
      price,
    };
  } catch (error) {
    console.error('Calculation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid input format'
    };
  }
} 