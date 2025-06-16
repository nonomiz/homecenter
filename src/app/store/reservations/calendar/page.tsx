"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <Link href="/store/reservations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">予約カレンダー</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>予約状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">予約状況</span>
                <Badge variant="outline">合計12件</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-sm font-medium">保留中</div>
                  <div className="text-2xl font-bold">5</div>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-sm font-medium">確定</div>
                  <div className="text-2xl font-bold">6</div>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-sm font-medium">キャンセル</div>
                  <div className="text-2xl font-bold">1</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">本日の予約</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">山田太郎</p>
                      <p className="text-sm text-muted-foreground">14:00 - 15:00</p>
                    </div>
                    <Badge>確定</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">鈴木花子</p>
                      <p className="text-sm text-muted-foreground">15:30 - 16:30</p>
                    </div>
                    <Badge variant="secondary">保留中</Badge>
                  </div>
                </div>
              </div>
            </div>
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