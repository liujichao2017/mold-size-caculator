'use server'

import { db } from "@/lib/prisma"
import { type MoldConstantSettingData } from "@/lib/validations/mold-constant"
import { moldConstantFormSchema } from "@/lib/validations/mold-constant"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"
export async function getMoldConstants(): Promise<MoldConstantSettingData[]> {
  try {
    const constants = await db.moldConstantSetting.findMany({
      
      select: {
        id: true,
        constantDescription: true,
        constantValue: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    
    return constants.map((constant) => ({
      ...constant,
      constantValue: Number(constant.constantValue),
      updatedAt: constant.updatedAt.toISOString()
    }))
  } catch (err) {
    console.error('getMoldConstants error:', err)
    throw new Error('Failed to fetch mold constants')
  }
}

export async function updateMoldConstant(values: FormData) {
  try {
    const validatedFields = moldConstantFormSchema.parse({
      id: Number(values.get('id')),
      constantDescription: values.get('constantDescription'),
      constantValue: values.get('constantValue'),
    })

    await db.moldConstantSetting.update({
      where: { id: validatedFields.id },
      data: {
        constantDescription: validatedFields.constantDescription,
        constantValue: validatedFields.constantValue,
      },
    })

    revalidatePath('/admin/mold-constant')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Update mold constant error:', error)
    return { success: false, error: '更新失败，请重试' }
  }
}
