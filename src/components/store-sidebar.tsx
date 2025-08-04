"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, Settings, LogOut, BarChart2, Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_URL } from "@/lib/inc/constants"

interface StoreData {
  id: string
  name: string
  // 기타 점포 정보
}

interface StoreSidebarProps {
  storeData: StoreData
}

const sidebarNavItems = [
  // {
  //   title: "ダッシュボード",
  //   href: "/store",
  //   icon: LayoutDashboard,
  // },
  {
    title: "予約管理",
    href: "/store/reservations",
    icon: Calendar,
  },
  {
    title: "予約検索",
    href: "/store/reservations/search",
    icon: SearchIcon,
  },
  {
    title: "レポート",
    href: "/store/report",
    icon: BarChart2,
  },
  {
    title: "設定",
    href: "/store/settings",
    icon: Settings,
  },
  
  
]

export function Sidebar({ storeData }: StoreSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  console.log("storeData", storeData)

  const handleLogout = async () => {
    let storeId = sessionStorage.getItem("storeId");
    const res = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 포함 필수!!!
      body: JSON.stringify({ shop_id: storeId })
    });
    console.log(res);

    sessionStorage.removeItem("storeToken")
    sessionStorage.removeItem("storeId")
    router.push("/store/login")
  }

  return (
    <div className="hidden border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 lg:block lg:w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <span>{storeData.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2 bg-white dark:bg-zinc-900">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive
                      ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold"
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-400")} />
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