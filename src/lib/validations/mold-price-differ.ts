import { z } from "zod"

export const moldPriceDifferFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "模具材料名称不能为空"),
  coefficient: z.coerce
    .number()
    .min(0, "差价重量系数必须大于等于0")
    .transform(val => Number(val.toFixed(0))), // 保留6位小数
})

export type MoldPriceDifferFormValues = z.infer<typeof moldPriceDifferFormSchema> 


export const deleteSchema = z.object({
  id: z.coerce.number().positive('ID必须是正数')
})

export interface MoldPriceDifferSettingData{
  id: number,
  name: string,
  coefficient: number,
  updatedAt: string
} 

export const moldPriceDifferSettingItemSchema = z.object({
  name: z.string(),
  coefficient: z.number(),
})

export type MoldPriceDifferSettingItem = z.infer<typeof moldPriceDifferFormSchema>
