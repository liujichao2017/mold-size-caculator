import { type ProductTwoDimensionsWithLayout, type Mold } from "@/types";
import { LayoutVisualization } from "./layout-visualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface ProductDimensions {
//   length: number;
//   width: number;
// }

interface LayoutDisplayProps {
  mold: Mold;
  layout: string | null;
  
}

export function LayoutDisplay({
  mold,
  layout,
}: LayoutDisplayProps) {

  const moldDimensions = { length: mold.dimensions.length, width: mold.dimensions.width };
  // const horizontalMargin = (mold.dimensions.length - (mold.maxRowLength ?? 0 )) / 2;
  // const verticalMargin =  (mold.dimensions.width - ( mold.maxColumnLength ?? 0)) / 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mold Layout Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <LayoutVisualization
          outerDimensions={moldDimensions}
          innerDimensions={{
            length: mold.maxRowLength,
            width: mold.maxColumnLength,
          }}
          margins={{
            top: mold.verticalMargin,
            right: mold.horizontalMargin,
            bottom: mold.verticalMargin,
            left: mold.horizontalMargin,
          }}
          layout={layout}
        />
      </CardContent>
    </Card>
  );
} 