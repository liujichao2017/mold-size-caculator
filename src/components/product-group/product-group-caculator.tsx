'use client'

import { useState } from "react";
import { calculateProductGroupAction } from "@/actions/products-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ProductGroupOutputList } from "@/lib/validations/product-group";
import { GroupingSchemeDisplay } from "./grouping-scheme-display";

export function ProductGroupCalculator() {
  const [input, setInput] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ProductGroupOutputList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allowDifferentColors, setAllowDifferentColors] = useState(false);
  const [allowDifferentMaterials, setAllowDifferentMaterials] = useState(false);

  const handleCalculate = async () => {
    if (!input.trim()) {
      setError('Please enter product data');
      return;
    }

    setIsCalculating(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await calculateProductGroupAction(input, {
        allowDifferentColors,
        allowDifferentMaterials,
      });
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error ?? 'Calculation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setError(null);
    setAllowDifferentColors(false);
    setAllowDifferentMaterials(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Group Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your product list JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono"
          />
          
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Button
                onClick={handleCalculate}
                disabled={isCalculating || !input}
              >
                {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Calculate Groups
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isCalculating}
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="allowColors"
                  checked={allowDifferentColors}
                  onCheckedChange={(checked) => 
                    setAllowDifferentColors(checked as boolean)
                  }
                  disabled={isCalculating}
                />
                <Label htmlFor="allowColors">
                  Allow Different Colors
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="allowMaterials"
                  checked={allowDifferentMaterials}
                  onCheckedChange={(checked) => 
                    setAllowDifferentMaterials(checked as boolean)
                  }
                  disabled={isCalculating}
                />
                <Label htmlFor="allowMaterials">
                  Allow Different Materials
                </Label>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && <GroupingSchemeDisplay schemes={result} />}
        </CardContent>
      </Card>
    </div>
  );
}