import * as z from "zod"

export const materialFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "原材料名称不能为空"),
  density: z.coerce
    .number()
    .min(0.000001, "密度必须大于0")
    .transform(val => Number(val.toFixed(6))), // 保留6位小数
    price: z.coerce
    .number()
    .min(0.0001, "单价必须大于0")
    .transform(val => Number(val.toFixed(4))), // 保留4位小数
})

export type MaterialFormValues = z.infer<typeof materialFormSchema> 

export const deleteSchema = z.object({
  id: z.coerce.number().positive('ID必须是正数')
})

export interface MaterialPriceSettingData{
  id: number,
  name: string,
  density: number,
  price: number,
  updatedAt: string
} 

export const materialPriceSettingItemSchema = z.object({
  name: z.string(),
  density: z.number(),
  price: z.number(),
})

export type MaterialPriceSettingItem = z.infer<typeof materialPriceSettingItemSchema>
