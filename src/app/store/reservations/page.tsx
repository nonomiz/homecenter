"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Search, Filter, Calendar as CalendarIcon, Plus } from "lucide-react"
import Link from "next/link"

export default function ReservationsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd", { locale: ja })
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">予約管理</h2>
        <div className="flex items-center space-x-2">
          <Link href="/store/reservations/calendar">
            <Button>
              <CalendarIcon className="mr-2 h-4 w-4" />
              カレンダー表示
            </Button>
          </Link>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規予約
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本日の予約</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              前日比 +2
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今週の予約</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              前週比 +5
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の予約</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
            <p className="text-xs text-muted-foreground">
              前月比 +12
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">キャンセル率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              前月比 -0.5%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>予約一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-1">
                <Input placeholder="予約者名で検索" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="pending">保留中</SelectItem>
                  <SelectItem value="confirmed">確定</SelectItem>
                  <SelectItem value="cancelled">キャンセル</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>予約日時</TableHead>
                  <TableHead>予約者</TableHead>
                  <TableHead>人数</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{formatDate(new Date())} 14:00</TableCell>
                  <TableCell>山田太郎</TableCell>
                  <TableCell>2名</TableCell>
                  <TableCell>確定</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">詳細</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{formatDate(new Date())} 15:30</TableCell>
                  <TableCell>鈴木花子</TableCell>
                  <TableCell>4名</TableCell>
                  <TableCell>保留中</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">詳細</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>カレンダー</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={ja}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 