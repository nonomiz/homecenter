"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, MapPin, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* 검색 섹션 */}
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">예약 관리 시스템</h1>
        <p className="text-lg text-muted-foreground">
          원하는 점포를 검색하고 예약하세요
        </p>
        <div className="flex w-full max-w-2xl items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="지역, 점포명, 키워드로 검색..." className="pl-8" />
          </div>
          <Button>검색</Button>
        </div>
      </div>

      {/* 추천 점포 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">추천 점포</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>스타벅스 강남점</span>
                <Badge variant="secondary">인기</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  서울 강남구 테헤란로 123
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  07:00 - 22:00
                </div>
                <div className="flex items-center text-sm">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  4.8 (120)
                </div>
                <Button className="w-full">예약하기</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>스타벅스 홍대점</span>
                <Badge variant="secondary">신규</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  서울 마포구 홍대로 456
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  08:00 - 22:00
                </div>
                <div className="flex items-center text-sm">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  4.5 (45)
                </div>
                <Button className="w-full">예약하기</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>스타벅스 명동점</span>
                <Badge variant="secondary">추천</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  서울 중구 명동길 789
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  07:00 - 22:00
                </div>
                <div className="flex items-center text-sm">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  4.7 (89)
                </div>
                <Button className="w-full">예약하기</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 빠른 예약 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">빠른 예약</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">오늘 14:00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">스타벅스 강남점</p>
              <p className="text-sm text-muted-foreground">2자리 남음</p>
              <Button className="mt-2 w-full">예약하기</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">오늘 15:00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">스타벅스 홍대점</p>
              <p className="text-sm text-muted-foreground">4자리 남음</p>
              <Button className="mt-2 w-full">예약하기</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">오늘 16:00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">스타벅스 명동점</p>
              <p className="text-sm text-muted-foreground">3자리 남음</p>
              <Button className="mt-2 w-full">예약하기</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">오늘 17:00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">스타벅스 강남점</p>
              <p className="text-sm text-muted-foreground">5자리 남음</p>
              <Button className="mt-2 w-full">예약하기</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
