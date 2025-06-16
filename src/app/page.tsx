"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Clock, Star, Calendar, Users } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        {/* 検索セクション */}
        <section>
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
        </section>

        {/* プロモーションバナー */}
        <section>
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
        </section>

        {/* おすすめ店舗 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">おすすめ店舗</h2>
          <Tabs defaultValue="popular">
            <TabsList>
              <TabsTrigger value="popular">人気店舗</TabsTrigger>
              <TabsTrigger value="recent">最近の予約</TabsTrigger>
              <TabsTrigger value="rating">高評価</TabsTrigger>
              <TabsTrigger value="new">新規店舗</TabsTrigger>
            </TabsList>
            <TabsContent value="popular" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>サロン {i}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>東京都渋谷区</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>10:00 - 20:00</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.5</span>
                      </div>
                    </div>
                    <Button className="w-full">予約する</Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </section>

        {/* すぐに予約 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">すぐに予約</h2>
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
        </section>
      </div>
    </main>
  )
}
