'use server'

import { db } from "@/lib/prisma"
import { type MoldPriceDifferSettingData } from "@/lib/validations/mold-price-differ"
import { moldPriceDifferFormSchema, deleteSchema } from "@/lib/validations/mold-price-differ"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"
export async function getMoldPriceDiffers(): Promise<MoldPriceDifferSettingData[]> {
  try {
    const differs = await db.moldPriceDifferSetting.findMany({
      
      select: {
        id: true,
        name: true,
        coefficient: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    
    return differs.map((differ) => ({
      ...differ,
      coefficient: Number(differ.coefficient),
      updatedAt: differ.updatedAt.toISOString()
    }))
  } catch (err) {
    console.error('getMoldPriceDiffers error:', err)
    throw new Error('Failed to fetch mold price differs')
  }
}

export async function createMoldPriceDiffer(values: FormData) {
  try {
    const validatedFields = moldPriceDifferFormSchema.parse({
      name: values.get('name'),
      coefficient: values.get('coefficient'),
    })

    await db.moldPriceDifferSetting.create({
      data: {
        name: validatedFields.name,
        coefficient: validatedFields.coefficient,
        deleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/mold-price-differ')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Create material price error:', error)
    return { success: false, error: '保存失败，请重试' }
  }
}

export async function updateMoldPriceDiffer(values: FormData) {
  try {
    const validatedFields = moldPriceDifferFormSchema.parse({
      id: Number(values.get('id')),
      name: values.get('name'),
      coefficient: values.get('coefficient'),
    })

    await db.moldPriceDifferSetting.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        coefficient: validatedFields.coefficient,
      },
    })

    revalidatePath('/admin/mold-price-differ')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Update material price error:', error)
    return { success: false, error: '更新失败，请重试' }
  }
}

export async function deleteMoldPriceDiffer(values: FormData) {
  try {
    const { id } = deleteSchema.parse({
      id: values.get('id')
    })

    // 执行真实删除操作
    await db.moldPriceDifferSetting.delete({
      where: { id }
    })

    revalidatePath('/admin/mold-price-differ')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '数据验证失败：' + error.errors[0].message }
    }
    console.error('Delete material price error:', error)
    return { success: false, error: '删除失败，请重试' }
  }
}