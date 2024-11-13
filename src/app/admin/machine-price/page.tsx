'use client'

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { createMachinePrice, getMachinePrices, updateMachinePrice, deleteMachinePrice } from "@/actions/machine-price"
import { MachinePriceList } from "@/components/machine-price/machine-price-list"
import { MachinePriceForm } from "@/components/machine-price/machine-price-form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteMachineDialog } from "@/components/machine-price/delete-machine-dialog"
import { type MachinePriceSettingData } from "@/lib/validations/machine-price"
export default function MachinePricePage() {
  const [machines, setMachines] = useState<MachinePriceSettingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<MachinePriceSettingData | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [machineToDelete, setMachineToDelete] = useState<number | null>(null)

  const loadMachines = useCallback(async () => {
    try {
      const data = await getMachinePrices()
      setMachines(data)
    } catch (error) {
      console.error('Failed to load machines:', error)
      toast.error('加载数据失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMachines()
  }, [loadMachines])

  const handleEdit = useCallback((machine: MachinePriceSettingData) => {
    setSelectedMachine(machine)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
    if (!open) {
      setSelectedMachine(null)
    }
  }, [])

  const handleSubmit = useCallback(async (formData: FormData) => {
    const result = selectedMachine 
      ? await updateMachinePrice(formData)
      : await createMachinePrice(formData)
    
    if (result.success) {
      await loadMachines()
    }
    
    return result
  }, [selectedMachine, loadMachines])

  const handleDelete = useCallback((id: number) => {
    setMachineToDelete(id)
    setDeleteOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!machineToDelete) return { success: false, error: '无效的ID' }

    const formData = new FormData()
    formData.append('id', String(machineToDelete))
    
    const result = await deleteMachinePrice(formData)
    
    if (result.success) {
      toast.success('删除成功')
      await loadMachines()
    } else {
      toast.error(result.error ?? '删除失败')
    }
    
    return result
  }, [machineToDelete, loadMachines])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">机器加工费</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增机器加工费
        </Button>
      </div>

      {isLoading ? (
        <MachinePriceListSkeleton />
      ) : (
        <MachinePriceList 
          machines={machines}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <MachinePriceForm
        open={open}
        onOpenChange={handleOpenChange}
        initialData={selectedMachine}
        onSubmit={handleSubmit}
      />

      <DeleteMachineDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

function MachinePriceListSkeleton() {
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