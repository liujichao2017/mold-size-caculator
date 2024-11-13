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
import { type MoldOperatingExpenseSettingData } from "@/lib/validations/mold-operating-expense"
import { Edit, Trash2 } from "lucide-react"

interface MoldOperatingListProps {
  settings: MoldOperatingExpenseSettingData[]
  onEdit: (setting: MoldOperatingExpenseSettingData) => void
  onDelete: (id: number) => void
}

export function MoldOperatingList({
  settings,
  onEdit,
  onDelete
}: MoldOperatingListProps) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">最大重量(kg) </TableHead>
            <TableHead className="text-center">运营费用(元)</TableHead>
            <TableHead className="text-center">更新时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell className="text-center">{setting.id}</TableCell>
              <TableCell className="text-center">{setting.maxWeight}</TableCell>
              <TableCell className="text-center">{setting.price}</TableCell>
              <TableCell className="text-center">{formatDate(new Date(setting.updatedAt))}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(setting)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(setting.id)}
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