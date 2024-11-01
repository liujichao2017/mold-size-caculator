'use client';

import { Card, CardContent } from "@/components/ui/card"
import type { Mold } from "@/types"

interface ResultsProps {
  mold: Mold
  price: number
}

export function Results({ mold, price }: ResultsProps) {
  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Dimensions</p>
              <p>
                {mold.dimensions.length} x {mold.dimensions.width} x{' '}
                {mold.dimensions.height} mm
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Area</p>
              <p>
                {mold.dimensions.length * mold.dimensions.width} mm²
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Volume</p>
              <p>
                {mold.dimensions.length * 
                 mold.dimensions.width * 
                 mold.dimensions.height} mm³
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p>${price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 