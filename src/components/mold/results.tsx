'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Mold } from "@/types"
import { motion } from "framer-motion"

interface ResultsProps {
  mold: Mold
  price: number
}

export function Results({ mold, price }: ResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle>Calculation Results</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              label="Total Price"
              value={`$${price.toFixed(2)}`}
              icon={<DollarIcon className="w-4 h-4" />}
              highlight
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ResultItemProps {
  label: string
  value: string
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
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`text-lg font-semibold ${
          highlight ? 'text-primary' : 'text-foreground'
        }`}>
          {value}
        </p>
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