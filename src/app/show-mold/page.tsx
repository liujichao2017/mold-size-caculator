'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userInputSchema, type UserInput, validators } from "@/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { calculateMold } from "@/actions"
import { Results } from "@/components/mold/results"
import * as React from 'react'

export function MoldCalculator() {
  const router = useRouter()
  const form = useForm<UserInput>({
    resolver: zodResolver(userInputSchema),
    defaultValues: {
      jsonInput: "",
    },
  })

  const onSubmit = async (data: UserInput) => {
    try {
      const result = await calculateMold(data.jsonInput)
      
      if (!result.success) {
        form.setError("jsonInput", { 
          type: "manual",
          message: result.error 
        })
        return
      }
      
      const searchParams = new URLSearchParams()
      searchParams.set("mold", JSON.stringify(result.mold))
      searchParams.set("price", result.price?.toString() ?? "")
      router.push(`?${searchParams.toString()}`)
    } catch (err) {
      form.setError("jsonInput", {
        type: "manual",
        message: "An unexpected error occurred"
      })
      console.error(err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mold Layout Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jsonInput"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Enter products as JSON, e.g.:
{
  "products": [
    {"dimensions": {"length": 54, "width": 85.5, "height": 4.5, "volume": 100}, "productId": 1, "productMaterial": "ABS"},
    {"dimensions": {"length": 48, "width": 75.5, "height": 20, "volume": 200}, "productId": 2, "productMaterial": "ABS"}
  ],
  "mold": {
    "moldMaterial": "NAK80"
  }
}'
                      className="h-48"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <div className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  form.reset()
                  router.push("?") // Clear URL params
                }}
              >
                Clear
              </Button>
              <Button 
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                ) : null}
                Calculate
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ShowMoldPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const params = React.use(searchParams as unknown as Promise<typeof searchParams>)
  const moldParam = (params?.mold ?? null) as string | null
  const priceParam = (params?.price ?? null) as string | null
  
  const mold = moldParam ? (JSON.parse(moldParam) as Record<string, unknown>) : null
  const price = priceParam ? parseFloat(priceParam) : null

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <MoldCalculator />
      {mold && price && <Results mold={validators.validateMold(mold)} price={price} />}
    </div>
  )
}
