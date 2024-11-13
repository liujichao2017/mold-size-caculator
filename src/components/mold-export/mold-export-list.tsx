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
import { formatDate } from "@/lib/utils"
import { type MoldExportPriceSettingData } from "@/lib/validations/mold-export-price"
import { Edit, Trash2 } from "lucide-react"

interface MoldExportListProps {
  exports: MoldExportPriceSettingData[]
  onEdit: (exportData: MoldExportPriceSettingData) => void
  onDelete: (id: number) => void
}

export function MoldExportList({
  exports,
  onEdit,
  onDelete
}: MoldExportListProps) {


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">最大重量(kg)</TableHead>
            <TableHead className="text-center">价格系数</TableHead>
            <TableHead className="text-center">更新时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exports.map((exportData) => (
            <TableRow key={exportData.id}>
              <TableCell className="text-center">{exportData.id}</TableCell>
              <TableCell className="text-center">{exportData.maxWeight}</TableCell>
              <TableCell className="text-center">{exportData.coefficient}</TableCell>
              <TableCell className="text-center">{formatDate(new Date(exportData.updatedAt))}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(exportData)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(exportData.id)}
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