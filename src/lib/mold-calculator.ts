import {
  borderSpaceRules,
  marginSpaceRules,
  moldMaterialList,
  moldStructureHeightRules,
  fixedLossRate,
  defaultMoldMaterialDensity,
} from "./constants";
import { getExchangeRate } from "./get-exchange-rate";
import type {  Mold,  ProductDimensions, ProductDimensionsWithLayout } from "@/types";
import { getMachinePriceSettingList, getMaterialPriceSettingList, getMoldConstantSettingList, getMoldOperatingExpenseSettingList, getMoldPriceDifferSettingList } from "./get-calulator-price-data";
import { type MoldPriceDifferSettingItem } from "./validations/mold-price-differ";
import { type MachinePriceSettingItem } from "./validations/machine-price";
import { type MoldOperatingExpenseSettingItem } from "./validations/mold-operating-expense";
import { type MoldConstantSettingItem } from "./validations/mold-constant";
import { type MaterialPriceSettingItem } from "./validations/material";

class MoldCalculator {
  private readonly weightDiffer = 1000;
  private readonly maxDimension = 1000;
  private readonly maxRatio = 2.5;
  private bestMold: Mold | null = null;
  // private materialIndex: number;
  private moldMaterial: string;
  // private bestLayout: Mold | null = null;
  private readonly products: ProductDimensions[];
  private productDimensionsWithLayout: ProductDimensionsWithLayout[][] = [];
  private readonly exchangeRate: number;
  private readonly moldPriceDifferSettingList: MoldPriceDifferSettingItem[];
  private readonly moldOperatingExpenseSettingList: MoldOperatingExpenseSettingItem[];
  private readonly moldConstantSettingList: MoldConstantSettingItem[];
  private readonly materialPriceSettingList: MaterialPriceSettingItem[];
  private readonly machinePriceSettingList: MachinePriceSettingItem[];

  constructor(products: ProductDimensions[], moldMaterial: string, 
    exchangeRate: number, 
    moldPriceDifferSettingList: MoldPriceDifferSettingItem[], 
    moldOperatingExpenseSettingList: MoldOperatingExpenseSettingItem[], 
    moldConstantSettingList: MoldConstantSettingItem[],
    materialPriceSettingList: MaterialPriceSettingItem[],
    machinePriceSettingList: MachinePriceSettingItem[]
  ) {
    this.products = products;
    this.moldMaterial = moldMaterial;
    // this.materialIndex = moldMaterialList.findIndex(mold => mold.name === moldMaterial);
    this.exchangeRate = 7.1; //exchangeRate
    this.moldPriceDifferSettingList = moldPriceDifferSettingList;
    this.moldOperatingExpenseSettingList = moldOperatingExpenseSettingList;
    this.moldConstantSettingList = moldConstantSettingList;
    this.materialPriceSettingList = materialPriceSettingList;
    this.machinePriceSettingList = machinePriceSettingList;
  }

  private calculateHeight(): number {
    const maxProductHeight = Math.max(...this.products.map(item => item.height));
    return maxProductHeight + (
      moldStructureHeightRules.find(rule => maxProductHeight <= rule.maxHeight)?.height ?? 0
    );
  }

  private calculateSpacing(totalLength: number): number {
    return marginSpaceRules.find(rule => totalLength <= rule.maxLength)?.spacing ?? 0;
  }

  private calculateMargin(totalLength: number): number {
    return (borderSpaceRules.find(rule => totalLength <= rule.maxLength)?.spacing ?? 0) * 2;
  }

  private calculateRowLengthNew(row: ProductDimensions[]): number {
    if (!Array.isArray(row) || row.length === 0) {
      console.warn('Invalid row input:', row);
      return 0;
    }
    let intervalSum = 0;
    let lengthSum = 0;

    // 计算所有项的 length 之和
    // for (let i = 0; i < row.length; i++) {
    //   lengthSum += row[i].length;
    // }
    
    for(const item  of row){
      
      if (!item) {
        // console.warn('Found undefined item in row:', row);
        continue;
      }
      lengthSum += item.length;
    }

    // 计算所有间隔之和
    for (let i = 0; i < row.length - 1; i++) {
      if (!row[i] || !row[i + 1]) {
        // console.warn('Found undefined item in row:', row);
        continue;
      }
      const interval = this.calculateSpacing(row[i].length + row[i + 1].length);
      intervalSum += interval;
    }

    // 返回间隔之和加上长度之和
    return intervalSum + lengthSum;


  }

  private calculateColumnLengthNew(column: ProductDimensions[]): number {
    if (!Array.isArray(column) || column.length === 0) {
      console.warn('Invalid column input:', column);
      return 0;
    }
    let intervalSum = 0;
    let widthSum = 0;

    for(const item  of column){
      widthSum += item.width;
    }
    // 计算所有间隔之和
    for (let i = 0; i < column.length - 1; i++) {
      const interval = this.calculateSpacing(column[i].width + column[i + 1].width);
      intervalSum += interval;
    }

    // 返回间隔之和加上长度之和
    return intervalSum + widthSum;
  }

  private calculateColumnLengthByLayout(layout: ProductDimensions[][]): number {
    if (!layout || layout.length === 0) return 0;

    let totalWidth = 0;

    // 1. 遍历
    for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
      const currentRow = layout[rowIndex];
      const nextRow = layout[rowIndex + 1];
      const isLastRow = rowIndex === layout.length - 1;

      if (isLastRow) {
        // 如果是最后一行，直接取最大宽度
        const maxWidth = Math.max(...currentRow.map(item => item.width));

        // console.log(" last row maxWidth: ", maxWidth)
        totalWidth += maxWidth;
      } else {
        // 计算每一列的宽度和间距，找出最大值
        let maxColumnWidth = 0;
        let maxColumnWidtIndex = 0;
        // 遍历当前行的每一列
        for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
          const currentElement = currentRow[colIndex];
          const nextElement = nextRow[colIndex];

          if (nextElement) {
            // 计算当前元素和下一行元素的间距
            const spacing = this.calculateSpacing(currentElement.width + nextElement.width);
            // 计算总宽度（当前元素宽度 + 间距 + 下一行元素宽度），然后减去下一行元素宽度

            //增加一个判断，如果这个元素的宽度加上间距还小于这行的某个元素，那么直接取某个元素的宽度



            // console.log(" spacing: ", spacing)
            const totalColumnWidth = currentElement.width + spacing + nextElement.width;
            // console.log(" totalColumnWidth: ", totalColumnWidth)
            

            
            if(totalColumnWidth > maxColumnWidth){
              maxColumnWidtIndex = colIndex;
            }
            maxColumnWidth = Math.max(maxColumnWidth, totalColumnWidth);
            
            // console.log(" maxColumnWidth: ", maxColumnWidth)
          } else {
            // 如果下一行没有对应元素，只考虑当前元素宽度
            maxColumnWidth = Math.max(maxColumnWidth, currentElement.width);
          }
        }
        if(nextRow?.[maxColumnWidtIndex]){
          totalWidth += maxColumnWidth - nextRow[maxColumnWidtIndex].width;
        }
        else{
          totalWidth += maxColumnWidth
        }
        // console.log("nextRow[maxColumnWidtIndex].width: ", nextRow[maxColumnWidtIndex].width)
        
        // console.log("totalWidth: ", totalWidth)
      }
    }
    
    return totalWidth;
  }

  private checkOverlap(layout: ProductDimensions[][]): boolean {
    if (!layout?.[0]) return false;

    // Create a map to store occupied positions
    const positions = new Set<string>();

    // Track current x,y positions as we move through the layout
    let currentY = 0;

    for (const row of layout) {
      let currentX = 0;
      
      for (const item of row) {
        // Calculate the area this item occupies
        for (let y = currentY; y < currentY + item.width; y++) {
          for (let x = currentX; x < currentX + item.length; x++) {
            const position = `${x},${y}`;
            if (positions.has(position)) {
              return true; // Overlap detected
            }
            positions.add(position);
          }
        }
        
        // Move x position by item length plus spacing
        currentX += item.length + this.calculateSpacing(item.length);
      }
      
      // Move y position by row width plus spacing
      currentY += row[0].width + this.calculateSpacing(row[0].width);
    }

    return false; // No overlaps found
  }

  private checkInnerMargin(layout: ProductDimensions[][], maxLength: number, maxWidth: number): boolean {
    if (!layout?.length) return true;

    console.log("\n=== 开始检查布局间距 ===");
    console.log("最大允许长度:", maxLength);

    // 遍历每一行
    for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
      const currentRow = layout[rowIndex];
      let rowTotalLength = 0;

      console.log(`\n检查第 ${rowIndex + 1} 行:`);

      // 处理第一行的特殊情况
      if (rowIndex === 0) {
        const elementsSum = currentRow.reduce((sum, item) => sum + item.length, 0);
        let spacingSum = 0;
        
        // 计算元素间距
        for (let i = 0; i < currentRow.length - 1; i++) {
          const spacing = this.calculateSpacing(currentRow[i].length + currentRow[i + 1].length);
          spacingSum += spacing;
        }

        const totalLength = elementsSum + spacingSum;
        console.log("第一行总长度:", totalLength, "(元素总长:", elementsSum, "+ 间距总和:", spacingSum, ")");
        
        if (totalLength > maxLength) {
          console.log("❌ 第一行超出最大长度");
          return false;
        }
        continue;
      }

      // 处理其他行
      for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
        const currentElement = currentRow[colIndex];
        const rightElement = currentRow[colIndex + 1];
        const topRightElement = layout[rowIndex - 1]?.[colIndex + 1];
        
        console.log(`\n检查元素 [${rowIndex},${colIndex}] (${currentElement.length}x${currentElement.width})`);

        // 是否为行首元素且无相关元素
        if (colIndex === 0 && !rightElement && !topRightElement) {
          rowTotalLength += currentElement.length;
          console.log("行首独立元素长度:", currentElement.length);
          continue;
        }

        // 计算与右侧元素的间距
        if (rightElement) {
          const spacing = this.calculateSpacing(currentElement.length + rightElement.length);
          rowTotalLength += currentElement.length + spacing;
          console.log("右侧间距:", spacing, "当前累计长度:", rowTotalLength);
        }

        // 计算与右上元素的间距
        else if (topRightElement) {
          const spacing = this.calculateSpacing(currentElement.length + topRightElement.length);
          rowTotalLength += currentElement.length + spacing;
          console.log("右上间距:", spacing, "当前累计长度:", rowTotalLength);
        }

        // 无相关元素
        else {
          rowTotalLength += currentElement.length;
          console.log("独立元素长度:", currentElement.length, "当前累计长度:", rowTotalLength);
        }
      }

      if (rowTotalLength > maxLength) {
        console.log(`❌ 第 ${rowIndex + 1} 行超出最大长度: ${rowTotalLength} > ${maxLength}`);
        return false;
      }
      console.log(`✅ 第 ${rowIndex + 1} 行检查通过: ${rowTotalLength} <= ${maxLength}`);
    }

    console.log("\n✅ 所有行间距检查通过");
    return true;
  }

  public calculateMoldSize(): Mold | null {
    const cache = new Map<string, { maxLength: number; maxWidth: number }>();
    let minArea = Infinity;
    let bestMold: Mold | null = null;
    


    function shouldRotateProduct(product: ProductDimensions): boolean {
      const ratio = Math.max(product.length, product.width) / Math.min(product.length , product.width);
      // console.log(`Checking rotation for ${product.length}x${product.width}, ratio: ${ratio}`);
      return ratio >= 1.2 && ratio <= 3;
    }
    
    // 按面积排序，简化排序
    const productsWithMetrics = this.products
      .sort((a, b) => (b.length * b.width) - (a.length * a.width))
      .map(p => ({
        ...p,
        area: p.length * p.width,
        bottom: 0,
        right: 0,
        originalLength: p.length,
        originalWidth: p.width,
        isRotated: false
      }));
    
    const calculateDimensions = (layout: ProductDimensions[][]): { maxLength: number; maxWidth: number } => {
      const key = JSON.stringify(layout);
      if (cache.has(key)) return cache.get(key)!;

      let maxLength = 0;
      let maxWidth = 0;
      
      // 快速检查：如果任何行超过最大尺寸，立即返回
      for (const row of layout) {        
    
        const rowLength = this.calculateRowLengthNew(row);
        if (rowLength > this.maxDimension) {
          return { maxLength: Infinity, maxWidth: Infinity };
        }
      }

      // 计算实际尺寸
      for (const row of layout) {
        
        const rowLength = this.calculateRowLengthNew(row);
        const rowMargin = this.calculateMargin(rowLength);
        maxLength = Math.max(maxLength, rowLength + rowMargin);
      }

      // 计算宽度
      const columnCount = Math.max(...layout.map(row => row.length));
      for (let j = 0; j < columnCount; j++) {
        // const column = layout.map(row => row[j]).filter(Boolean);
        

        const columnWidth = this.calculateColumnLengthByLayout(layout); // 更新取列宽度的函数

        const columnMargin = this.calculateMargin(columnWidth);
        maxWidth = Math.max(maxWidth, columnWidth + columnMargin);
      }

      // 优化：如果计算的面积已经超过当前最小面积，提前返回
      if (maxLength * maxWidth >= minArea) {
        return { maxLength: Infinity, maxWidth: Infinity };
      }

      const result = { maxLength, maxWidth };
      cache.set(key, result);
      return result;
    };

    let bestLayout: ProductDimensions[][] = [];
    const backtrack = (
      currentLayout: ProductDimensions[][],
      remainingProducts: typeof productsWithMetrics,
      currentDepth = 0
    ) => {
      // 验���布局的有效性
      if (!currentLayout.every(row => row && Array.isArray(row) && row.every(Boolean))) {
        console.warn('Invalid layout detected:', currentLayout);
        return;
      }

      //增加一个检查当前布局是否有重叠的函数
      if(this.checkOverlap(currentLayout)){
        return;
      }

      

      // 放宽搜索深度
      if (currentDepth > 50) return;
      
      const { maxLength, maxWidth } = calculateDimensions(currentLayout);
      
      //增加一个函数检查当前布局是否上下左右的间距都满足要求
      // if(!this.checkInnerMargin(currentLayout, maxLength, maxWidth)){
      //   return;
      // }

      const currentArea = maxLength * maxWidth;
      
      if (currentArea >= minArea) return;

      if (remainingProducts.length === 0) {
        const lengthAndWidthRatio = maxLength > maxWidth ? 
          (maxLength / maxWidth) : (maxWidth / maxLength);
        
        console.log("Layout check:", {
          dimensions: `${maxLength}x${maxWidth}`,
          ratio: lengthAndWidthRatio.toFixed(2),
          isValid: lengthAndWidthRatio <= this.maxRatio,
          area: currentArea
        });

        if (maxLength <= this.maxDimension && 
            maxWidth <= this.maxDimension && 
            maxLength && 
            lengthAndWidthRatio <= this.maxRatio) {
          if (currentArea < minArea) {
            minArea = currentArea;
            bestMold = {
              dimensions: {
                length: maxLength,
                width: maxWidth,
                height: this.calculateHeight(),
              },
              weight: 0,
              cavityCount: this.products.length,
              // moldMaterial: moldMaterialList[this.materialIndex].name,
              moldMaterial:this.moldMaterial
            };
            bestLayout = currentLayout;
            console.log("New best layout found:", {
              area: currentArea,
              dimensions: `${maxLength}x${maxWidth}`,
              ratio: lengthAndWidthRatio.toFixed(2),
              layout: currentLayout.map(row => 
                row.map(p => `${p.length}x${p.width}${p.isRotated ? '(R)' : ''}`)
              )
            });
          }
        }
        return;
      }

      const currentProduct = remainingProducts[0];
      const newRemaining = remainingProducts.slice(1);

      // 尝试原始方向和旋转方向
      const orientations = shouldRotateProduct(currentProduct) 
        ? [
            currentProduct,
            {
              ...currentProduct,
              length: currentProduct.width,
              width: currentProduct.length,
              isRotated: true
            }
          ]
        : [currentProduct];

      for (const orientation of orientations) {
        // 尝试添加到现有行
        for (let i = 0; i < currentLayout.length; i++) {
          const newRow = [...currentLayout[i], orientation];
          const rowLength = this.calculateRowLengthNew(newRow);
          
          if (rowLength + this.calculateMargin(rowLength) <= this.maxDimension) {
            const newLayout = [
              ...currentLayout.slice(0, i),
              newRow,
              ...currentLayout.slice(i + 1),
            ];
            backtrack(newLayout, newRemaining, currentDepth + 1);
          }
        }
        
        // 建新行
        backtrack([...currentLayout, [orientation]], newRemaining, currentDepth + 1);
      }
    };

    // 开始回溯
    backtrack([], productsWithMetrics);
    // console.log("bestMold dimensions result:", bestLayout);
    
    // 在返回结果之前，打印最终布局信息
    console.log("\n=== 最优布局信息 ===");
    bestLayout.forEach((row, rowIndex) => {
      console.log(`行 ${rowIndex + 1}:`, {
        products: row.map(p => `${p.length}x${p.width}${p.isRotated ? '(R)' : ''}`),
        rowLength: this.calculateRowLengthNew(row)
      });
    });
  
    // 输出列信息
    const columnCount = Math.max(...bestLayout.map(row => row.length));
    for (let j = 0; j < columnCount; j++) {
      const column = bestLayout.map(row => row[j]).filter(Boolean);
      console.log(`列 ${j + 1}:`, {
        products: column.map(p => `${p.length}x${p.width}${p.isRotated ? '(R)' : ''}`),
        columnWidth: this.calculateColumnLengthByLayout(bestLayout) // 更新取列宽度函数
      });
    }

    // console.log("bestMold dimensions result:",bestMold);
    this.productDimensionsWithLayout = bestLayout;
    const {maxInnerLength, maxInnerWidth} = this.showLayout(bestLayout)
    // console.log("bestMold layout result:", this.productDimensionsWithLayout);
    // this.calculateLayoutSpacing(this.productDimensionsWithLayout);
    // bestMold.weight = this.calculateMoldWeight(bestMold);
    bestMold!.maxRowLength = maxInnerLength;
    bestMold!.maxColumnLength = maxInnerWidth;
    bestMold!.verticalMargin = this.calculateMargin(bestMold!.maxColumnLength) / 2
    bestMold!.horizontalMargin = this.calculateMargin(bestMold!.maxRowLength) / 2
    this.bestMold = bestMold;
    return bestMold;
  }

  private showLayout(currentLayout: ProductDimensions[][]): {maxInnerLength:number,maxInnerWidth:number}{
    let maxInnerLengthTemp = 0;
    let maxInnerWidthTemp = 0;
    console.log("\n=== 最优布局信息 ===");
    currentLayout.forEach((row, rowIndex) => {
      maxInnerLengthTemp = Math.max(this.calculateRowLengthNew(row), maxInnerLengthTemp);
      console.log(`行 ${rowIndex + 1}:`, {
        products: row.map(p => `${p.length}x${p.width}`),
        rowLength: this.calculateRowLengthNew(row),
        spacing: this.calculateSpacing(this.calculateRowLengthNew(row))
      });
    });

    // 输出列信息
    const columnCount = Math.max(...currentLayout.map(row => row.length));
    for (let j = 0; j < columnCount; j++) {
      const column = currentLayout.map(row => row[j]).filter(Boolean);
      maxInnerWidthTemp = Math.max(this.calculateColumnLengthNew(column) ,maxInnerWidthTemp) ;
      console.log(`列 ${j + 1}:`, {
        products: column.map(p => `${p.length}x${p.width}`),
        columnWidth: this.calculateColumnLengthNew(column),
        spacing: this.calculateSpacing(this.calculateColumnLengthNew(column))
      });
    }
    return {maxInnerLength:maxInnerLengthTemp,maxInnerWidth:maxInnerWidthTemp};
  }

  public async calculateLayoutSpacing(): Promise<ProductDimensionsWithLayout[][]> {
    const processedData: ProductDimensionsWithLayout[][] = this.productDimensionsWithLayout.map((row, rowIndex) => {
      return row.map((element, colIndex) => {
        const { length, width } = element;

        // 计算 right 属性
        let right = 0;
        if (colIndex < row.length - 1 && row[colIndex + 1]) {
          right = this.calculateSpacing(length + row[colIndex + 1].length);
        }

        // 计算 bottom 属性
        let bottom = 0;
        const nextRow = this.productDimensionsWithLayout[rowIndex + 1];
        const nextElement = nextRow?.[colIndex];
        
        // 只在下一行存在且有对应列元素时计算间距
        if (nextElement) {
          bottom = this.calculateSpacing(width + nextElement.width);
        }

        return {
          ...element,
          right,
          bottom,
        };
      });
    });

    // 打印处理后的数据以便调试
    console.log("Processed layout with spacing:", 
      processedData.map(row => 
        row.map(item => ({
          size: `${item.length}x${item.width}`,
          right: item.right,
          bottom: item.bottom
        }))
      )
    );

    return processedData;
  }

  public async calculateProductPrice(): Promise<ProductDimensions[]> {
    if (!this.products) return [];

    // 1. 计算原材料价格
    const productsWithMaterialPrice = this.products.map(product => ({
      ...product,
      materialPrice: this.calculateMaterialPrice(product.volume ?? 0, product.productMaterial ?? ""),
      weight: this.calculateMaterialWeight(product.volume ?? 0, product.productMaterial ?? "")
    }));

    const totalWeight = productsWithMaterialPrice.reduce((acc, product) => 
      acc + (product.weight ?? 0), 0);
    
    // 2. 计算机器加工费
    const maxHeight = Math.max(...productsWithMaterialPrice.map(p => p.height));
    const machiningCost = this.calculateMachiningCost(maxHeight, totalWeight);

    // 3. 计算每个产品的加工费
    const materialGroups = productsWithMaterialPrice.reduce((acc, product) => {
      if (!product.productMaterial) return acc;
      acc[product.productMaterial] = (acc[product.productMaterial] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const productsWithProcessingCost = productsWithMaterialPrice.map(product => ({
      ...product,
      processingCost: product.productMaterial ? machiningCost / materialGroups[product.productMaterial] : 0
    }));

    // 4. 计算最终价格

    const profitCoefficient = this.moldConstantSettingList.find(rule => rule.constantName === "profitCoefficient")?.constantValue ?? 1.5;
    const finalProducts = productsWithProcessingCost.map(product => ({
      ...product,
      finalPrice: ((product.materialPrice + product.processingCost) * profitCoefficient ?? 1.5) / this.exchangeRate
    }));

    return finalProducts;
  }

  private calculateMaterialWeight(volume: number, material: string): number {
    const materialData = this.materialPriceSettingList.find(item => item.name === material);
    if (!materialData) return 0;

    return volume * materialData.density;
  }

  private calculateMaterialPrice(volume: number, material: string): number {
    const materialData = this.materialPriceSettingList.find(item => item.name === material);
    if (!materialData) return 0;

    const weight = volume * materialData.density;
    return weight * fixedLossRate * materialData.price;
  }

  private calculateMachiningCost(maxProuctHeight: number, totalWeight: number): number {
    if (!this.bestMold) return 0;

    const { length, width } = this.bestMold.dimensions;
    const moldWidth = Math.min(length, width);
    const moldHeight = this.bestMold.dimensions.height;

    const eligibleMachines = this.machinePriceSettingList
      .filter(machine => 
        moldWidth <= machine.moldWidth &&
        (moldHeight + maxProuctHeight) <= machine.moldHeight &&
        (totalWeight / 0.8) <= machine.injectionVolume
      )
      .sort((a, b) => {
        const aValue = parseInt(a.name.replace('T', ''));
        const bValue = parseInt(b.name.replace('T', ''));
        return aValue - bValue;
      });

    return eligibleMachines[0]?.machiningFee ?? 0;
  }

  public async calculateMoldPrice(): Promise<{moldWeight:number,moldPrice:number}> {
    if (!this.bestMold) return {moldWeight:0,moldPrice:0};

    const moldVolume = 
      this.bestMold.dimensions.length *
      this.bestMold.dimensions.width *
      this.bestMold.dimensions.height;
  
    const moldWeight = moldVolume * defaultMoldMaterialDensity;
    
   
    // console.log("convertedOperatingExpenseRules:",convertedOperatingExpenseRules);
    const runningFee = this.moldOperatingExpenseSettingList.find(rule => moldWeight <= rule.maxWeight)?.price ?? 0;

    // console.log("runningFee:",runningFee);
    // console.log("moldMaterial:",this.bestMold.moldMaterial);
    const moldMaterialName = this.bestMold.moldMaterial ?? "";
    let differPrice = 0;
    
      // console.log("convertedPriceDifferRules:",convertedPriceDifferRules);
    const differPriceCoefficient = this.moldPriceDifferSettingList.find(rule => moldMaterialName == rule.name.trim())?.coefficient ?? 0;
    if(differPriceCoefficient != 0){
      differPrice = (moldWeight  * differPriceCoefficient) / this.exchangeRate;
    }
    // console.log("moldWeight:",moldWeight);
    // console.log("differPrice:",differPrice);

    // console.log("differPrice:",differPrice);

    const moldPrice = moldWeight > this.weightDiffer ? ((moldWeight * 40 + runningFee) / this.exchangeRate + differPrice)
    : ((moldWeight * 50 + runningFee) / this.exchangeRate + differPrice );
    // return  Math.ceil(finalPrice / 100) * 100
    return {moldWeight,moldPrice};
  }
}

export async function createMoldCalculator(
  products: ProductDimensions[],
  moldMaterial: string
): Promise<MoldCalculator> {
  const exchangeRate = await getExchangeRate({
    originCurrency: "USD",
    targetCurrency: "CNY",
  });

  const moldPriceDifferSettingList = await getMoldPriceDifferSettingList();
  const moldOperatingExpenseSettingList = await getMoldOperatingExpenseSettingList();
  const moldConstantSettingList = await getMoldConstantSettingList();
  const materialPriceSettingList = await getMaterialPriceSettingList();
  const machinePriceSettingList = await getMachinePriceSettingList();
  return new MoldCalculator(products, moldMaterial, exchangeRate, 
    moldPriceDifferSettingList, 
    moldOperatingExpenseSettingList, 
    moldConstantSettingList, 
    materialPriceSettingList, 
    machinePriceSettingList
  );
}
