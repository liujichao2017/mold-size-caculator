import { validators } from "@/types"
import { Results } from "@/components/mold/results"
import * as React from 'react'
import { MoldCalculator } from "@/components/mold/calculator"
import { Separator } from "@/components/ui/separator"

interface ShowMoldPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

export default function ShowMoldPage({
  searchParams,
}: ShowMoldPageProps) {
  const params = React.use(searchParams as unknown as Promise<typeof searchParams>)
  const moldParam = (params?.mold ?? null) as string | null
  const priceParam = (params?.price ?? null) as string | null
  
  const mold = moldParam ? (JSON.parse(moldParam) as Record<string, unknown>) : null
  const price = priceParam ? parseFloat(priceParam) : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-3xl py-12 mx-auto">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Mold Calculator
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground">
            Calculate precise mold dimensions and pricing for your manufacturing needs.
          </p>
        </div>
        
        <div className="space-y-8">
          <MoldCalculator />
          
          {mold && price && (
            <>
              <Separator className="my-8" />
              <Results 
                mold={validators.validateMold(mold)} 
                price={price} 
              />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
