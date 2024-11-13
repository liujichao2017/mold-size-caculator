'use client'

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { createMaterialPrice, getMaterialPrices, updateMaterialPrice, deleteMaterialPrice } from "@/actions/material-price"
import { MaterialPriceList } from "@/components/material-price/material-price-list"
import { MaterialPriceForm } from "@/components/material-price/material-price-form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteMaterialDialog } from "@/components/material-price/delete-material-dialog"
import { type MaterialPriceSettingData } from "@/lib/validations/material"
export default function MaterialPricePage() {
  const [materials, setMaterials] = useState<MaterialPriceSettingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialPriceSettingData | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null)

  const loadMaterials = useCallback(async () => {
    try {
      const data = await getMaterialPrices()
      setMaterials(data)
    } catch (error) {
      console.error('Failed to load materials:', error)
      toast.error('加载数据失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMaterials()
  }, [loadMaterials])

  const handleEdit = useCallback((material: MaterialPriceSettingData) => {
    setSelectedMaterial(material)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
    if (!open) {
      setSelectedMaterial(null)
    }
  }, [])

  const handleSubmit = useCallback(async (formData: FormData) => {
    const result = selectedMaterial 
      ? await updateMaterialPrice(formData)
      : await createMaterialPrice(formData)
    
    if (result.success) {
      await loadMaterials()
    }
    
    return result
  }, [selectedMaterial, loadMaterials])

  const handleDelete = useCallback((id: number) => {
    setMaterialToDelete(id)
    setDeleteOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!materialToDelete) return { success: false, error: '无效的ID' }

    const formData = new FormData()
    formData.append('id', String(materialToDelete))
    
    const result = await deleteMaterialPrice(formData)
    
    if (result.success) {
      toast.success('删除成功')
      await loadMaterials()
    } else {
      toast.error(result.error ?? '删除失败')
    }
    
    return result
  }, [materialToDelete, loadMaterials])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">原材料报价</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增原材料
        </Button>
      </div>

      {isLoading ? (
        <MaterialPriceListSkeleton />
      ) : (
        <MaterialPriceList 
          materials={materials}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <MaterialPriceForm
        open={open}
        onOpenChange={handleOpenChange}
        initialData={selectedMaterial}
        onSubmit={handleSubmit}
      />

      <DeleteMaterialDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

function MaterialPriceListSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        ))}
      </div>
    </div>
  )
}