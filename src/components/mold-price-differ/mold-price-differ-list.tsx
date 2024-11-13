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
import { type MoldPriceDifferSettingData } from "@/lib/validations/mold-price-differ"
import { Edit, Trash2 } from "lucide-react"

interface MoldPriceDifferListProps {
  differs: MoldPriceDifferSettingData[]
  onEdit: (differ: MoldPriceDifferSettingData) => void
  onDelete: (id: number) => void
}

export function MoldPriceDifferList({
  differs,
  onEdit,
  onDelete
}: MoldPriceDifferListProps) {


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">模具材料名称</TableHead>
            <TableHead className="text-center">差价重量系数</TableHead>
            <TableHead className="text-center">更新时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {differs.map((differ) => (
            <TableRow key={differ.id}>
              <TableCell className="text-center">{differ.id}</TableCell>
              <TableCell className="text-center">{differ.name}</TableCell>
              <TableCell className="text-center">{differ.coefficient}</TableCell>
              <TableCell className="text-center">{formatDate(new Date(differ.updatedAt))}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(differ)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(differ.id)}
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