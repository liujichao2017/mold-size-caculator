'use client'

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { getMoldConstants } from "@/actions/mold-constant"
import { MoldConstantList } from "@/components/mold-constant/mold-constant-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { type MoldConstantSettingData } from "@/lib/validations/mold-constant"
import { MoldConstantForm } from "@/components/mold-constant/mold-constant-form"
import { updateMoldConstant } from "@/actions/mold-constant"
export default function MoldConstantPage() {
  const [constants, setConstants] = useState<MoldConstantSettingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMoldConstant, setSelectedMoldConstant] = useState<MoldConstantSettingData | null>(null)
  // const [deleteOpen, setDeleteOpen] = useState(false)
  // const [moldConstantToDelete, setMoldConstantToDelete] = useState<number | null>(null)

  const loadConstants = useCallback(async () => {
    try {
      const data = await getMoldConstants()
      setConstants(data)
    } catch (err) {
      console.error('Failed to load constants:', err)
      toast.error('加载数据失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadConstants()
  }, [loadConstants])

  const handleEdit = useCallback((moldConstant: MoldConstantSettingData) => {
    setSelectedMoldConstant(moldConstant)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
    if (!open) {
      setSelectedMoldConstant(null)
    }
  }, [])

  const handleSubmit = useCallback(async (formData: FormData) => {
    const result = await updateMoldConstant(formData);
    
    if (result.success) {
      await loadConstants()
    }
    
    return result
  }, [loadConstants])

  // const handleDelete = useCallback((id: number) => {
  //   setMoldConstantToDelete(id)
  //   setDeleteOpen(true)
  // }, [])

  // const handleConfirmDelete = useCallback(async () => {
  //   if (!moldConstantToDelete) return { success: false, error: '无效的ID' }

  //   const formData = new FormData()
  //   formData.append('id', String(moldConstantToDelete))
    
  //   const result = await deleteMoldConstant(formData)
    
  //   if (result.success) {
  //     toast.success('删除成功')
  //     void loadExports()
  //   } else {
  //     toast.error(result.error ?? '删除失败')
  //   }
    
  //   return result
  // }, [moldConstantToDelete, loadConstants])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">其他常量</h1>
        {/* <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增差价设置
        </Button> */}
      </div>

      {isLoading ? (
        <MoldConstantListSkeleton />
      ) : (
        <MoldConstantList 
          constantDatas={constants}
          onEdit={handleEdit}
          // onDelete={handleDelete}
        />
      )}

      <MoldConstantForm
        open={open}
        onOpenChange={handleOpenChange}
        initialData={selectedMoldConstant}
        onSubmit={handleSubmit}
      />

      {/* <DeleteMoldConstantDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      /> */}
    </div>
  )
}

function MoldConstantListSkeleton() {
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