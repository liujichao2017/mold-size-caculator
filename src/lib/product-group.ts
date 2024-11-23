import { 
  productGroupInputListSchema, type ProductGroupInputList , type ProductGroupInputItem,
  productGroupOutputListSchema, type ProductGroupOutputList, type ProductGroupOutputItem,
  type ProductGroupOptions
} from "./validations/product-group";


import { productGroupWeightDifferenceList,
  productGroupWeightMinLimit,
  productGroupWeightDifferenceMinLimit,
  productGroupQuantityLimit,



 } from "./constants";
import { getMaterialPriceSettingList } from "./get-calulator-price-data";
import { type MaterialPriceSettingItem } from "./validations/material";

class ProductGroup {

  private readonly productGroup: ProductGroupInputList;
  private readonly materialPriceSettingList: MaterialPriceSettingItem[];
  private readonly options: ProductGroupOptions;

  constructor(productGroup: ProductGroupInputList, materialPriceSettingList: MaterialPriceSettingItem[], options: ProductGroupOptions) {
    
    this.productGroup = productGroup;
    this.materialPriceSettingList = materialPriceSettingList;
    this.options = options;
  }

  // 计算产品重量
  private calculateWeight(product: ProductGroupInputItem): number {
    const material = this.materialPriceSettingList.find(
      m => m.name === product.productMaterial
    );
    if (!material) {
      throw new Error(`Material ${product.productMaterial} not found in price settings`);
    }
    return product.productVolume * material.density;
  }

  // 检查重量差异规则
  private checkWeightDifference(weight1: number, weight2: number): boolean {
    const weightDiff = Math.abs(weight1 - weight2);

    // 规则2：两个产品重量都小于100的情况
    if (weight1 < 100 && weight2 < 100) {
      return weightDiff <= 50;
    }

    // 规则4：根据重量范围检查差异
    // if (weight1 >= 100 && weight1 < 300 && weight2 >= 100 && weight2 < 300) {
    //   return weightDiff <= 100;
    // }
    // if (weight1 >= 300 && weight1 < 600 && weight2 >= 300 && weight2 < 600) {
    //   return weightDiff <= 150;
    // }
    // if (weight1 >= 600 && weight1 < 900 && weight2 >= 600 && weight2 < 900) {
    //   return weightDiff <= 200;
    // }
    // if (weight1 >= 900 && weight1 < 1200 && weight2 >= 900 && weight2 < 1200) {
    //   return weightDiff <= 250;
    // }
    // if (weight1 >= 1200 && weight1 < 1500 && weight2 >= 1200 && weight2 < 1500) {
    //   return weightDiff <= 300;
    // }
    // if (weight1 >= 1500 && weight1 < 1800 && weight2 >= 1500 && weight2 < 1800) {
    //   return weightDiff <= 350;
    // }
    // if (weight1 >= 1800 && weight1 < 2100 && weight2 >= 1800 && weight2 < 2100) {
    //   return weightDiff <= 400;
    // }
    // if (weight1 >= 2100 && weight1 < 2400 && weight2 >= 2100 && weight2 < 2400) {
    //   return weightDiff <= 450;
    // }
    // if (weight1 >= 2400 && weight1 < 2700 && weight2 >= 2400 && weight2 < 2700) {
    //   return weightDiff <= 500;
    // }
    // if (weight1 >= 2700 && weight1 < 3000 && weight2 >= 2700 && weight2 < 3000) {
    //   return weightDiff <= 550;
    // }

    if ((weight1 >= 100 && weight1 < 300) || (weight2 >= 100 && weight2 < 300)) {
      return weightDiff <= 100;
    }
    if ((weight1 >= 300 && weight1 < 600) || (weight2 >= 300 && weight2 < 600)) {
      return weightDiff <= 150;
    }
    if ((weight1 >= 600 && weight1 < 900) || (weight2 >= 600 && weight2 < 900)) {
      return weightDiff <= 200;
    }
    if ((weight1 >= 900 && weight1 < 1200) || (weight2 >= 900 && weight2 < 1200)) {
      return weightDiff <= 250;
    }
    if ((weight1 >= 1200 && weight1 < 1500) || (weight2 >= 1200 && weight2 < 1500)) {
      return weightDiff <= 300;
    }
    if ((weight1 >= 1500 && weight1 < 1800) || (weight2 >= 1500 && weight2 < 1800)) {
      return weightDiff <= 350;
    }
    if ((weight1 >= 1800 && weight1 < 2100) || (weight2 >= 1800 && weight2 < 2100)) {
      return weightDiff <= 400;
    }
    if ((weight1 >= 2100 && weight1 < 2400) || (weight2 >= 2100 && weight2 < 2400)) {
      return weightDiff <= 450;
    }
    if ((weight1 >= 2400 && weight1 < 2700) || (weight2 >= 2400 && weight2 < 2700)) {
      return weightDiff <= 500;
    }
    if ((weight1 >= 2700 && weight1 < 3000) || (weight2 >= 2700 && weight2 < 3000)) {
      return weightDiff <= 550;
    }

    return false;
  }

  // 检查多个产品的组合是否可以与单个产品组合
  private canCombineProducts(products: ProductGroupInputItem[], target: ProductGroupInputItem): boolean {
    // 规则7：检查尺寸组合
    const totalLength = products.reduce((sum, p) => sum + p.productLength, 0);
    const totalWidth = products.reduce((sum, p) => sum + p.productWidth, 0);
    const lengthDiff = Math.abs(totalLength - target.productLength);
    const widthDiff = Math.abs(totalWidth - target.productWidth);
    
    if (lengthDiff > 200 || widthDiff > 200) {
      return false;
    }

    // 规则8：检查重量组合
    const combinedWeight = products.reduce((sum, p) => sum + this.calculateWeight(p), 0);
    const targetWeight = this.calculateWeight(target);
    
    return this.checkWeightDifference(combinedWeight, targetWeight);
  }

  private canAddToGroup(product: ProductGroupInputItem, group: ProductGroupInputList): boolean {
    // 基本规则检查（颜色、材料、尺寸）
    if (!group.every(groupProduct => {
      
      // 根据选项检查颜色
      if (!this.options.allowDifferentColors && 
        product.productColor !== groupProduct.productColor) {
        return false;
      }

      // 根据选项检查材料
      if (!this.options.allowDifferentMaterials && 
          product.productMaterial !== groupProduct.productMaterial) {
        return false;
      }

      // if (product.productColor !== groupProduct.productColor) return false;
      // if (product.productMaterial !== groupProduct.productMaterial) return false;
      
      const lengthDiff = Math.abs(product.productLength - groupProduct.productLength);
      const widthDiff = Math.abs(product.productWidth - groupProduct.productWidth);
      const heightDiff = Math.abs(product.productHeight - groupProduct.productHeight);
      
      if (lengthDiff > 200 || widthDiff > 200 || heightDiff > 200) return false;
      
      return true;
    })) {
      return false;
    }

    // 规则3：重量大于3000的产品单独分组
    const productWeight = this.calculateWeight(product);
    if (productWeight >= 3000) return false;

    // 规则5：数量差异检查
    if (group.some(groupProduct => {

      // console.log("product.productQuantity:", product.productQuantity);
      // console.log("groupProduct.productQuantity:", groupProduct.productQuantity);
      return Math.abs(product.productQuantity - groupProduct.productQuantity) > 5000;
    }
      
    )) {
      // console.log("数量差异检查失败");
      
      return false;
    }

    // 规则2和4：重量差异检查
    if (!group.every(groupProduct => {
      const groupProductWeight = this.calculateWeight(groupProduct);

      console.log("groupProductWeight:", groupProductWeight);

      return this.checkWeightDifference(productWeight, groupProductWeight);
    })) {
      console.log("productWeight:", productWeight);
      console.log("重量差异检查失败");
      return false;
    }

    // 规则7和8：组合检查
    return this.canCombineProducts(group, product) || 
           this.canCombineProducts([product], group[0]);
  }

  public calculateProductGroup(): ProductGroupOutputList {
    // 存储所有可能的分组方案
    const allSchemes: ProductGroupOutputList = [];
    
    // 先处理必须单独分组的大产品（规则4）
    const largeProducts = this.productGroup.filter(
      product => product.productLength > 300 && product.productWidth > 300
    );
    
    // 需要进行组合分组的产品
    const productsToGroup = this.productGroup.filter(
      product => !(product.productLength > 300 && product.productWidth > 300)
    );


    // 大产品的固定分组（每个大产品单独一组）
    const fixedGroups = largeProducts.map(product => [product]);

    // 递归函数来生成所有可能的分组方案
    const generateSchemes = (
      remainingProducts: ProductGroupInputList,
      currentGroups: ProductGroupInputList[],
      usedIndices: Set<number>
    ) => {
      // 当所有产品都已分组，保存方案
      if (usedIndices.size === productsToGroup.length) {
        // 转换所有组中的产品，添加重量属性
        const processedScheme = [...fixedGroups, ...currentGroups]
          .filter(group => group.length > 0)
          .map(group => 
            group.map(product => ({
              ...product,
              productWeight: this.calculateWeight(product)
            }))
          );
        allSchemes.push(processedScheme);
        return;
      }

      // 获取下一个未使用的产品
      const currentIndex = productsToGroup.findIndex((_, index) => !usedIndices.has(index));
      if (currentIndex === -1) return;

      const currentProduct = productsToGroup[currentIndex];
      const newUsedIndices = new Set(usedIndices).add(currentIndex);

      // 1. 尝试将产品添加到现有组
      for (let i = 0; i < currentGroups.length; i++) {
        if (this.canAddToGroup(currentProduct, currentGroups[i])) {
          const newGroups = currentGroups.map((group, idx) => 
            idx === i ? [...group, currentProduct] : [...group]
          );
          generateSchemes(productsToGroup, newGroups, newUsedIndices);
        }
      }

      // 2. 创建新组
      const newGroups = [...currentGroups, [currentProduct]];
      generateSchemes(productsToGroup, newGroups, newUsedIndices);
    };

    // 开始生成方案
    generateSchemes(productsToGroup, [], new Set());

    // 验证所有方案
    const validSchemes = allSchemes.filter(scheme => {
      const totalProducts = scheme.reduce((sum, group) => sum + group.length, 0);
      return totalProducts === this.productGroup.length;
    });

    // 打印调试信息，现在包含重量信息
    console.log(`Found ${validSchemes.length} valid grouping schemes`);
    validSchemes.forEach((scheme, schemeIndex) => {
      console.log(`\nScheme ${schemeIndex + 1}:`);
      scheme.forEach((group, groupIndex) => {
        console.log(`  Group ${groupIndex + 1} (${group.length} products):`);
        group.forEach(product => {
          console.log(`    - ${product.productMaterial} ${product.productColor} ` +
            `(${product.productLength}x${product.productWidth}x${product.productHeight}) ` +
            `Weight: ${product.productWeight}`);
        });
      });
      const productsInScheme = scheme.flat().length;
      console.log(`  Total products in scheme: ${productsInScheme}`);
    });

    return validSchemes;
  }

  

  
}



export async function createProductGroup(
  productGroup: ProductGroupInputList,
  options: ProductGroupOptions
): Promise<ProductGroup> {
  const materialPriceSettingList = await getMaterialPriceSettingList();

  return new ProductGroup(productGroup, materialPriceSettingList, options);
}