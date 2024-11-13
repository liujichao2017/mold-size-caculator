'use server'

import { z } from 'zod'
import { db } from '@/lib/prisma'
import type { MoldPrice, PrismaClient } from '@prisma/client'

const MoldPriceSchema = z.object({
  price: z.number().positive(),
  weight: z.number().positive(),
})

const ProductPriceSchema = z.object({
  prices: z.array(z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
    productMaterial: z.string().nullable(),
    weight: z.number(),
    finalPrice: z.number(),
  }))
})

type ProductPrice = z.infer<typeof ProductPriceSchema>['prices'][number]

export async function saveMoldPrices(
  moldPrice: number,
  moldWeight: number,
  productPrices: string
) {
  try {

    console.log("moldPrice", moldPrice)
    console.log("moldWeight", moldWeight)
    console.log("productPrices", productPrices)
    // Validate mold price data
    const validatedMoldPrice = MoldPriceSchema.parse({
      price: moldPrice,
      weight: moldWeight,
    })
    console.log("validatedMoldPrice:", validatedMoldPrice)
    // Parse product prices data
    if (!productPrices) {
      throw new Error('Product prices cannot be empty')
    }

    const parsedPrices = JSON.parse(productPrices) as ProductPrice[]
    if (!Array.isArray(parsedPrices)) {
      throw new Error('Product prices must be an array')
    }

    const productPricesArray = ProductPriceSchema.parse({ 
      prices: parsedPrices 
    }).prices

    console.log('Parsed prices:', productPricesArray) // Debug log
    

    // Save to database using a transaction
    await db.$transaction(async (tx: PrismaClient) => {
      // Create new mold price record
      const savedMoldPrice = await tx.moldPrice.create({
        data: {
          length: 1,
          width: 1,
          height: 1,
          weight: 1,
          price: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: 0,
          exchangeRate: 1,
          cavityDesc: '1', 
          material: '123', 
          area: 10,
          volume: 10,
          operatingCost: 10,
          priceDiff: 10,
          originalPrice: 10,
          metadata: '{}',
        }
      })

      const moldNewId = savedMoldPrice.id

      console.log("savedMoldPrice:", savedMoldPrice)
    
      // Now validate product prices with the new moldId
      // const validatedProductPrices = ProductPriceSchema.parse({
      //   moldId: savedMoldPrice.id,
      //   prices: productPricesArray,
      // })
      console.log("moldNewId:" ,moldNewId)
      // Delete existing product prices
      await tx.productPrice.deleteMany({
        where: { moldPriceId: savedMoldPrice.id },
      })
      console.log("deleteMany:" )
    //   // Insert new product prices
      // await tx.productPrice.createMany({
      //   data: validatedProductPrices.prices.map(price => ({
      //     ...price,
      //     moldId: savedMoldPrice.id,
      //   })),
      // })

      await tx.productPrice.createMany({
        data: productPricesArray.map((price: ProductPrice) => ({
          createdAt: new Date(),
          updatedAt: new Date(),       
          isDeleted: 0,             
          volume: 1,          
          material: '11',                 
          materialPrice: 1,   
          processingFee: 1,   
          price: 1,           
          exchangeRate: 1,
          moldPriceId: moldNewId,
          length: 40,
          width: 40,
          height: 55,
          weight: 22,
          
        })),
      })

    })

    return { success: true }
  } catch (error) {
    console.error('Failed to save prices:', error)
    return { success: false, error: 'Failed to save prices' }
  }
}