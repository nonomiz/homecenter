"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, isToday, isBefore, setHours, setMinutes } from "date-fns"
import { ja } from "date-fns/locale"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { MessageDialog } from "@/components/ui/message-dialog"

interface ReservationForm {
  date: Date | undefined
  time: string
  name: string
  email: string
  phone: string
}

interface ReservedTime {
  res_time: string
  isReserved: boolean
}

export default function NewReservationPage() {
  const router = useRouter()
  const [form, setForm] = useState<ReservationForm>({
    date: new Date(),
    time: "",
    name: "",
    email: "",
    phone: "",
  })
  const [reservedTimes, setReservedTimes] = useState<ReservedTime[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [dialog, setDialog] = useState<{ open: boolean; message: string; onConfirm?: () => void }>({ open: false, message: "" })

  // 운영시간 09:00 ~ 20:00
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // 예약된 시간 가져오기
  const fetchReservedTimes = async (date: Date) => {
    setIsLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const response = await fetch(`http://192.168.0.116:3000/get_reservation_times`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include", // 쿠키 포함 필수
        body : JSON.stringify ({
          shop_id: storeId,
          res_date: formattedDate
        })
      });

      if (response.ok) {
        const data: any = await response.json()
        console.log(data)
        setReservedTimes(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch reserved times:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storeId = sessionStorage.getItem('storeId')
    console.log(storeId);
    setStoreId(storeId);
  }, [])

  // 날짜 선택 시 예약된 시간 가져오기
  useEffect(() => {
    if (form.date) {
      fetchReservedTimes(form.date)
    }
  }, [form.date])

  // 현재 시간 이후의 시간대만 선택 가능하도록 필터링
  const getAvailableTimeSlots = () => {
    if (!form.date) return timeSlots

    const now = new Date()
    const selectedDate = form.date

    // 기본적으로 모든 시간대를 사용
    let availableSlots = timeSlots

    // 오늘 날짜인 경우 현재 시간 이전 시간대 제외
    if (isToday(selectedDate)) {
      availableSlots = availableSlots.filter(time => {
        const [hours] = time.split(':').map(Number)
        const timeDate = setHours(setMinutes(selectedDate, 0), hours)
        return !isBefore(timeDate, now)
      })
    }

    // 예약된 시간대 제외
    availableSlots = availableSlots.filter(time => {
      const reservedTime = reservedTimes.find(rt => rt.res_time === time)
      return !reservedTime
    })

    return availableSlots
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeId) return

    try {
      console.log(form);

      const postData = {
        shop_id: storeId,
        res_date: form.date ? format(form.date, 'yyyy-MM-dd') : '',
        res_time: form.time,
        from_name: form.name,
        from_email: form.email,
        from_phone: form.phone
      };

      console.log(postData);

      const response = await fetch('http://192.168.0.116:3000/add_reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        setDialog({
          open: true,
          message: '予約されました。',
          onConfirm: () => router.push(`/store/reservations`)
        });
      } else {
        setDialog({
          open: true,
          message: '予約に失敗しました。もう一度お試しください。',
        });
      }
    } catch (error) {
      console.error("Failed to create reservation:", error)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/store/reservations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">新規予約</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>予約日時</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !form.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.date ? format(form.date, "yyyy-MM-dd", { locale: ja }) : "날짜 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(date) => {
                        setForm({ ...form, date, time: "" });
                        setCalendarOpen(false);
                      }}
                      className="rounded-md border"
                      locale={ja}
                      disabled={(date) => {
                        let result = false;
                        let today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) {
                          result = true;
                        }
                        return result;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-4">
                <div>
                  <Select
                    value={form.time}
                    onValueChange={(value) => setForm({ ...form, time: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "読み込み中..." : "時間を選択"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimeSlots().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.date && isToday(form.date) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      現在時刻より前の時間は選択できません
                    </p>
                  )}
                  {form.date && reservedTimes.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      予約済みの時間は選択できません
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>予約者情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">名前</label>
                <Input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="山田太郎"
                  required
                  minLength={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">メールアドレス</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">電話番号</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="090-1234-5678"
                  required
                  pattern="([0-9]{2}-[0-9]{4}-[0-9]{4}|[0-9]{3}-[0-9]{4}-[0-9]{4})"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Link href="/store/reservations">
            <Button variant="outline">キャンセル</Button>
          </Link>
          <Button type="submit">予約作成</Button>
        </div>
      </form>
      <MessageDialog
        open={dialog.open}
        onOpenChange={open => setDialog(d => ({ ...d, open }))}
        message={dialog.message}
        onConfirm={() => {
          setDialog(d => ({ ...d, open: false }))
          dialog.onConfirm?.()
        }}
      />
    </div>
  )
} 