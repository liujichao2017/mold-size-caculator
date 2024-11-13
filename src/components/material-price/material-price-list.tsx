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
import { type MaterialPriceSettingData } from "@/lib/validations/material"

interface MaterialPriceListProps {
  materials: MaterialPriceSettingData[]
  onEdit: (material: MaterialPriceSettingData) => void
  onDelete: (id: number) => void
}

export function MaterialPriceList({
  materials,
  onEdit,
  onDelete
}: MaterialPriceListProps) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">原材料名称</TableHead>
            <TableHead className="text-center">密度 (g/mm³)</TableHead>
            <TableHead className="text-center">单价 (元/g)</TableHead>
            <TableHead className="text-center">更新时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell className="text-center">{material.id}</TableCell>
              <TableCell className="text-center">{material.name}</TableCell>
              <TableCell className="text-center">{Number(material.density).toFixed(6)}</TableCell>
              <TableCell className="text-center">{Number(material.price).toFixed(4)}</TableCell>
              <TableCell className="text-center">{formatDate(new Date(material.updatedAt))}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(material)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(material.id)}
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