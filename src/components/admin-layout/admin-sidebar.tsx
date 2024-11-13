"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Settings, Database, Scale, Calculator, DollarSign, Percent, Constants } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const sidebarNavItems = [
  {
    title: "原材料价格",
    href: "/admin/material-price",
    icon: Database,
  },
  {
    title: "机器加工费",
    href: "/admin/machine-price",
    icon: Settings,
  },
  {
    title: "模具材料差价",
    href: "/admin/mold-price-differ",
    icon: Scale,
  },
  {
    title: "模具运营费用",
    href: "/admin/mold-operating",
    icon: DollarSign,
  },
  {
    title: "模具出口价格系数",
    href: "/admin/mold-export",
    icon: Percent,
  },
  {
    title: "模具报价其他常数",
    href: "/admin/mold-constant",
    icon: Calculator,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="flex h-[60px] items-center border-b px-4">
        <span className={cn("font-bold", isCollapsed && "hidden")}>
          管理后台
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4", isCollapsed && "rotate-180")} />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {sidebarNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href && "bg-accent text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}