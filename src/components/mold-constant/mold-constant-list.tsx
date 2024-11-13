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
import { type MoldConstantSettingData } from "@/lib/validations/mold-constant"
import { Edit, Trash2 } from "lucide-react"

interface MoldConstantListProps {
  constantDatas: MoldConstantSettingData[]
  onEdit: (constant: MoldConstantSettingData) => void
  // onDelete: (id: number) => void
}

export function MoldConstantList({
  constantDatas,
  onEdit,
  // onDelete
}: MoldConstantListProps) {


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">名称</TableHead>
            <TableHead className="text-center">值</TableHead>
            <TableHead className="text-center">更新时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {constantDatas.map((constantItem) => (
            <TableRow key={constantItem.id}>
              <TableCell className="text-center">{constantItem.id}</TableCell>
              <TableCell className="text-center">{constantItem.constantDescription}</TableCell>
              <TableCell className="text-center">{constantItem.constantValue}</TableCell>
              <TableCell className="text-center">{formatDate(new Date(constantItem.updatedAt))}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(constantItem)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(constantItem.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}