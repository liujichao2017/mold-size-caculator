import * as z from "zod"

export const machinePriceFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "机器吨位不能为空"),
  injectionVolume: z.coerce
    .number()
    .min(1, "实际注塑量必须大于0")
    .transform(val => Number(val.toFixed(0))), // 保留6位小数
  moldWidth: z.coerce
    .number()
    .min(1, "机器容模宽度必须大于0")
    .transform(val => Number(val.toFixed(0))), // 保留4位小数
  moldHeight: z.coerce
    .number()
    .min(1, "机器容模高度必须大于0")
    .transform(val => Number(val.toFixed(0))), // 保留4位小数
  machiningFee: z.coerce
    .number()
    .min(0.01, "机器加工费必须大于0")
    .transform(val => Number(val.toFixed(2))), // 保留4位小数
})

export type MachinePriceFormValues = z.infer<typeof machinePriceFormSchema> 

export const deleteSchema = z.object({
  id: z.coerce.number().positive('ID必须是正数')
})

export interface MachinePriceSettingData{
  id: number,
  name:            string    // 机器吨位
  injectionVolume: number       // 实际注塑量
  moldWidth:       number       // 机器容模宽度
  moldHeight:      number       // 机器容模高度
  machiningFee:    number   
  updatedAt: string
} 

export const machinePriceSettingItemSchema = z.object({
  name: z.string(),
  injectionVolume: z.number(),
  moldWidth: z.number(),
  moldHeight: z.number(),
  machiningFee: z.number(),
})

export type MachinePriceSettingItem = z.infer<typeof machinePriceSettingItemSchema>
