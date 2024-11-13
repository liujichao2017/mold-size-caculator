'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { type MachinePriceFormValues, type MachinePriceSettingData, machinePriceFormSchema } from "@/lib/validations/machine-price"


interface MachinePriceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: MachinePriceSettingData | null
  onSubmit: (values: FormData) => Promise<{ success: boolean; error?: string }>
}

export function MachinePriceForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: MachinePriceFormProps) {
  const form = useForm<MachinePriceFormValues>({
    resolver: zodResolver(machinePriceFormSchema),
    defaultValues: {
      name: "",
      injectionVolume: 0,
      moldWidth: 0,
      moldHeight: 0,
      machiningFee: 0,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        name: initialData.name,
        injectionVolume: initialData.injectionVolume,
        moldWidth: initialData.moldWidth,
        moldHeight: initialData.moldHeight,
        machiningFee: initialData.machiningFee,
      })
    } else {
      form.reset({
        name: "",
        injectionVolume: 0,
        moldWidth: 0,
        moldHeight: 0,
        machiningFee: 0,
      })
    }
  }, [form, initialData])

  const handleSubmit = async (values: MachinePriceFormValues) => {
    const formData = new FormData()
    if (initialData?.id) {
      formData.append('id', String(initialData.id))
    }
    formData.append('name', values.name)
    formData.append('injectionVolume', String(values.injectionVolume))
    formData.append('moldWidth', String(values.moldWidth))
    formData.append('moldHeight', String(values.moldHeight))
    formData.append('machiningFee', String(values.machiningFee))

    const result = await onSubmit(formData)
    
    if (result.success) {
      toast.success(initialData ? '更新成功' : '保存成功')
      onOpenChange(false)
      form.reset()
    } else {
      toast.error(result.error ?? '操作失败')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-describedby="machine-price-form-description"
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? '编辑机器加工费' : '新增机器加工费'}
          </DialogTitle>
          <DialogDescription id="machine-price-form-description">
            {initialData ? '编辑机器加工费信息，所有字段都为必填。' : '添加新的机器加工费信息，所有字段都为必填。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>机器吨位</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="injectionVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>实际注射量 (g)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="number" 
                      step="1"
                      min="1"
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      // onChange={(e) => field.onChange(Number(e.target.value))}
                      // value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moldWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>模具容模宽度 (mm)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="number" 
                      step="1"
                      min="1"
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      // onChange={(e) => field.onChange(Number(e.target.value))}
                      // value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moldHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>模具容模高度 (mm)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="number" 
                      step="1"
                      min="1"
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      // onChange={(e) => field.onChange(Number(e.target.value))}
                      // value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="machiningFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>加工费/模(元)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="number" 
                      step="0.01"
                      min="0.01"
                      // onChange={(e) => field.onChange(Number(e.target.value))}
                      // value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                重置
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                保存
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}