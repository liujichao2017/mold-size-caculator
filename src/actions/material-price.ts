'use server'

import { db } from "@/lib/prisma"
import { materialFormSchema, deleteSchema } from "@/lib/validations/material"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"
import { type MaterialPriceSettingData } from "@/lib/validations/material"

export async function getMaterialPrices(): Promise<MaterialPriceSettingData[]> {
  try {
    const materials = await db.materialPriceSetting.findMany({
      
      select: {
        id: true,
        name: true,
        density: true,
        price: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    // 转换 Decimal 为 number
    return materials.map(material => ({
      ...material,
      density: Number(material.density),
      price: Number(material.price),
      updatedAt: material.updatedAt.toISOString()
    }))
  } catch (err) {
    console.error('getMaterialPrices error:', err)
    throw new Error('Failed to fetch material prices')
  }
}

export async function createMaterialPrice(values: FormData) {
  try {
    const validatedFields = materialFormSchema.parse({
      name: values.get('name'),
      density: values.get('density'),
      price: values.get('price'),
    })

    await db.materialPriceSetting.create({
      data: {
        name: validatedFields.name,
        density: validatedFields.density,
        price: validatedFields.price,
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/material-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Create material price error:', error)
    return { success: false, error: '保存失败，请重试' }
  }
}

export async function updateMaterialPrice(values: FormData) {
  try {
    const validatedFields = materialFormSchema.parse({
      id: Number(values.get('id')),
      name: values.get('name'),
      density: values.get('density'),
      price: values.get('price'),
    })

    await db.materialPriceSetting.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        density: validatedFields.density,
        price: validatedFields.price,
      },
    })

    revalidatePath('/admin/material-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Update material price error:', error)
    return { success: false, error: '更新失败，请重试' }
  }
}

export async function deleteMaterialPrice(values: FormData) {
  try {
    const { id } = deleteSchema.parse({
      id: values.get('id')
    })

    // 执行真实删除操作
    await db.materialPriceSetting.delete({
      where: { id }
    })

    revalidatePath('/admin/material-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '数据验证失败：' + error.errors[0].message }
    }
    console.error('Delete material price error:', error)
    return { success: false, error: '删除失败，请重试' }
  }
}