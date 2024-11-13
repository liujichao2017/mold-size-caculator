'use server'

import { db } from "@/lib/prisma"

import { moldOperatingExpenseFormSchema, deleteSchema, type MoldOperatingExpenseSettingData } from "@/lib/validations/mold-operating-expense"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"
export async function getMoldOperatingExpenses(): Promise<MoldOperatingExpenseSettingData[]> {
  try {
    const operatingExpenses = await db.moldOperatingExpenseSetting.findMany({
      
      select: {
        id: true,
        maxWeight: true,
        price: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    
    return operatingExpenses.map((operatingExpense) => ({
      ...operatingExpense,
      updatedAt: operatingExpense.updatedAt.toISOString()
    }))
  } catch (err) {
    console.error('getMoldOperatingExpenses error:', err)
    throw new Error('Failed to fetch mold operating expenses')
  }
}

export async function createMoldOperatingExpense(values: FormData) {
  try {
    const validatedFields = moldOperatingExpenseFormSchema.parse({
      maxWeight: values.get('maxWeight'),
      price: values.get('price'),
    })

    await db.moldOperatingExpenseSetting.create({
      data: {
        maxWeight: validatedFields.maxWeight,
        price: validatedFields.price,
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/mold-operating-expense')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Create mold operating expense error:', error)
    return { success: false, error: '保存失败，请重试' }
  }
}

export async function updateMoldOperatingExpense(values: FormData) {
  try {
    const validatedFields = moldOperatingExpenseFormSchema.parse({
      id: Number(values.get('id')),
      maxWeight: values.get('maxWeight'),
      price: values.get('price'),
    })

    await db.moldOperatingExpenseSetting.update({
      where: { id: validatedFields.id },
      data: {
        maxWeight: validatedFields.maxWeight,
        price: validatedFields.price,
      },
    })

    revalidatePath('/admin/mold-operating-expense')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Update mold operating expense error:', error)
    return { success: false, error: '更新失败，请重试' }
  }
}

export async function deleteMoldOperatingExpense(values: FormData) {
  try {
    const { id } = deleteSchema.parse({
      id: values.get('id')
    })

    // 执行真实删除操作
    await db.moldOperatingExpenseSetting.delete({
      where: { id }
    })

    revalidatePath('/admin/mold-operating-expense')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '数据验证失败：' + error.errors[0].message }
    }
    console.error('Delete mold operating expense error:', error)
    return { success: false, error: '删除失败，请重试' }
  }
}