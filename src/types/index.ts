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
  email: z.string()
    .refine(val => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address"
    })
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .refine(val => val === '' || /^1[3-9]\d{9}$/.test(val), {
      message: "Please enter a valid Chinese mobile number"
    })
    .optional()
    .or(z.literal('')),
});

// Base schemas
const dimensionsSchema = z.object({
  length: z.number(),
  width: z.number(),
  height: z.number(),
  volume: z.number().optional(),
  productMaterial:z.string().optional(),
  isRotated: z.boolean().optional(),
});

// 1. Export the schema
export const DimensionsSchemaWithPrice = dimensionsSchema.extend({
  processingCost: z.number(),
  finalPrice: z.number(),
  materialPrice: z.number(),
  weight: z.number(),
});

// 2. Add type export
export type DimensionsWithPrice = z.infer<typeof DimensionsSchemaWithPrice>;

const dimensionsWithLayoutSchema = z.object({
  length: z.number(),
  width: z.number(),
  height: z.number(),
  bottom: z.number().optional(),
  right: z.number().optional(),
});

const TwoDimensionalProductLayoutSchema = z.array(z.array(dimensionsWithLayoutSchema));

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
  moldMaterial: z.string(),
  maxRowLength: z.number().optional(),
  maxColumnLength: z.number().optional(),
  verticalMargin: z.number().optional(),
  horizontalMargin: z.number().optional(),
  //bestLayout: dimensionsWithLayoutSchema
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

export const ResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  mold: moldSchema.optional(),
  moldWeight: z.number().optional(),
  moldPrice: z.number().optional(),
  productLayout: z.string().optional(),
  productPrice: z.string().optional(),
});

export type CalculationResult = z.infer<typeof ResultSchema>;

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
export type ProductDimensionsWithLayout = z.infer<typeof dimensionsWithLayoutSchema>;

export type ProductTwoDdimensionsWithLayout = z.infer<typeof TwoDimensionalProductLayoutSchema>;

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
  validateProductLayout: (data: unknown) => TwoDimensionalProductLayoutSchema.parse(data),
  validateQuote: (data: unknown) => quoteSchema.parse(data),
  validateServerResponse: (data: unknown) => serverResponseSchema.parse(data),
  validateUserInput: (data: unknown) => userInputSchema.parse(data),
} as const;
