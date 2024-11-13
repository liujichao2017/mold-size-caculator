import { z } from "zod"

export const moldExportPriceFormSchema = z.object({
  id: z.number().optional(),
  maxWeight: z.coerce
    .number()
    .min(1, "最大重量必须大于0")
    .transform(val => Number(val.toFixed(0))), // 保留6位小数
  coefficient: z.coerce
    .number()
    .min(1, "价格系数必须大于0")
    .transform(val => Number(val.toFixed(2))), // 保留6位小数
})

export type MoldExportPriceFormValues = z.infer<typeof moldExportPriceFormSchema> 


export const deleteSchema = z.object({
  id: z.coerce.number().positive('ID必须是正数')
})

export interface MoldExportPriceSettingData{
  id: number,
  maxWeight: number,
  coefficient: number,
  updatedAt: string
} 