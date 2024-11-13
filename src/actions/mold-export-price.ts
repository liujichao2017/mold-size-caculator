'use server'

import { db } from "@/lib/prisma"
import { type MoldExportPriceSettingData } from "@/lib/validations/mold-export-price"
import { moldExportPriceFormSchema, deleteSchema } from "@/lib/validations/mold-export-price"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"
export async function getMoldExportPrices(): Promise<MoldExportPriceSettingData[]> {
  try {
    const exportPrices = await db.moldExportPriceSetting.findMany({
      
      select: {
        id: true,
        maxWeight: true,
        coefficient: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    
    return exportPrices.map((exportPrice) => ({
      ...exportPrice,
      coefficient: Number(exportPrice.coefficient),
      updatedAt: exportPrice.updatedAt.toISOString()
    }))
  } catch (err) {
    console.error('getMoldExportPrices error:', err)
    throw new Error('Failed to fetch mold export prices')
  }
}

export async function createMoldExportPrice(values: FormData) {
  try {
    console.log("validatedFields before:", values)
    const validatedFields = moldExportPriceFormSchema.parse({
      maxWeight: values.get('maxWeight'),
      coefficient: values.get('coefficient'),
    })
    console.log("validatedFields:", validatedFields)
    await db.moldExportPriceSetting.create({
      data: {
        maxWeight: validatedFields.maxWeight,
        coefficient: validatedFields.coefficient,
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/mold-export-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Create mold export price error:', error)
    return { success: false, error: '保存失败，请重试' }
  }
}

export async function updateMoldExportPrice(values: FormData) {
  try {
    const validatedFields = moldExportPriceFormSchema.parse({
      id: Number(values.get('id')),
      maxWeight: values.get('maxWeight'),
      coefficient: values.get('coefficient'),
    })

    await db.moldExportPriceSetting.update({
      where: { id: validatedFields.id },
      data: {
        maxWeight: validatedFields.maxWeight,
        coefficient: validatedFields.coefficient,
      },
    })

    revalidatePath('/admin/mold-export-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Update mold export price error:', error)
    return { success: false, error: '更新失败，请重试' }
  }
}

export async function deleteMoldExportPrice(values: FormData) {
  try {
    const { id } = deleteSchema.parse({
      id: values.get('id')
    })

    // 执行真实删除操作
    await db.moldExportPriceSetting.delete({
      where: { id }
    })

    revalidatePath('/admin/mold-export-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '数据验证失败：' + error.errors[0].message }
    }
    console.error('Delete mold export price error:', error)
    return { success: false, error: '删除失败，请重试' }
  }
}