"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 클라이언트 사이드에서만 sessionStorage 접근
    if (typeof window === 'undefined') return;
    
    // 로그인 페이지는 체크하지 않음
    if (pathname === "/admin/login") return;

    // 로그인 체크
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // 로그인 페이지일 경우 사이드바를 표시하지 않음
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 