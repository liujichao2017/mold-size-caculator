'use server'

import { createProductGroup } from "@/lib/product-group";
import { type ApiResult, type ProductGroupOptions, optionsSchema, productGroupInputListSchema, type ProductGroupOutputItem, type ProductGroupOutputSingleItem, type ApiGroupCalculateResult } from "@/lib/validations/product-group";
import { getMaterialPriceSettingList } from "@/lib/get-calulator-price-data";
import { createMoldCalculator } from "@/lib/mold-calculator";
import { createGroupCalculator } from "@/lib/group-calculator";

export async function calculateProductGroupAction(
  jsonInput: string,
  options: ProductGroupOptions = { 
    allowDifferentColors: false, 
    allowDifferentMaterials: false 
  }
): Promise<ApiResult> {
  try {
    // 验证选项参数
    const validatedOptions = optionsSchema.parse(options);

    // 解析并验证输入数据
    const parsedInput = JSON.parse(jsonInput) as unknown;
    const validatedInput = productGroupInputListSchema.parse(parsedInput);
    
    // 创建 ProductGroup 实例时传入选项
    const productGroup = await createProductGroup(
      validatedInput,
      validatedOptions
    );

    const result = productGroup.calculateProductGroup();
    console.log("result: ", result);
    
    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.log("error: ", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid input data'
    };
  }
}

// 新增计算价格的 action
export async function calculateGroupPriceAction(
  productGroup: ProductGroupOutputSingleItem
): Promise<ApiGroupCalculateResult> {
  try {
    
    const parsedInput = productGroup.map(product => {
      return {
        length: product.productLength,
        width: product.productWidth,
        height: product.productHeight,
        volume: product.productVolume,
        productMaterial: product.productMaterial,
        productQuantity: product.productQuantity,
        productWeight: product.productWeight,
      }
    })
    // Create calculator instance ProductDimensions[]
    const calculator = await createGroupCalculator(
      parsedInput,
      "718H"
    );

    // Calculate mold size
    const moldLayout = calculator.calculateMoldSize();

    
    // console.log('moldLayout:', moldLayout);
    if (!moldLayout) {
      return {
        success: false,
        error: 'Could not find a valid mold layout',
      };
    }
    
    // Calculate price
    const {moldWeight, moldPrice} = await calculator.calculateMoldPrice();

    const productPrice = await calculator.calculateProductPrice();

    // console.log('productPrice:', productPrice);
    return {
      success: true,
      data: {
        mold: moldLayout,
        moldPrice,
        moldWeight,
        productPrice: JSON.stringify(productPrice),
      }
    };
    // 计算每个产品的价格
    // const priceDetails = group.map((product, index) => {
    //   const materialPrice = materialPriceSettings.find(
    //     m => m.name === product.productMaterial
    //   );

    //   if (!materialPrice) {
    //     throw new Error(`Price not found for material: ${product.productMaterial}`);
    //   }

    //   // 计算单个产品的价格
    //   const price = product.productVolume * materialPrice.price * product.productQuantity;

    //   return {
    //     productId: index,
    //     price: price
    //   };
    // });

    
    
  } catch (error) {
    console.error("Price group calculation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate group price'
    };
  }
}