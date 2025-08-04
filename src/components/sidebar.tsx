"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Store, Calendar, Users, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_ADMIN_URL } from "@/lib/inc/constants"

const sidebarNavItems = [
  // {
  //   title: "ダッシュボード",
  //   href: "/admin",
  //   icon: LayoutDashboard,
  // },
  {
    title: "店舗管理",
    href: "/admin/stores",
    icon: Store,
  },
  // {
  //   title: "予約管理",
  //   href: "/admin/reservations",
  //   icon: Calendar,
  // },
  // {
  //   title: "ユーザー管理",
  //   href: "/admin/users",
  //   icon: Users,
  // },
  {
    title: "設定",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    let adminId = sessionStorage.getItem("adminId");
    const res = await fetch(`${API_ADMIN_URL}/gclogout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 포함 필수!!!
      body: JSON.stringify({ adminId: adminId })
    });
    console.log(res);

    sessionStorage.removeItem("adminLoggedIn")
    sessionStorage.removeItem("adminToken")
    sessionStorage.removeItem("adminId")
    router.push("/admin/login")
  }

  return (
    <div className="hidden border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 lg:block lg:w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-900">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <span>管理者</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
            aria-label="로그아웃"
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