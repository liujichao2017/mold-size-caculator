'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DimensionsWithPrice, Mold, ProductDimensions } from "@/types"
import { motion } from "framer-motion"
import { formatNumber } from "@/lib/utils"
import React from 'react'
import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"
import { useTransition } from "react"
import { saveMoldPrices } from "@/actions/save-mold-price"
// import { toast } from "sonner"

interface ResultsProps {
  mold: Mold
  moldPrice: number
  moldWeight: number
  productPrice: string | null;
}

export function Results({ mold, moldPrice, moldWeight, productPrice }: ResultsProps) {
  // const [isPending, startTransition] = useTransition()

  // const handleSave = () => {
  //   startTransition(async () => {
  //     const result = await saveMoldPrices(
  //       // mold.id,
  //       moldPrice,
  //       moldWeight,
  //       productPrice ?? '[]'
  //     )

  //     if (result.success) {
  //       console.log("Prices saved successfully")
  //       // toast.success('Prices saved successfully')
  //     } else {
  //       console.log("Failed to save prices")
  //       // toast.error(result.error || 'Failed to save prices')
  //     }
  //   })
  // }

  let productPriceArray: DimensionsWithPrice[] = [];
  try {
    productPriceArray = JSON.parse(productPrice ?? "[]") as DimensionsWithPrice[];
  } catch {
    productPriceArray = [];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 flex flex-row items-center justify-between">
          <CardTitle>Calculation Results</CardTitle>
          {/* <Button
            onClick={handleSave}
            disabled={isPending}
            size="sm"
            className="gap-2"
          >
            <SaveIcon className="w-4 h-4" />
            {isPending ? 'Saving...' : 'Save Prices'}
          </Button> */}
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResultItem
              label="Dimensions"
              value={`${mold.dimensions.length} × ${mold.dimensions.width} × ${mold.dimensions.height} mm`}
              icon={<CubeIcon className="w-4 h-4" />}
            />
            <ResultItem
              label="Surface Area"
              value={`${mold.dimensions.length * mold.dimensions.width} mm²`}
              icon={<SquareIcon className="w-4 h-4" />}
            />
            <ResultItem
              label="Volume"
              value={`${mold.dimensions.length * mold.dimensions.width * mold.dimensions.height} mm³`}
              icon={<BoxIcon className="w-4 h-4" />}
            />
            <ResultItem
              label="Mold Material"
              value={mold.moldMaterial || 'N/A'}
              icon={<LayersIcon className="w-4 h-4" />}
            />
            <ResultItem
              label="Mold Weight"
              value={`${formatNumber(moldWeight, 2)} kg`}
              icon={<ScaleIcon className="w-4 h-4" />}
            />
            <ResultItem
              label="Total Price"
              value={`$${moldPrice.toFixed(2)}`}
              icon={<DollarIcon className="w-4 h-4" />}
              highlight
            />
          </div>

          {productPriceArray.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <div className="grid grid-cols-1 gap-4">
                {productPriceArray.map((product, index) => (
                  <ResultItem
                    key={index}
                    label={`Product ${index + 1}`}
                    value={
                      <div className="flex items-center gap-6">
                        <span>{`${product.length} × ${product.width} × ${product.height} mm`}</span>
                        <span>{product.productMaterial ?? 'N/A'}</span>
                        <span>{formatNumber(Number(product.weight || 0), 1)} g</span>
                        <span>${formatNumber(Number(product.finalPrice || 0), 3)}</span>
                      </div>
                    }
                    icon={<LayersIcon className="w-4 h-4" />}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ResultItemProps {
  label: string
  value: string | React.ReactNode
  icon: React.ReactNode
  highlight?: boolean
}

function ResultItem({ label, value, icon, highlight }: ResultItemProps) {
  return (
    <div className={`flex items-start space-x-4 p-4 rounded-lg ${
      highlight ? 'bg-primary/10' : 'bg-muted/50'
    }`}>
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className={`text-lg font-semibold ${
          highlight ? 'text-primary' : 'text-foreground'
        }`}>
          {value}
        </div>
      </div>
    </div>
  )
}

// Simple icon components (you can replace these with your preferred icon library)
function CubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}

function SquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  )
}

function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      {...props}
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  )
}

function DollarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      {...props}
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function ScaleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M12 3v3" />
      <path d="M16.5 12h-9" />
      <path d="M12 9v3" />
    </svg>
  )
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      {...props}
    >
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  )
}

function WeightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      {...props}
    >
      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M16 16v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
      <path d="M12 6v5" />
    </svg>
  )
}

function CalculatorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      {...props}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  )
}