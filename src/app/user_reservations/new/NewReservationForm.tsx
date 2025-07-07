"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageDialog } from "@/components/ui/message-dialog"
import { format, isToday, isBefore, setHours, setMinutes } from "date-fns"
import { ja } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

export default function NewReservationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
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
  const [messageDialog, setMessageDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  })

  // 운영시간 09:00 ~ 20:00
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // 예약된 시간 가져오기
  const fetchReservedTimes = async (date: Date) => {
    if (!storeId) return

    setIsLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const response = await fetch(`http://192.168.0.116:3000/get_reservation_times`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          shop_id: storeId,
          res_date: formattedDate
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data);
        setReservedTimes(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch reserved times:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storeId = searchParams.get('storeId')
    if (!storeId) {
      router.push('/')
      return
    }
    setStoreId(storeId)
  }, [searchParams, router])

  // 날짜 선택 시 예약된 시간 가져오기
  useEffect(() => {
    if (form.date && storeId) {
      fetchReservedTimes(form.date)
    }
  }, [form.date, storeId])

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
    console.log(reservedTimes);
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

      const jsonData = await response.json();
      console.log(jsonData);

      if (response.ok) {
        let message = `予約番号[${jsonData.data.reservation_id}]で予約されました。`

        // 성공 메시지 표시
        setMessageDialog({
          isOpen: true,
          title: '予約完了',
          message: message,
          type: 'success'
        })
      } else {
        // 에러 메시지 표시
        setMessageDialog({
          isOpen: true,
          title: '予約失敗',
          message: '予約に失敗しました。もう一度お試しください。',
          type: 'error'
        })
      }
    } catch (error) {
      console.error("Failed to create reservation:", error)
      setMessageDialog({
        isOpen: true,
        title: '予約失敗',
        message: '予約に失敗しました。もう一度お試しください。',
        type: 'error'
      })
    }
  }

  if (!storeId) {
    return null
  }

  return (
    <div className="flex-1 space-y-4 sm:p-8 p-2 sm:pt-6 pt-2">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Link href={`/`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">新規予約</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md md:max-w-3xl mx-auto">
        <Card className="w-full max-w-md md:max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>予約日時</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:p-4 p-2">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 min-w-0">
              <div>
                <Calendar
                  mode="single"
                  selected={form.date}
                  onSelect={(date) => {
                    setForm({ ...form, date, time: "" }) // 날짜가 변경되면 시간 선택 초기화
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
                    return (result);
                  }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">時間</label>
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

        <Card className="w-full max-w-md md:max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>予約者情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:p-4 p-2">
            <div className="grid gap-2 md:grid-cols-2">
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

        <div className="flex justify-end space-x-2 w-full max-w-md mx-auto">
          <Link href={`/`}>
            <Button variant="outline">キャンセル</Button>
          </Link>
          <Button type="submit">予約作成</Button>
        </div>
      </form>

      {/* MessageDialog */}
      <MessageDialog
        open={messageDialog.isOpen}
        onOpenChange={(open) => {
          setMessageDialog({ ...messageDialog, isOpen: open })
        }}
        title={messageDialog.title}
        message={messageDialog.message}
        onConfirm={() => {
          setMessageDialog({ ...messageDialog, isOpen: false })
          // 성공 시 메인 페이지로 이동
          if (messageDialog.type === 'success') {
            router.push('/')
          }
        }}
        confirmText="確認"
      />
    </div>
  )
} 