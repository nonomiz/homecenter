"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FindReservationPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 쿼리 파라미터로 값 전달
    const params = new URLSearchParams({ email, phone });
    router.push(`/find-reservation/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b py-4">
        <h1 className="text-center text-2xl font-semibold">予約検索</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">予約情報入力</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 text-sm font-medium">メール</label>
                <Input
                  type="email"
                  
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="aaa@exam.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">電話</label>
                <Input
                  type="tel"
                  
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="000-0000-0000"
                  autoComplete="tel"
                />
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit" className="w-full">検索</Button>
                <Link href="/" className="w-full">
                  <Button type="button" variant="outline" className="w-full">ホーム</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 