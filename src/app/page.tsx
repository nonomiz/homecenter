"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Clock, Star, Calendar, Users, Phone, Book } from "lucide-react"
import Link from "next/link"
import { API_URL } from "@/lib/inc/constants"

interface Store {
  shop_id: string
  name: string
  address: string
  phone1: string
  operating_hours?: {
    open: string
    close: string
  }
  rating?: number
}

export default function Home() {
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [storeNameFilter, setStoreNameFilter] = useState("")

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/shop_list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStores(data.data);
        setFilteredStores(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    await fetchStores();
    
    if (storeNameFilter.trim() === "") {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store => 
        store.name.toLowerCase().includes(storeNameFilter.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  const showShopList = () => {
    const useTest = true;

    if (filteredStores.length < 1) {
      return (<div>店舗リストがありません。</div>);
    }

    return filteredStores.map((store) => (
      // <Link key={store.shop_id} href={`/user_reservations/${store.shop_id}`} className="block">
      <div key={store.shop_id}>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>{store.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{store.address}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{store.phone1}</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.5</span>
              </div> */}
            </div>
            <div className="flex items-center justify-center">
              <Link href={`/user_reservations/${store.shop_id}`}>
                <Button>店舗情報</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      // </Link>
    ))
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 고정 영역 */}
      <div className="sticky top-0 z-10 p-3">
        <section>
          <Link href="/find-reservation">
            <Button variant="outline">
              <Book className="mr-2 h-4 w-4" />
              予約検索
            </Button>
          </Link>
        </section>
      </div>
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        {/* 나머지 콘텐츠 */}
        <main className="container mx-auto py-8 px-2 sm:px-4">
          <div className="space-y-8">
            {/* 検索セクション */}
            {/* <section>
              <h1 className="text-3xl font-bold mb-6">予約管理システム</h1>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input placeholder="店舗名またはキーワードで検索" />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="地域を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokyo">東京</SelectItem>
                    <SelectItem value="osaka">大阪</SelectItem>
                    <SelectItem value="kyoto">京都</SelectItem>
                    <SelectItem value="fukuoka">福岡</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  検索
                </Button>
              </div>
            </section> */}

            {/* プロモーションバナー */}
            {/* <section>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">新規登録キャンペーン</h2>
                      <p className="text-lg">初回予約が50%オフ！</p>
                    </div>
                    <Button variant="secondary">詳細を見る</Button>
                  </div>
                </CardContent>
              </Card>
            </section> */}

            {/* おすすめ店舗 */}
            <section>
              <h2 className="text-2xl font-bold mb-4"></h2>
              {/* ストア名検索フィルター */}
              <div className="flex items-center gap-4 mb-6">
                <Input
                  placeholder="店舗名で検索"
                  value={storeNameFilter}
                  onChange={(e) => setStoreNameFilter(e.target.value)}
                  className="max-w-xs"
                />
                <Button
                  variant="outline"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" />
                  検索
                </Button>

                
              </div>
              {/* <Tabs defaultValue="popular">
                <TabsList>
                  <TabsTrigger value="popular">人気店舗</TabsTrigger>
                  <TabsTrigger value="recent">最近の予約</TabsTrigger>
                  <TabsTrigger value="rating">高評価</TabsTrigger>
                  <TabsTrigger value="new">新規店舗</TabsTrigger>
                </TabsList>
                <TabsContent value="popular" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {showShopList()}
                  </div>
                {/* </TabsContent>
              </Tabs> */}
            </section>

            {/* すぐに予約 */}
            {/* <section>
              <h2 className="text-3xl font-bold mb-4">すぐに予約</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>今日</span>
                      </CardTitle>
                      <CardDescription>
                        {`${10 + i}:00 - ${11 + i}:00`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>残り{i}席</span>
                        </div>
                      </div>
                      <Button className="w-full">予約する</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section> */}
          </div>
        </main>
      </div>
    </div>
  )
}
