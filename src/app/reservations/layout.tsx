"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar, Clock, History } from "lucide-react";

const sidebarNavItems = [
  {
    title: "예약하기",
    href: "/reservations",
    icon: Calendar,
  },
  {
    title: "예약 현황",
    href: "/reservations/status",
    icon: Clock,
  },
  {
    title: "예약 내역",
    href: "/reservations/history",
    icon: History,
  },
];

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <div className="hidden border-r bg-gray-100/40 lg:block lg:w-64">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/reservations" className="flex items-center gap-2 font-semibold">
              <span>예약</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
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
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
} 