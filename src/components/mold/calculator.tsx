'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userInputSchema, type UserInput } from "@/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { calculateMold, handleFileUpload as processFileUpload } from "@/actions"
import * as React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

export function MoldCalculator() {
    const router = useRouter()
    const form = useForm<UserInput>({
      resolver: zodResolver(userInputSchema),
      defaultValues: {
        jsonInput: "",
        email: "",
        phone: "",
      },
    })

    // const [uploadStatus, setUploadStatus] = React.useState<string>('')

    // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = event.target.files?.[0]
    //   if (!file) return

    //   const formData = new FormData()
    //   formData.append('file', file)

    //   try {
    //     setUploadStatus('Processing file...')
    //     const result = await processFileUpload(formData)
        
    //     if (!result.success) {
    //       throw new Error(result.error)
    //     }
    //     form.setValue('fileInput', result.filename);
    //     setUploadStatus(`File uploaded: ${result.filename}`)
    //   } catch (error) {
    //     setUploadStatus(error instanceof Error ? error.message : "Failed to process file")
    //     console.error(error)
    //   }
    // }
  
    const onSubmit = async (data: UserInput) => {
      try {
        console.log("UserInput data: ", data)

        const result = await calculateMold(data)
        if (!result.success) {
          form.setError("jsonInput", { 
            type: "manual",
            message: result.error?.toString() ?? "Failed to calculate mold"
          })
          return
        }
        
        const searchParams = new URLSearchParams()
        searchParams.set("productLayout", result.productLayout ?? "")
        searchParams.set("productPrice", result.productPrice ?? "")
        searchParams.set("mold", JSON.stringify(result.mold))
        searchParams.set("moldPrice", result.moldPrice?.toString() ?? "")
        searchParams.set("moldWeight", result.moldWeight?.toString() ?? "")
        router.push(`?${searchParams.toString()}`)
      } catch (err) {
        // form.setError("jsonInput", {
        //   type: "manual",
        //   message: "An unexpected error occurred"
        // })
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
              
            <div className="space-y-4">
              
              <FormField
                control={form.control}
                name="jsonInput"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your data here or upload a file..."
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Label className="font-bold">Contact Email</Label>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email"
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

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Label className="font-bold">Contact Phone</Label>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Enter your phone number"
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
              </div>
            </div>
              
              
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