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
import { API_URL } from "@/lib/inc/constants"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReservationForm {
  date: Date | undefined
  time: string
  name: string
  email: string
  phone: string
  battery: string
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
    battery: "",
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
  const [calendarOpen, setCalendarOpen] = useState(false)

  // 운영시간 09:00 ~ 17:00
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // 예약된 시간 가져오기
  const fetchReservedTimes = async (date: Date) => {
    if (!storeId) return

    setIsLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const response = await fetch(`${API_URL}/get_reservation_times`, {
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
        // console.log(data);
        setReservedTimes(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch reserved times:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = searchParams.get('token')

    const fetchVerify = async () => {
      try {
        const response = await fetch(`${API_URL}/user_email_verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // 쿠키 포함 필수
          body: JSON.stringify({ token: token })
        });
        if (!response.ok) throw new Error("Failed to fetch shop details");
        const jsonBody = await response.json();
        // console.log("Shop Details:", jsonBody); // Handle the shop details as needed

        setStoreId(jsonBody.data.shop_id);
        setForm(prev => ({ ...prev, email: decodeURIComponent(jsonBody.data.email) }))
      } catch (error) {
        console.error("Error fetching shop details:", error);

        router.push('/')
      }
    }

    fetchVerify();
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
    // console.log(reservedTimes);
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
      // console.log(form);

      const postData = {
        shop_id: storeId,
        res_date: form.date ? format(form.date, 'yyyy-MM-dd') : '',
        res_time: form.time,
        from_name: form.name,
        from_email: form.email,
        from_phone: form.phone,
        battery: form.battery
      };

      // console.log(postData);

      const response = await fetch(`${API_URL}/add_reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(postData)
      })

      const jsonData = await response.json();
      // console.log(jsonData);

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
    <div className="flex-1 space-y-4 sm:pt-6 pt-2">
      {/* <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">

          <h2 className="text-3xl font-bold tracking-tight">新規予約</h2>
        </div>
      </div> */}

      <header className="sticky top-0 z-10 bg-background border-b py-4">
        <h1 className="text-center text-2xl font-semibold">新規予約</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md md:max-w-3xl mx-auto">
        <Card className="w-full max-w-md md:max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>予約日時</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:p-4 p-2">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 min-w-0">
              <div style={{display: "flex", justifyContent: "center"}}>
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
                        setForm({ ...form, date, time: "" }) // 날짜가 변경되면 시간 선택 초기화
                        setCalendarOpen(false)
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
                <div className="px-6 flex justify-center">
                  {/* <label className="text-sm font-medium">時間</label> */}
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
                  
                </div>
              </div>
              {/* <div>
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
              </div> */}
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
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">バッテリ情報</label>
                <Input
                  type="text"
                  value={form.battery}
                  onChange={(e) => setForm({ ...form, battery: e.target.value })}
                  placeholder="12V 30A"
                  required
                  minLength={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="item-centers space-x-2 p-4 w-full max-w-md mx-auto">
          <Button className="w-full space-y-2 mb-2" type="submit">予約確定</Button>
          <Link href={`/`}>
            <Button className="w-full space-y-2" variant="outline">ホーム</Button>
          </Link>
          
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