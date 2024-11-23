'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ProductGroupOutputList } from "@/lib/validations/product-group";
import { ProductDisplay } from "./product-display";
import { PriceResultDisplay } from "./price-result-display";
import { calculateGroupPriceAction } from "@/actions/products-group";
import { toast } from "sonner";
import { type Mold } from "@/types";

interface PriceResult {
  mold: Mold;
  moldPrice: number;
  moldWeight: number;
  productPrice: string;
}

interface GroupingSchemeDisplayProps {
  schemes: ProductGroupOutputList;
}

export function GroupingSchemeDisplay({ schemes }: GroupingSchemeDisplayProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeCalculation, setActiveCalculation] = useState<string | null>(null);
  const [groupResults, setGroupResults] = useState<Record<string, PriceResult>>({});

  const handleCalculatePrice = async (schemeIndex: number, groupIndex: number) => {
    const key = `${schemeIndex}-${groupIndex}`;
    setIsCalculating(true);
    setActiveCalculation(key);
    
    try {
      const currentGroup = schemes[schemeIndex][groupIndex];
      const response = await calculateGroupPriceAction(currentGroup);
      
      if (response.success && response.data) {
        setGroupResults(prev => {
          const newResults = { ...prev };
          newResults[key] = response.data as PriceResult;
          return newResults;
        });
        toast.success('Price calculation completed');
      } else {
        toast.error(response.error ?? 'Failed to calculate price');
      }
    } catch (error) {
      toast.error('An error occurred while calculating price');
      console.error(error);
    } finally {
      setIsCalculating(false);
      setActiveCalculation(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Found {schemes.length} Different Grouping Schemes
      </h3>
      {schemes.map((scheme, schemeIndex) => (
        <Card key={schemeIndex} className="border-2">
          <CardHeader>
            <CardTitle className="text-base">
              Grouping Scheme {schemeIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheme.map((group, groupIndex) => {
              const key = `${schemeIndex}-${groupIndex}`;
              const isActiveCalculation = activeCalculation === key;
              const result = groupResults[key];

              return (
                <Card key={groupIndex}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">
                        Group {groupIndex + 1} ({group.length} products)
                      </CardTitle>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCalculatePrice(schemeIndex, groupIndex)}
                      disabled={isCalculating}
                    >
                      {isActiveCalculation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>Calculate Price</>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        {group.map((product, productIndex) => (
                          <ProductDisplay 
                            key={productIndex} 
                            product={product} 
                          />
                        ))}
                      </div>
                      
                      {/* 显示计算结果 */}
                      {result && (
                        <PriceResultDisplay data={result} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}