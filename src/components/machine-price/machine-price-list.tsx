'use client'

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { type MachinePriceSettingData } from "@/lib/validations/machine-price"

interface MachinePriceListProps {
  machines: MachinePriceSettingData[]
  onEdit: (machine: MachinePriceSettingData) => void
  onDelete: (id: number) => void
}

export function MachinePriceList({
  machines,
  onEdit,
  onDelete
}: MachinePriceListProps) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">机器吨位</TableHead>
            <TableHead className="text-center">注射量 (g)</TableHead>
            <TableHead className="text-center">模具宽度 (mm)</TableHead>
            <TableHead className="text-center">模具高度 (mm)</TableHead>
            <TableHead className="text-center">加工费/模 (元)</TableHead>
            <TableHead className="text-center">更新时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {machines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell className="text-center">{machine.id}</TableCell>
              <TableCell className="text-center">{machine.name}</TableCell>
              <TableCell className="text-center">{machine.injectionVolume}</TableCell>
              <TableCell className="text-center">{machine.moldWidth}</TableCell>
              <TableCell className="text-center">{machine.moldHeight}</TableCell>
              <TableCell className="text-center">{machine.machiningFee}</TableCell>
              <TableCell className="text-center">{formatDate(new Date(machine.updatedAt))}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(machine)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(machine.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}