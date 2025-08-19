"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/lib/inc/constants";

interface StoreDetail {
  shop_id: string;
  name: string;
  address: string;
  phone1: string;
  charger?: string;
  descriptions?: string;
}

export default function StoreDetailPage() {
  const router = useRouter();
  const { storeId } = useParams();
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      const response = await fetch(`${API_URL}/shop_info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id: storeId }),
      });
      if (response.ok) {
        const jsonData = await response.json();

        // console.log(jsonData.data);
        setStore(jsonData.data);
      }
      setLoading(false);
    };
    if (storeId) fetchStore();
  }, [storeId]);

  if (loading || !store) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-2 sm:px-4">
      <Card className="max-w-xl mx-auto p-0">
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-center">{store.name}</h1>
        </div>
        <CardContent className="py-8 px-8">
          <div className="mb-8">
            <div className="mb-6">
              <div className="text-lg font-medium mb-2">住所</div>
              <div className="text-base mb-6">{store.address}</div>
              <div className="text-lg font-medium mb-2">電話番号</div>
              <div className="text-base mb-6">{store.phone1}</div>
              <div className="text-lg font-medium mb-2">充電器</div>
              <div className="text-base mb-6">{store.charger}</div>
            </div>
            <div className="text-lg font-medium mb-2">店舗説明</div>
            <div className="border p-4 min-h-[120px] mb-8">
              <div className="text-base">{store.descriptions || ""}</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-evenly mt-12">
            <Button className="w-full md:w-40" onClick={() => router.push(`/user_reservations/email-verification?storeId=${store.shop_id}`)}>
              新規予約
            </Button>
            <Button className="w-full md:w-40" variant="outline" onClick={() => router.push(`/`)}>
              ホーム
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 