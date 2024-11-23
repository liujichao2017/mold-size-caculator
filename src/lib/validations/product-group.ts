import { moldSchema } from "@/types";
import { z } from "zod";

export const productGroupInputSchema = z.object({
  productLength: z.number(),
  productWidth: z.number(),
  productHeight: z.number(),
  productQuantity: z.number(),
  productVolume: z.number(),
  productMaterial: z.enum(['ABS', 'PC', 'PP', 'PE', 'PA', 'POM', 'PVC', 'PU', 'Silicone']),
  productColor: z.enum(['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 
    'Purple', 'Pink', 'Brown', 'Gray', 'Silver', 'Gold','402C','805C','302C', '405C']),

})
export const productGroupInputListSchema = z.array(productGroupInputSchema)
export type ProductGroupInputItem = z.infer<typeof productGroupInputSchema>
export type ProductGroupInputList = z.infer<typeof productGroupInputListSchema>

export const productGroupOutputSchema = z.object({
  productLength: z.number(),
  productWidth: z.number(),
  productHeight: z.number(),
  productQuantity: z.number(),
  productVolume: z.number(),
  productMaterial: z.enum(['ABS', 'PC', 'PP', 'PE', 'PA', 'POM', 'PVC', 'PU', 'Silicone']),
  productColor: z.enum(['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 
    'Purple', 'Pink', 'Brown', 'Gray', 'Silver', 'Gold','402C','805C','302C', '405C']),
  productWeight: z.number(),
})

// 产品组（一组产品）的 schema
export const productGroupSchema = z.array(productGroupOutputSchema);

// 一个分组方案（多个产品组）的 schema
export const groupingScheme = z.array(productGroupSchema);

// 所有可能的分组方案的 schema
export const productGroupOutputResultSchema = z.array(groupingScheme);

export type ProductGroupOutputSingleItem = z.infer<typeof productGroupSchema>

export type ProductGroupOutputItem = z.infer<typeof groupingScheme>
export type ProductGroupOutputList = z.infer<typeof productGroupOutputResultSchema>

export const ApiResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  data: productGroupOutputResultSchema.optional(),
})
export type ApiResult = z.infer<typeof ApiResultSchema>

export const GroupCalculateResultSchema = z.object({
  // success: z.boolean(),
  // error: z.string().optional(),
  mold: moldSchema.optional(),
  moldWeight: z.number().optional(),
  moldPrice: z.number().optional(),
  productLayout: z.string().optional(),
  productPrice: z.string().optional(),
});

export const ApiGroupCalculateResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  data: GroupCalculateResultSchema.optional(),
})
export type ApiGroupCalculateResult = z.infer<typeof ApiGroupCalculateResultSchema>

// 定义选项参数的验证 schema
export const optionsSchema = z.object({
  allowDifferentColors: z.boolean().default(false),
  allowDifferentMaterials: z.boolean().default(false),
});

export type ProductGroupOptions = z.infer<typeof optionsSchema>;