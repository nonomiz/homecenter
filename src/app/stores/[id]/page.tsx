"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { 
  MapPin,
  Clock,
  Star,
  Phone,
  Car,
  Info,
  Calendar as CalendarIcon,
  Users,
  MessageSquare
} from "lucide-react"

export default function StoreDetailPage({ params }: { params: { id: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* 점포 기본 정보 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-2xl">스타벅스 강남점</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                서울 강남구 테헤란로 123
              </div>
              <div className="flex items-center">
                <Phone className="mr-1 h-4 w-4" />
                02-123-4567
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-400" />
                4.8 (120)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative bg-muted rounded-lg">
              {/* 이미지 슬라이더 추가 예정 */}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>예약하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>날짜 선택</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="grid gap-2">
              <Label>시간 선택</Label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 11, 12, 13, 14, 15, 16, 17].map((hour) => (
                  <Button
                    key={hour}
                    variant="outline"
                    className="h-8"
                  >
                    {hour}:00
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>인원 선택</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="2"
                  className="h-8 w-16 text-center"
                />
                <Button variant="outline" size="icon" className="h-8 w-8">
                  +
                </Button>
              </div>
            </div>
            <Button className="w-full">예약하기</Button>
          </CardContent>
        </Card>
      </div>

      {/* 상세 정보 탭 */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">점포 정보</TabsTrigger>
              <TabsTrigger value="menu">메뉴</TabsTrigger>
              <TabsTrigger value="reviews">리뷰</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">영업 시간</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">월-금</span>
                        <span>07:00 - 22:00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">토-일</span>
                        <span>08:00 - 22:00</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">이용 안내</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>최소 1명, 최대 10명</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>예약 시간 1시간</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>주차 가능 (2시간 무료)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">점포 소개</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      강남 중심가에 위치한 스타벅스 강남점입니다. 넓은 공간과 쾌적한 환경에서
                      커피와 함께 여유로운 시간을 보내실 수 있습니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">시설 정보</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>와이파이</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>콘센트</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>화장실</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="menu" className="space-y-4">
              {/* 메뉴 목록 추가 예정 */}
              <p className="text-sm text-muted-foreground">메뉴 목록이 준비중입니다.</p>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              {/* 리뷰 목록 추가 예정 */}
              <p className="text-sm text-muted-foreground">리뷰 목록이 준비중입니다.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 