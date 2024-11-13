'use server'

import { db } from "@/lib/prisma"
import { machinePriceFormSchema, deleteSchema } from "@/lib/validations/machine-price"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"
import { type MachinePriceSettingData } from "@/lib/validations/machine-price"

export async function getMachinePrices(): Promise<MachinePriceSettingData[]> {
  try {
    const machines = await db.machinePriceSetting.findMany({
      
      select: {
        id: true,
        name: true,
        injectionVolume: true,
        moldWidth: true,
        moldHeight: true,
        machiningFee: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    // 转换 Decimal 为 number
    return machines.map(machine => ({
      ...machine,
      injectionVolume: Number(machine.injectionVolume),
      moldWidth: Number(machine.moldWidth),
      moldHeight: Number(machine.moldHeight),
      machiningFee: Number(machine.machiningFee),
      updatedAt: machine.updatedAt.toISOString()
    }))
  } catch (err) {
    console.error('getMachinePrices error:', err)
    throw new Error('Failed to fetch machine prices')
  }
}

export async function createMachinePrice(values: FormData) {
  try {
    const validatedFields = machinePriceFormSchema.parse({
      name: values.get('name'),
      injectionVolume: values.get('injectionVolume'),
      moldWidth: values.get('moldWidth'),
      moldHeight: values.get('moldHeight'),
      machiningFee: values.get('machiningFee'),
    })

    await db.machinePriceSetting.create({
      data: {
        name: validatedFields.name,
        injectionVolume: validatedFields.injectionVolume,
        moldWidth: validatedFields.moldWidth,
        moldHeight: validatedFields.moldHeight,
        machiningFee: validatedFields.machiningFee,
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/machine-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Create machine price error:', error)
    return { success: false, error: '保存失败，请重试' }
  }
}

export async function updateMachinePrice(values: FormData) {
  try {
    const validatedFields = machinePriceFormSchema.parse({
      id: Number(values.get('id')),
      name: values.get('name'),
      injectionVolume: values.get('injectionVolume'),
      moldWidth: values.get('moldWidth'),
      moldHeight: values.get('moldHeight'),
      machiningFee: values.get('machiningFee'),
    })

    await db.machinePriceSetting.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        injectionVolume: validatedFields.injectionVolume,
        moldWidth: validatedFields.moldWidth,
        moldHeight: validatedFields.moldHeight,
        machiningFee: validatedFields.machiningFee,
      },
    })

    revalidatePath('/admin/machine-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '输入数据验证失败：' + error.errors[0].message }
    }
    console.error('Update machine price error:', error)
    return { success: false, error: '更新失败，请重试' }
  }
}

export async function deleteMachinePrice(values: FormData) {
  try {
    const { id } = deleteSchema.parse({
      id: values.get('id')
    })

    // 执行真实删除操作
    await db.machinePriceSetting.delete({
      where: { id }
    })

    revalidatePath('/admin/machine-price')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: '数据验证失败：' + error.errors[0].message }
    }
    console.error('Delete machine price error:', error)
    return { success: false, error: '删除失败，请重试' }
  }
}