"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Settings } from "lucide-react";
import { Sidebar } from "@/components/store-sidebar";
import { API_URL } from "@/lib/inc/constants";

const sidebarNavItems = [
  {
    title: "대시보드",
    href: "/store",
    icon: LayoutDashboard,
  },
  {
    title: "예약 관리",
    href: "/store/reservations",
    icon: Calendar,
  },
  {
    title: "설정",
    href: "/store/settings",
    icon: Settings,
  },
];

interface StoreData {
  id: string;
  name: string;
  // 기타 점포 정보
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 클라이언트 사이드에서만 sessionStorage 접근
      if (typeof window === 'undefined') return;
      
      const token = sessionStorage.getItem("storeToken");
      const storeId = sessionStorage.getItem("storeId");

      // 로그인 페이지가 아닌데 토큰이 없으면 로그인 페이지로 리다이렉트
      if (!token || !storeId) {
        if (pathname !== "/store/login") {
          router.push("/store/login");
        }
        setIsLoading(false);
        return;
      }

      // 로그인 페이지인데 토큰이 있으면 대시보드로 리다이렉트
      if (pathname === "/store/login") {
        router.push("/store");
        setIsLoading(false);
        return;
      }

      // 점포 정보 가져오기
      try {
        const response = await fetch(`${API_URL}/shop_info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ shop_id: storeId }),
        });

        if (response.ok) {
          const jsonData = await response.json();
          setStoreData(jsonData.data);

          console.log(jsonData);
        } else {
          // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem("storeToken");
            sessionStorage.removeItem("storeId");
          }
          router.push("/store/login");
        }
      } catch (error) {
        console.error("Failed to fetch store data:", error);
        router.push("/store/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  // 로그인 페이지는 사이드바 없이 렌더링
  if (pathname === "/store/login") {
    return <>{children}</>;
  }

  // 점포 정보가 없어도 페이지는 렌더링
  return (
    <div className="flex min-h-screen">
      <Sidebar storeData={storeData || { id: "", name: "" }} />
      <main className="flex-1">{children}</main>
    </div>
  );
} 