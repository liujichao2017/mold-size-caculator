
import { z } from "zod"

export const moldConstantFormSchema = z.object({
  id: z.number().optional(),
  constantDescription: z.string().min(1, "系数名称不能为空"),
  constantValue: z.coerce.number().min(1, "系数值必须大于等于1"),
})

export type MoldConstantFormValues = z.infer<typeof moldConstantFormSchema> 


export interface MoldConstantSettingData{
  id: number,
  constantDescription: string,
  constantValue: number,
  updatedAt: string
}

export const moldConstantSettingItemSchema = z.object({
  constantName: z.string(),
  constantValue: z.number(),
})

export type MoldConstantSettingItem = z.infer<typeof moldConstantSettingItemSchema> 