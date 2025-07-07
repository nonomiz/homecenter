"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, isSameDay, parseISO } from "date-fns"
import { ja } from "date-fns/locale"
import { Search, Filter, Calendar as CalendarIcon, Plus } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ReservationHistoryItem {
  res_no?: any;
  res_date?: any;
  res_time?: any;
  from_name?: any;
  from_email?: any;
  from_phone?: any;
  res_status?: any;
}

export default function ReservationsPage() {
  const [form, setForm] = useState({ email: "", phone: "", name: "" })
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [reservations, setReservations] = useState<ReservationHistoryItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedResNo, setSelectedResNo] = useState<any>(null);
  const [dialogType, setDialogType] = useState<'complete' | 'cancel'>('complete');

  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd", { locale: ja })
  }

  // 예약 상태를 한글로 변환하는 함수
  const getStatusText = (status: any) => {
    switch (status) {
      case 1:
        return '完了';
      case 9:
        return 'キャンセル';
      case 0:
        return '予約中';
      default:
        return status || '대기';
    }
  }

  // 예약 목록 새로고침 함수
  const refreshReservationList = async () => {
    const formattedDate = format(new Date(), 'yyyy-MM-dd')
    const storeId = sessionStorage.getItem('storeId');
    const response = await fetch(`http://192.168.0.116:3000/mypage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({
        shop_id: storeId,
        //res_date: formattedDate
      })
    });
    const jsonBody = await response.json();
    setReservations(jsonBody.data);
  };

  // 예약 완료 확인 다이얼로그 열기
  const openCompleteConfirmDialog = (resNo: any) => {
    setSelectedResNo(resNo);
    setDialogType('complete');
    setConfirmDialogOpen(true);
  };

  // 예약 취소 확인 다이얼로그 열기
  const openCancelConfirmDialog = (resNo: any) => {
    setSelectedResNo(resNo);
    setDialogType('cancel');
    setCancelDialogOpen(true);
  };

  // 예약 완료 처리
  const handleCompleteReservation = async (resNo: any) => {
    try {
      const response = await fetch(`http://192.168.0.116:3000/work_complete_reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          res_no: resNo
        })
      });

      if (response.ok) {
        // 예약 목록 새로고침
        await refreshReservationList();
      }
    } catch (error) {
      console.error('예약 완료 처리 실패:', error);
    }
  };

  // 확인 다이얼로그에서 확인 버튼 클릭 시
  const handleConfirmComplete = async () => {
    if (selectedResNo) {
      await handleCompleteReservation(selectedResNo);
      setConfirmDialogOpen(false);
      setSelectedResNo(null);
    }
  };

  // 취소 다이얼로그에서 확인 버튼 클릭 시
  const handleConfirmCancel = async () => {
    if (selectedResNo) {
      await handleCancelReservation(selectedResNo);
      setCancelDialogOpen(false);
      setSelectedResNo(null);
    }
  };

  // 예약 취소 처리
  const handleCancelReservation = async (resNo: any) => {
    try {
      const response = await fetch(`http://192.168.0.116:3000/cancel_reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          res_no: resNo
        })
      });

      if (response.ok) {
        // 예약 목록 새로고침
        await refreshReservationList();
      }
    } catch (error) {
      console.error('예약 취소 처리 실패:', error);
    }
  };

  useEffect(() => {
    // refreshReservationList();
  }, [])

  // 오늘 예약 수 계산
  const todayReservationsCount = reservations ? reservations.length : 0;

  // 취소된 예약 수 계산 (res_status가 9인 경우)
  const cancelledReservations = reservations ? reservations.filter(res => 
    res.res_status === 9
  ) : [];
  const cancellationRate = reservations && reservations.length > 0 
    ? ((cancelledReservations.length / reservations.length) * 100).toFixed(1)
    : '0.0';

  // 실제 검색 로직은 추후 구현
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = format(new Date(), 'yyyy-MM-dd')
    const storeId = sessionStorage.getItem('storeId');
    const response = await fetch(`http://192.168.0.116:3000/search_reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({
        shop_id: storeId,
        res_date: formattedDate,
        phone: form.phone,
        name: form.name,
        email: form.email
      })
    });
    const jsonBody = await response.json();
    console.log(jsonBody);
    // e.preventDefault()
    setReservations(jsonBody.data);

  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>予約検索</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end mb-6">
                  <div className="flex items-center gap-2">
                    <label className="w-24 text-right font-medium" htmlFor="search-email">EMail</label>
                    <Input id="search-email" className="bg-yellow-400 text-white font-semibold" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-24 text-right font-medium" htmlFor="search-phone">電話</label>
                    <Input id="search-phone" className="bg-yellow-400 text-white font-semibold" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-24 text-right font-medium" htmlFor="search-name">予約者</label>
                    <Input id="search-name" className="bg-yellow-400 text-white font-semibold" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <Button type="submit" className="h-10 px-8">検索</Button>
                </form>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>予約番号</TableHead>
                  <TableHead>予約日時</TableHead>
                  <TableHead>予約者</TableHead>
                  <TableHead>EMail</TableHead>
                  <TableHead>電話</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations && reservations.length > 0 ? (
                  reservations
                    .filter(reservation => {
                      // 날짜 필터
                      if (date && reservation.res_date) {
                        const resDate = typeof reservation.res_date === 'string' ? parseISO(reservation.res_date) : reservation.res_date;
                        if (!isSameDay(resDate, date)) {
                          return false;
                        }
                      }
                      // status filter
                      if (statusFilter !== "all" && String(reservation.res_status) !== statusFilter) {
                        return false;
                      }
                      // name filter
                      if (nameFilter && reservation.from_name) {
                        return reservation.from_name.includes(nameFilter);
                      }
                      if (nameFilter && !reservation.from_name) {
                        return false;
                      }
                      return true;
                    })
                    .map((reservation) => (
                      <TableRow key={reservation.res_no}>
                        <TableCell>
                          #{reservation.res_no}
                        </TableCell>
                        <TableCell>
                          {format(reservation.res_date, 'yyyy-MM-dd')} {reservation.res_time}
                        </TableCell>
                        <TableCell>{reservation.from_name}</TableCell>
                        <TableCell>{reservation.from_email}</TableCell>
                        <TableCell>{reservation.from_phone}</TableCell>
                        <TableCell>{getStatusText(reservation.res_status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openCompleteConfirmDialog(reservation.res_no)}
                              disabled={reservation.res_status !== 0}
                            >
                              完了
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openCancelConfirmDialog(reservation.res_no)}
                              disabled={reservation.res_status !== 0}
                            >
                              キャンセル
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      予約データがありません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* <Card className="col-span-3">
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
        </Card> */}
      </div>

      {/* 완료 확인 다이얼로그 */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="w-[400px] max-w-[90vw]" onInteractOutside={e => e.preventDefault()}>
          <DialogHeader className="text-center">
            <DialogTitle>確認</DialogTitle>
            <DialogDescription>
              作業を完了しますか？
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-evenly gap-4 mt-6">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirmComplete}>
              確認
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="w-[400px] max-w-[90vw]" onInteractOutside={e => e.preventDefault()}>
          <DialogHeader className="text-center">
            <DialogTitle>確認</DialogTitle>
            <DialogDescription>
              予約をキャンセルしますか？
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-evenly gap-4 mt-6">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirmCancel}>
              確認
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 