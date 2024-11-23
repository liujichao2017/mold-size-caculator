'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Mold } from "@/types";

interface ProcessingCost {
  productMakingQuantity: number;
  productMakingPrice: number;
  productSinglePrice: number;
  productTotalPrice: number;
}

interface ProductPrice {
  length: number;
  width: number;
  height: number;
  volume: number;
  productMaterial: string;
  productQuantity: number;
  productWeight: number;
  materialPrice: number;
  weight: number;
  processingCost: ProcessingCost[];
  finalPrice: number;
}

interface PriceResultDisplayProps {
  data: {
    mold: Mold;
    moldPrice: number;
    moldWeight: number;
    productPrice: string;
  };
}

export function PriceResultDisplay({ data }: PriceResultDisplayProps) {
  const productPrices = JSON.parse(data.productPrice) as Record<string, ProductPrice>;

  return (
    <div className="mt-4 space-y-4">
      {/* 模具信息 */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Mold Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Size:</span>{' '}
              {data.mold.dimensions.length}x{data.mold.dimensions.width}x{data.mold.dimensions.height} mm
            </div>
            <div>
              <span className="font-medium">Weight:</span>{' '}
              {data.moldWeight.toLocaleString()} kg
            </div>
            <div>
              <span className="font-medium">Material:</span>{' '}
              {data.mold.moldMaterial}
            </div>
            <div>
              <span className="font-medium">Price:</span>{' '}
              ${data.moldPrice.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 产品价格信息 */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Product Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(productPrices).map(([key, price]) => (
              <div key={key} className="border rounded-lg p-3">
                <div className="text-sm font-medium mb-2">Product {parseInt(key) + 1}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium">Dimensions:</span>{' '}
                    {price.length}x{price.width}x{price.height} mm
                  </div>
                  <div>
                    <span className="font-medium">Volume:</span>{' '}
                    {price.volume.toLocaleString()} mm³
                  </div>
                  <div>
                    <span className="font-medium">Material:</span>{' '}
                    {price.productMaterial}
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span>{' '}
                    {price.productQuantity.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span>{' '}
                    {price.productWeight.toFixed(2)} g
                  </div>
                  <div>
                    <span className="font-medium">Material Price:</span>{' '}
                    ¥{price.materialPrice.toFixed(3)}
                  </div>
                  
                  {/* 加工费详情 */}
                  <div className="col-span-2">
                    <div className="font-medium mb-1">Processing Costs:</div>
                    <div className="pl-4 space-y-2">
                      {price.processingCost.map((cost, index) => (
                        <div key={index} className="border rounded p-2 bg-muted/30">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Quantity:</span>{' '}
                              {cost.productMakingQuantity.toLocaleString()} 
                            </div>
                            <div>
                              <span className="font-medium">Making Price:</span>{' '}
                              ¥{cost.productMakingPrice.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Single Price:</span>{' '}
                              ${cost.productSinglePrice.toFixed(4)}
                            </div>
                            <div>
                              <span className="font-medium">Total Price:</span>{' '}
                              ${cost.productTotalPrice.toFixed(3)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 text-primary font-semibold border-t pt-2 mt-2">
                    <span>Final Price:</span>{' '}
                    ${price.finalPrice.toFixed(3)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}