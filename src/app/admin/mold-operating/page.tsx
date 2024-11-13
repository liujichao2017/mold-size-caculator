'use client'

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { deleteMoldOperatingExpense, getMoldOperatingExpenses } from "@/actions/mold-operating-expense"
import { MoldOperatingList } from "@/components/mold-operating/mold-operating-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { type MoldOperatingExpenseSettingData } from "@/lib/validations/mold-operating-expense"
import { MoldOperatingForm } from "@/components/mold-operating/mold-operating-form"
import { DeleteMoldOperatingDialog } from "@/components/mold-operating/delete-mold-operating-dialog"
import { createMoldOperatingExpense, updateMoldOperatingExpense } from "@/actions/mold-operating-expense"
export default function MoldOperatingPage() {
  const [operatingSettings, setOperatingSettings] = useState<MoldOperatingExpenseSettingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMoldOperating, setSelectedMoldOperating] = useState<MoldOperatingExpenseSettingData | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [moldOperatingToDelete, setMoldOperatingToDelete] = useState<number | null>(null)

  const loadOperatings = useCallback(async () => {
    try {
      const data = await getMoldOperatingExpenses()
      setOperatingSettings(data)
    } catch (err) {
      console.error('Failed to load operatings:', err)
      toast.error('加载数据失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOperatings()
  }, [loadOperatings])

  const handleEdit = useCallback((moldOperating: MoldOperatingExpenseSettingData) => {
    setSelectedMoldOperating(moldOperating)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
    if (!open) {
      setSelectedMoldOperating(null)
    }
  }, [])

  const handleSubmit = useCallback(async (formData: FormData) => {
    const result = selectedMoldOperating 
      ? await updateMoldOperatingExpense(formData)
      : await createMoldOperatingExpense(formData)
    
    if (result.success) {
      await loadOperatings()
    }
    
    return result
  }, [selectedMoldOperating, loadOperatings])

  const handleDelete = useCallback((id: number) => {
    setMoldOperatingToDelete(id)
    setDeleteOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!moldOperatingToDelete) return { success: false, error: '无效的ID' }

    const formData = new FormData()
    formData.append('id', String(moldOperatingToDelete))
    
    const result = await deleteMoldOperatingExpense(formData)
    
    if (result.success) {
      toast.success('删除成功')
      void loadOperatings()
    } else {
      toast.error(result.error ?? '删除失败')
    }
    
    return result
  }, [moldOperatingToDelete, loadOperatings])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">模具运营费用</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增运营费用
        </Button>
      </div>

      {isLoading ? (
        <MoldOperatingListSkeleton />
      ) : (
        <MoldOperatingList 
          settings={operatingSettings}     
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <MoldOperatingForm
        open={open}
        onOpenChange={handleOpenChange}
        initialData={selectedMoldOperating}
        onSubmit={handleSubmit}
      />

      <DeleteMoldOperatingDialog
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