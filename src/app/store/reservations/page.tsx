"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { ko } from "date-fns/locale"
import { format } from "date-fns"

export default function StoreReservationsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">예약 관리</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            필터
          </Button>
          <Button>새 예약</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>예약 목록</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="예약 검색..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="confirmed">확정</SelectItem>
                  <SelectItem value="cancelled">취소</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>예약번호</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead>시간</TableHead>
                  <TableHead>인원</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>#12345</TableCell>
                  <TableCell>홍길동</TableCell>
                  <TableCell>{formatDate(new Date("2024-03-20"))}</TableCell>
                  <TableCell>14:00</TableCell>
                  <TableCell>2명</TableCell>
                  <TableCell>
                    <Badge variant="secondary">대기중</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">확정</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#12346</TableCell>
                  <TableCell>김철수</TableCell>
                  <TableCell>{formatDate(new Date("2024-03-20"))}</TableCell>
                  <TableCell>15:00</TableCell>
                  <TableCell>4명</TableCell>
                  <TableCell>
                    <Badge>확정</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">취소</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>예약 캘린더</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={ko}
              formatters={{
                formatDay: (date) => date.getDate().toString(),
                formatWeekdayName: (date) => {
                  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
                  return weekdays[date.getDay()]
                },
                formatMonthCaption: (date) => {
                  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
                  return `${date.getFullYear()}년 ${months[date.getMonth()]}`
                }
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">예약 현황</span>
                <Badge variant="outline">전체 12건</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-sm font-medium">대기중</div>
                  <div className="text-2xl font-bold">5</div>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-sm font-medium">확정</div>
                  <div className="text-2xl font-bold">6</div>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-sm font-medium">취소</div>
                  <div className="text-2xl font-bold">1</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 