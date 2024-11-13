'use client'

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { deleteMoldExportPrice, getMoldExportPrices } from "@/actions/mold-export-price"
import { MoldExportList } from "@/components/mold-export/mold-export-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { type MoldExportPriceSettingData } from "@/lib/validations/mold-export-price"
import { MoldExportForm } from "@/components/mold-export/mold-export-form"
import { DeleteMoldExportDialog } from "@/components/mold-export/delete-mold-export-dialog"
import { createMoldExportPrice, updateMoldExportPrice } from "@/actions/mold-export-price"
export default function MoldExportPage() {
  const [exports, setExports] = useState<MoldExportPriceSettingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMoldExport, setSelectedMoldExport] = useState<MoldExportPriceSettingData | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [moldExportToDelete, setMoldExportToDelete] = useState<number | null>(null)

  const loadExports = useCallback(async () => {
    try {
      const data = await getMoldExportPrices()
      setExports(data)
    } catch (err) {
      console.error('Failed to load exports:', err)
      toast.error('加载数据失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadExports()
  }, [loadExports])

  const handleEdit = useCallback((moldExport: MoldExportPriceSettingData) => {
    setSelectedMoldExport(moldExport)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
    if (!open) {
      setSelectedMoldExport(null)
    }
  }, [])

  const handleSubmit = useCallback(async (formData: FormData) => {
    const result = selectedMoldExport 
      ? await updateMoldExportPrice(formData)
      : await createMoldExportPrice(formData)
    
    if (result.success) {
      await loadExports()
    }
    
    return result
  }, [selectedMoldExport, loadExports])

  const handleDelete = useCallback((id: number) => {
    setMoldExportToDelete(id)
    setDeleteOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!moldExportToDelete) return { success: false, error: '无效的ID' }

    const formData = new FormData()
    formData.append('id', String(moldExportToDelete))
    
    const result = await deleteMoldExportPrice(formData)
    
    if (result.success) {
      toast.success('删除成功')
      void loadExports()
    } else {
      toast.error(result.error ?? '删除失败')
    }
    
    return result
  }, [moldExportToDelete, loadExports])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">模具出口价格系数</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增模具出口价格系数
        </Button>
      </div>

      {isLoading ? (
        <MoldOperatingListSkeleton />
      ) : (
        <MoldExportList 
          exports={exports}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <MoldExportForm
        open={open}
        onOpenChange={handleOpenChange}
        initialData={selectedMoldExport}
        onSubmit={handleSubmit}
      />

      <DeleteMoldExportDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

function MoldOperatingListSkeleton() {
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