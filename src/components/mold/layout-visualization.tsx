import { cn } from "@/lib/utils";
import { type ProductTwoDimensionsWithLayout } from "@/types";

interface ProductDimensions {
  length: number;
  width: number;
  bottom: number;
  right: number;
}

interface LayoutVisualizationProps {
  outerDimensions: { length: number; width: number };
  innerDimensions: { length: number; width: number };
  margins: { top: number; right: number; bottom: number; left: number };
  layout: string | null;
}

export function LayoutVisualization({
  outerDimensions,
  innerDimensions,
  margins,
  layout,
}: LayoutVisualizationProps) {
  // 计算缩放比例，使图形适应容器
  const scale = Math.min(
    600 / outerDimensions.length,  // 600px 是容器的最大宽度
    400 / outerDimensions.width    // 400px 是容器的最大高度
  );

  const layoutTest = [
    [{length:150,width:150, bottom:35,right:35,height:100,volume:5622.29,area:20000,},
      {length:150,width:150, bottom:35,right:35,height:100,volume:5622.29,area:20000,},
      {length:150,width:150, bottom:35,right:35,height:100,volume:5622.29,area:20000,},
      {length:150,width:150, bottom:35,right:0,height:100,volume:5622.29,area:20000,}],
    [{length:150,width:150, bottom:0,right:35,height:100,volume:5622.29,area:20000,},
      {length:150,width:150, bottom:0,right:35,height:100,volume:5622.29,area:20000,},
      {length:150,width:150, bottom:0,right:35,height:100,volume:5622.29,area:20000,},
      {length:150,width:150, bottom:0,right:0,height:100,volume:5622.29,area:20000,}],
  ];  

  
  // 计算每个产品的相对位置
  const calculateProductPosition = (
    rowIndex: number,
    colIndex: number,
  ) => {
    if(!layout){
      return {left: 0, top: 0};
    }
    const row = (JSON.parse(layout ?? "") as  ProductDimensions[][]).slice(0, rowIndex);
    // const prevRowsHeight = row.reduce((sum, curr) => 
    //   sum + Math.max(...curr.map(p => p.width )), 0);

    const prevRowsHeight = rowIndex === 0 ? 0 : row.reduce((sum, currentRow, currentRowIndex) => {
      // Get the product from the same column or nearest previous column
      const getRelevantProduct = (rowProducts: ProductDimensions[]) => {
        for (let col = colIndex; col >= 0; col--) {
          if (rowProducts[col]?.width) {
            return rowProducts[col];
          }
        }
        return null;
      };

      const relevantProduct = getRelevantProduct(currentRow);
      const rowHeight = relevantProduct 
        ? relevantProduct.width + (relevantProduct.bottom ?? 0)
        : 0;

      return sum + rowHeight;
    }, 0);

    // const prevRowsHeight = row.reduce((sum, curr) => 
    //   sum + Math.max(...curr.map(p => p.width)), 0);
    
    const prevColsWidth = (JSON.parse(layout ?? "") as  ProductDimensions[][])[rowIndex]
      .slice(0, colIndex)
      .reduce((sum, p) => sum + p.length, 0);

    const prevColsLeft = (JSON.parse(layout ?? "") as  ProductDimensions[][])[rowIndex]
    .slice(0, colIndex)
    .reduce((sum, p) => sum + ( p.right ?? 0 ), 0);

    // console.log("left: ", prevColsWidth + prevColsLeft)
    // console.log("top: ", prevRowsHeight)
    return {
      left:  prevColsWidth + prevColsLeft,
      top:   prevRowsHeight,
    };
  };

  console.log("LayoutVisualization: ", layout)
  // console.log("LayoutVisualization: ", typeof(JSON.parse(layout ?? "")  ) )
  // console.log("layoutTest: ", typeof(layoutTest) )

  return (
    <div className="w-full max-w-[600px] mx-auto mt-8">
      <div 
        className="relative bg-muted"
        style={{
          width: outerDimensions.length * scale,
          height: outerDimensions.width * scale,
        }}
      >
        {/* 内层矩形 */}
        <div
          className="absolute bg-background border border-border"
          style={{
            left: margins.left * scale,
            top: margins.top * scale,
            width: innerDimensions.length * scale,
            height: innerDimensions.width * scale,
          }}
        >
          {/* 产品布局 */}
          { layout != null ? (
            (JSON.parse(layout ?? "") as  ProductDimensions[][]).map((row, rowIndex) =>
              row.map((product, colIndex) => {
                const position = calculateProductPosition(rowIndex, colIndex);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "absolute border border-box border-primary bg-primary/10",
                      "flex items-center justify-center text-xs"
                    )}
                    style={{
                      left: position.left * scale,
                      top: position.top * scale,
                      width: product.length * scale,
                      height: product.width * scale,
                    }}
                  >
                    {`${product.length}x${product.width}`}
                  </div>
                );
              })
            )
          ) : ''}
          
        </div>
      </div>
      
      {/* 尺寸标注 */}
      <div className="mt-4 text-sm text-muted-foreground">
        <p>外层尺寸: {outerDimensions.length} x {outerDimensions.width}</p>
        <p>内层尺寸: {innerDimensions.length} x {innerDimensions.width}</p>
        <p>距: 上{margins.top} 右{margins.right} 下{margins.bottom} 左{margins.left}</p>
      </div>
    </div>
  );
}
