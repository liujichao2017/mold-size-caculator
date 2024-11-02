import { z } from "zod";
import { materialList, moldMaterialList } from "@/lib/constants";

// Exchange rate schema
const RateSchema = z.object({
  CNY: z.number(),
});

// Exchange rate schema
export const exchangeRateSchema = z.object({
  result: z.string(),
  conversion_rates: RateSchema,
});

// User input schema
export const userInputSchema = z.object({
  jsonInput: z.string().min(1, "JSON input is required"),
});

// Base schemas
const dimensionsSchema = z.object({
  length: z.number(),
  width: z.number(),
  height: z.number(),
});

const dimensionsWithVolumeSchema = dimensionsSchema.extend({
  volume: z.number(),
});

// Product schemas
export const productDimensionsSchema = dimensionsSchema;

export const productSchema = z.object({
  productId: z.number(),
  dimensions: dimensionsWithVolumeSchema,
  productMaterial: z.enum(materialList.map(m => m.name) as [string, ...string[]]),
});

// Mold schema
export const moldSchema = z.object({
  dimensions: dimensionsSchema,
  weight: z.number(),
  cavityCount: z.number(),
  moldMaterial: z.enum(moldMaterialList.map(m => m.name) as [string, ...string[]]),
});

// Machine schema
export const machineSchema = z.object({
  name: z.string(),
  injectionVolume: z.number(),
  moldWidth: z.number(),
  moldHeight: z.number(),
  machiningFee: z.number(),
});

// Quote schemas
export const quoteSchema = z.object({
  unit: z.string(),
  products: z.array(productSchema),
  mold: moldSchema,
});

export const mockQuoteSchema = quoteSchema;

// Server response schema
export const serverResponseSchema = z.object({
  product: z.array(z.object({
    name: z.string(),
    rawMaterialPrice: z.number(),
    processingFee: z.number(),
  })),
  mold: z.object({
    dimensions: dimensionsSchema,
  }),
  machine: z.object({
    name: z.string(),
    injectionVolume: z.number(),
    moldWidth: z.number(),
    moldHeight: z.number(),
  }),
  totalProductsFee: z.number(),
  totalprocessingFee: z.number(),
  moldFee: z.number(),
  totalFee: z.number(),
});

// Type exports using Zod inference
export type ProductDimensions = z.infer<typeof productDimensionsSchema>;
export type Product = z.infer<typeof productSchema>;
export type Mold = z.infer<typeof moldSchema>;
export type Machine = z.infer<typeof machineSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type MockQuote = z.infer<typeof mockQuoteSchema>;
export type ServerResponse = z.infer<typeof serverResponseSchema>;
export type ExchangeRate = z.infer<typeof exchangeRateSchema>;
export type UserInput = z.infer<typeof userInputSchema>;

export const validators = {
  validateExchangeRate: (data: unknown) => exchangeRateSchema.parse(data),
  validateProduct: (data: unknown) => productSchema.parse(data),
  validateMold: (data: unknown) => moldSchema.parse(data),
  validateQuote: (data: unknown) => quoteSchema.parse(data),
  validateServerResponse: (data: unknown) => serverResponseSchema.parse(data),
  validateUserInput: (data: unknown) => userInputSchema.parse(data),
} as const;