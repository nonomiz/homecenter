"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Store, Calendar, Users, Settings } from "lucide-react"

const sidebarNavItems = [
  {
    title: "ダッシュボード",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "店舗管理",
    href: "/admin/stores",
    icon: Store,
  },
  {
    title: "予約管理",
    href: "/admin/reservations",
    icon: Calendar,
  },
  {
    title: "ユーザー管理",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "設定",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block lg:w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span>管理者</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
} 