//改成枚举
export interface Product {
  length: number;
  width: number;
  height: number;
}

interface LayoutRow {
  row: number;
  products: PlacedProduct[];
}

interface PlacedProduct {
  product: Product;
  orientation: 'horizontal' | 'vertical';
}

export interface LayoutResult {
  moldLength: number;
  moldWidth: number;
  moldHeight: number;
  productSpacing: number;
  moldSpacing: number;
  layout: LayoutRow[];
}

export interface Mold {
  moldLength: number;
  moldWidth: number;
  moldHeight: number;
}

function calculateHeight(products: Product[]): number {
  const maxHeight = Math.max(...products.map((item) => item.height));
  if (maxHeight <= 50) return maxHeight + 140;
  else if (maxHeight <= 100) return maxHeight + 170;
  else if (maxHeight <= 150) return maxHeight + 200;
  else if (maxHeight <= 200) return maxHeight + 230;
  else if (maxHeight <= 250) return maxHeight + 260;
  else if (maxHeight <= 300) return maxHeight + 280;
  else if (maxHeight <= 350) return maxHeight + 300;
  else if (maxHeight <= 400) return maxHeight + 320;
  else if (maxHeight <= 450) return maxHeight + 340;
  else if (maxHeight <= 500) return maxHeight + 360;
  else return 0;
}

function calculateSpacing(totalLength: number): number {
  if (totalLength <= 200) return 30;
  else if (totalLength <= 300) return 35;
  else if (totalLength <= 400) return 40;
  else if (totalLength <= 500) return 45;
  else if (totalLength <= 600) return 50;
  else if (totalLength <= 700) return 55;
  else if (totalLength <= 800) return 60;
  else if (totalLength <= 900) return 65;
  else return 70;
}

function calculateMargin(totalLength: number): number {
  if (totalLength <= 200) return 120;
  else if (totalLength <= 400) return 160;
  else if (totalLength <= 600) return 180;
  else if (totalLength <= 800) return 200;
  else if (totalLength <= 900) return 220;
  else return 240;
}

function calculateRowLength(row: Product[], spacing: number): number {
  const totalLength = row.reduce((sum, product) => sum + product.length, 0);
  const totalSpacing = (row.length - 1) * spacing;
  return totalLength + totalSpacing;
}

function calculateColumnWidth(column: Product[], spacing: number): number {
  const totalWidth = column.reduce((sum, product) => sum + product.width, 0);
  const totalSpacing = (column.length - 1) * spacing;
  return totalWidth + totalSpacing;
}

function calculateMoldSize(products: Product[]): Mold | null {
  let minArea = Infinity;
  let bestMold: Mold | null = null;

  function backtrack(currentLayout: Product[][], remainingProducts: Product[]) {
    if (remainingProducts.length === 0) {
      let maxLength = 0;
      let maxWidth = 0;

      for (let i = 0; i < currentLayout.length; i++) {
        const row = currentLayout[i];
        const rowLength = calculateRowLength(
          row,
          calculateSpacing(
            row.reduce((sum, product) => sum + product.length, 0)
          )
        );
        const rowMargin = calculateMargin(rowLength);
        maxLength = Math.max(maxLength, rowLength + rowMargin);

        for (let j = 0; j < row.length; j++) {
          const column = currentLayout.map(
            (row) => row[j] || { length: 0, width: 0 }
          ); // 确保 column 中的每个元素都存在
          const columnWidth = calculateColumnWidth(
            column,
            calculateSpacing(
              column.reduce((sum, product) => sum + product.width, 0)
            )
          );
          const columnMargin = calculateMargin(columnWidth);
          maxWidth = Math.max(maxWidth, columnWidth + columnMargin);
        }
      }

      const area = maxLength * maxWidth;
      if (area < minArea && maxLength <= 1000 && maxWidth <= 1000) {
        minArea = area;
        bestMold = {
          moldLength: maxLength,
          moldWidth: maxWidth,
          moldHeight: calculateHeight(products),
        };
      }
      return;
    }

    for (let i = 0; i < remainingProducts.length; i++) {
      const product = remainingProducts[i];
      const newRemainingProducts = [
        ...remainingProducts.slice(0, i),
        ...remainingProducts.slice(i + 1),
      ];

      // 尝试将产品添加到现有行
      for (let j = 0; j < currentLayout.length; j++) {
        const newRow = [...currentLayout[j], product];
        const newRowLength = calculateRowLength(
          newRow,
          calculateSpacing(
            newRow.reduce((sum, product) => sum + product.length, 0)
          )
        );
        if (newRowLength + calculateMargin(newRowLength) <= 1000) {
          const newCurrentLayout = [
            ...currentLayout.slice(0, j),
            newRow,
            ...currentLayout.slice(j + 1),
          ];
          backtrack(newCurrentLayout, newRemainingProducts);
        }
      }

      // 尝试将产品添加到新行
      const newCurrentLayout = [...currentLayout, [product]];
      backtrack(newCurrentLayout, newRemainingProducts);
    }
  }

  backtrack([], products);
  return bestMold;
}

export { calculateMoldSize };
