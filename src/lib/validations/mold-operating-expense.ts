import * as z from "zod"

export const moldOperatingExpenseFormSchema = z.object({
  id: z.number().optional(),
  maxWeight: z.coerce
    .number()
    .min(1, "最大重量必须大于0")
    .transform(val => Number(val.toFixed(0))), // 保留6位小数
  price: z.coerce
    .number()
    .min(1, "运营费用必须大于0")
    .transform(val => Number(val.toFixed(0))), // 保留4位小数
})

export type MoldOperatingExpenseFormValues = z.infer<typeof moldOperatingExpenseFormSchema> 

export const deleteSchema = z.object({
  id: z.coerce.number().positive('ID必须是正数')
})

export interface MoldOperatingExpenseSettingData{
  id: number,
  maxWeight: number    // 最大重量
  price: number       // 运营费用
  updatedAt: string
} 

export const moldOperatingExpenseSettingItemSchema = z.object({
  maxWeight: z.number(),
  price: z.number(),
})

export type MoldOperatingExpenseSettingItem = z.infer<typeof moldOperatingExpenseSettingItemSchema>
