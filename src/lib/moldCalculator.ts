import {
  borderSpaceRules,
  marginSpaceRules,
  moldMaterialList,
  moldPriceSolutionOneRules,
  moldPriceSolutionTwoRules,
  moldStructureHeightRules,
} from "./constants";
import { getExchangeRate } from "./getExchangeRate";
import type { Mold, ProductDimensions } from "@/types";

class MoldCalculator {
  private readonly weightDiffer = 1000;
  private readonly maxDimension = 1000;
  private minArea = Infinity;
  private bestMold: Mold | null = null;
  private materialIndex: number;
  private readonly products: ProductDimensions[];
  private readonly exchangeRate: number;

  constructor(products: ProductDimensions[], moldMaterial: string, exchangeRate: number) {
    this.products = products;
    this.materialIndex = moldMaterialList.findIndex(mold => mold.name === moldMaterial);
    this.exchangeRate = exchangeRate;
  }

  private calculateHeight(): number {
    const maxHeight = Math.max(...this.products.map(item => item.height));
    return maxHeight + (
      moldStructureHeightRules.find(rule => maxHeight <= rule.height)?.height ?? 0
    );
  }

  private calculateSpacing(totalLength: number): number {
    return marginSpaceRules.find(rule => totalLength <= rule.maxLength)?.spacing ?? 0;
  }

  private calculateMargin(totalLength: number): number {
    return (borderSpaceRules.find(rule => totalLength <= rule.maxLength)?.spacing ?? 0) * 2;
  }

  private calculateRowLength(row: ProductDimensions[], spacing: number): number {
    const totalLength = row.reduce((sum, product) => sum + product.length, 0);
    const totalSpacing = (row.length - 1) * spacing;
    return totalLength + totalSpacing;
  }

  private calculateColumnWidth(column: ProductDimensions[], spacing: number): number {
    const totalWidth = column.reduce((sum, product) => sum + product.width, 0);
    const totalSpacing = (column.length - 1) * spacing;
    return totalWidth + totalSpacing;
  }

  private calculateLayoutDimensions(layout: ProductDimensions[][]) {
    let maxLength = 0;
    let maxWidth = 0;

    for (const row of layout) {
      const rowLength = this.calculateRowLength(
        row,
        this.calculateSpacing(row.reduce((sum, product) => sum + product.length, 0))
      );
      const rowMargin = this.calculateMargin(rowLength);
      maxLength = Math.max(maxLength, rowLength + rowMargin);

      const columnWidth = Math.max(
        ...row.map(product => {
          const width = this.calculateColumnWidth(
            [product],
            this.calculateSpacing(product.width)
          );
          return width + this.calculateMargin(width);
        })
      );
      maxWidth = Math.max(maxWidth, columnWidth);
    }

    return { maxLength, maxWidth };
  }

  private isLayoutExceedingBounds(layout: ProductDimensions[][]): boolean {
    const { maxLength, maxWidth } = this.calculateLayoutDimensions(layout);
    return maxLength > this.maxDimension || maxWidth > this.maxDimension;
  }

  private canAddToRow(row: ProductDimensions[], product: ProductDimensions): boolean {
    const newRow = [...row, product];
    const rowLength = this.calculateRowLength(
      newRow,
      this.calculateSpacing(newRow.reduce((sum, p) => sum + p.length, 0))
    );
    return rowLength + this.calculateMargin(rowLength) <= this.maxDimension;
  }

  private updateBestMold(maxLength: number, maxWidth: number): void {
    this.minArea = maxLength * maxWidth;
    this.bestMold = {
      dimensions: {
        length: maxLength,
        width: maxWidth,
        height: this.calculateHeight(),
      },
      weight: 0,
      cavityCount: this.products.length,
      moldMaterial: moldMaterialList[this.materialIndex].name,
    };
  }

  private backtrack(
    currentLayout: ProductDimensions[][],
    remainingProducts: ProductDimensions[]
  ): void {
    if (this.isLayoutExceedingBounds(currentLayout)) return;

    if (remainingProducts.length === 0) {
      const { maxLength, maxWidth } = this.calculateLayoutDimensions(currentLayout);
      const area = maxLength * maxWidth;
      
      if (area < this.minArea && maxLength <= this.maxDimension && maxWidth <= this.maxDimension) {
        this.updateBestMold(maxLength, maxWidth);
      }
      return;
    }

    for (let i = 0; i < remainingProducts.length; i++) {
      const product = remainingProducts[i];
      const newRemainingProducts = [
        ...remainingProducts.slice(0, i),
        ...remainingProducts.slice(i + 1),
      ];

      for (let j = 0; j < currentLayout.length; j++) {
        if (this.canAddToRow(currentLayout[j], product)) {
          const newLayout = [
            ...currentLayout.slice(0, j),
            [...currentLayout[j], product],
            ...currentLayout.slice(j + 1),
          ];
          this.backtrack(newLayout, newRemainingProducts);
        }
      }

      this.backtrack([...currentLayout, [product]], newRemainingProducts);
    }
  }

  public calculateMoldSize(): Mold | null {
    this.backtrack([], [...this.products]);
    return this.bestMold;
  }

  public async calculateMoldPrice(): Promise<number> {
    if (!this.bestMold) return 0;

    const density = moldMaterialList.find(
      mold => mold.name === this.bestMold?.moldMaterial
    )?.density ?? 0;

    const moldVolume = 
      this.bestMold.dimensions.length *
      this.bestMold.dimensions.width *
      this.bestMold.dimensions.height;

    const moldWeight = moldVolume * density;
    
    const runningFee = moldWeight > this.weightDiffer
      ? moldPriceSolutionTwoRules.find(rule => moldWeight <= rule.maxWeight)?.price ?? 0
      : moldPriceSolutionOneRules.find(rule => moldWeight <= rule.maxWeight)?.price ?? 0;

    let differPrice = 0;
    if (this.bestMold.moldMaterial === "NAK80") {
      differPrice = ((moldWeight / 4) * 60) / this.exchangeRate;
    }

    return runningFee + differPrice;
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
  
  return new MoldCalculator(products, moldMaterial, exchangeRate);
}