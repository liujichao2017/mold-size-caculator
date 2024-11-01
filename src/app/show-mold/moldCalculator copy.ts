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

function calculateMoldSize(products: Product[]): LayoutResult {
  const sortedProducts = products
    .map((product) => ({
      original: product,
      horizontal: { length: product.length, width: product.width },
      vertical: { length: product.width, width: product.length },
    }))
    .sort((a, b) => {
      const maxLengthA = Math.max(a.horizontal.length, a.vertical.length);
      const maxLengthB = Math.max(b.horizontal.length, b.vertical.length);
      return maxLengthB - maxLengthA;
    });

  let currentRow: PlacedProduct[] = [];
  let currentRowLength = 0;
  let currentRowWidth = 0;
  let moldLength = 0;
  let moldWidth = 0;
  let moldHeight = 0;
  let productSpacing = 0;
  let moldSpacing = 0;
  const layout: LayoutRow[] = [];

  for (const productInfo of sortedProducts) {
    const product = productInfo.original;
    const horizontal = productInfo.horizontal;
    const vertical = productInfo.vertical;

    // Try both orientations and choose the better one
    const tryHorizontal = () => {
      const newLength =
        currentRowLength +
        (currentRow.length > 0 ? productSpacing : 0) +
        horizontal.length;
      const newWidth = Math.max(currentRowWidth, horizontal.width);
      return {
        newLength,
        newWidth,
        orientation: 'horizontal' as 'horizontal' | 'vertical',
      };
    };

    const tryVertical = () => {
      const newLength =
        currentRowLength +
        (currentRow.length > 0 ? productSpacing : 0) +
        vertical.length;
      const newWidth = Math.max(currentRowWidth, vertical.width);
      return {
        newLength,
        newWidth,
        orientation: 'vertical' as 'horizontal' | 'vertical',
      };
    };

    const horizontalResult = tryHorizontal();
    const verticalResult = tryVertical();

    const result =
      horizontalResult.newLength <= verticalResult.newLength
        ? horizontalResult
        : verticalResult;

    if (result.newLength <= 1000 - moldSpacing) {
      currentRow.push({ product, orientation: result.orientation });
      currentRowLength = result.newLength;
      currentRowWidth = result.newWidth;
    } else {
      productSpacing = calculateSpacing(currentRowLength);
      moldSpacing = calculateMoldSpacing(currentRowLength);
      moldLength = Math.max(moldLength, currentRowLength + moldSpacing);
      moldWidth += currentRowWidth + (layout.length > 0 ? productSpacing : 0);
      layout.push({ row: layout.length, products: [...currentRow] });
      currentRow = [{ product, orientation: result.orientation }];
      currentRowLength = result.newLength;
      currentRowWidth = result.newWidth;
    }
  }

  // Add the last row
  productSpacing = calculateSpacing(currentRowLength);
  moldSpacing = calculateMoldSpacing(currentRowLength);
  moldLength = Math.max(moldLength, currentRowLength + moldSpacing);
  moldWidth += currentRowWidth + (layout.length > 0 ? productSpacing : 0);
  layout.push({ row: layout.length, products: [...currentRow] });
  moldHeight = calculateHeight(products);

  // Ensure the mold dimensions include the spacing
  moldLength += moldSpacing;
  moldWidth += moldSpacing;

  return {
    moldLength,
    moldWidth,
    moldHeight,
    productSpacing,
    moldSpacing,
    layout,
  };
}

export { calculateMoldSize };
