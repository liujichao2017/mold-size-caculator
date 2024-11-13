'use client'

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { deleteMoldPriceDiffer, getMoldPriceDiffers } from "@/actions/mold-price-differ"
import { MoldPriceDifferList } from "@/components/mold-price-differ/mold-price-differ-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { type MoldPriceDifferSettingData } from "@/lib/validations/mold-price-differ"
import { MoldPriceDifferForm } from "@/components/mold-price-differ/mold-price-differ-form"
import { DeleteMoldPriceDifferDialog } from "@/components/mold-price-differ/delete-price-differ-dialog"
import { createMoldPriceDiffer, updateMoldPriceDiffer } from "@/actions/mold-price-differ"
export default function MoldPriceDifferPage() {
  const [differs, setDiffers] = useState<MoldPriceDifferSettingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMoldPriceDiffer, setSelectedMoldPriceDiffer] = useState<MoldPriceDifferSettingData | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [moldPriceDifferToDelete, setMoldPriceDifferToDelete] = useState<number | null>(null)

  const loadDiffers = useCallback(async () => {
    try {
      const data = await getMoldPriceDiffers()
      setDiffers(data)
    } catch (err) {
      console.error('Failed to load differs:', err)
      toast.error('加载数据失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDiffers()
  }, [loadDiffers])

  const handleEdit = useCallback((moldPriceDiffer: MoldPriceDifferSettingData) => {
    setSelectedMoldPriceDiffer(moldPriceDiffer)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
    if (!open) {
      setSelectedMoldPriceDiffer(null)
    }
  }, [])

  const handleSubmit = useCallback(async (formData: FormData) => {
    const result = selectedMoldPriceDiffer 
      ? await updateMoldPriceDiffer(formData)
      : await createMoldPriceDiffer(formData)
    
    if (result.success) {
      await loadDiffers()
    }
    
    return result
  }, [selectedMoldPriceDiffer, loadDiffers])

  const handleDelete = useCallback((id: number) => {
    setMoldPriceDifferToDelete(id)
    setDeleteOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!moldPriceDifferToDelete) return { success: false, error: '无效的ID' }

    const formData = new FormData()
    formData.append('id', String(moldPriceDifferToDelete))
    
    const result = await deleteMoldPriceDiffer(formData)
    
    if (result.success) {
      toast.success('删除成功')
      await loadDiffers()
    } else {
      toast.error(result.error ?? '删除失败')
    }
    
    return result
  }, [moldPriceDifferToDelete, loadDiffers])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">模具材料差价</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增差价设置
        </Button>
      </div>

      {isLoading ? (
        <MoldPriceDifferListSkeleton />
      ) : (
        <MoldPriceDifferList 
          differs={differs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <MoldPriceDifferForm
        open={open}
        onOpenChange={handleOpenChange}
        initialData={selectedMoldPriceDiffer}
        onSubmit={handleSubmit}
      />

      <DeleteMoldPriceDifferDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

function MoldPriceDifferListSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        ))}
      </div>
    </div>
  )
}