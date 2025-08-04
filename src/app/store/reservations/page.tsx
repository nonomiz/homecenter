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
import { Search, Filter, Calendar as CalendarIcon, Plus, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { API_URL } from "@/lib/inc/constants"

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
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [reservations, setReservations] = useState<ReservationHistoryItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [phoneFilter, setPhoneFilter] = useState<string>("");
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
    // const formattedDate = format(new Date(), 'yyyy-MM-dd')
    let formattedDate;
    if (date) {
      formattedDate = format(date, 'yyyy-MM-dd')
    }
    
    const storeId = sessionStorage.getItem('storeId');
    let sendData: any = {
      shop_id: storeId,
    };
    if (formattedDate) {
      sendData["res_date"] = formattedDate;
    }

    const response = await fetch(`${API_URL}/mypage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify(sendData)
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
      const response = await fetch(`${API_URL}/work_complete_reservation`, {
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
      const response = await fetch(`${API_URL}/cancel_reservation`, {
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
    refreshReservationList();
  }, [date])

  // 오늘 예약 수 계산
  const todayReservationsCount = reservations ? reservations.length : 0;

  // 취소된 예약 수 계산 (res_status가 9인 경우)
  const cancelledReservations = reservations ? reservations.filter(res => 
    res.res_status === 9
  ) : [];
  const cancellationRate = reservations && reservations.length > 0 
    ? ((cancelledReservations.length / reservations.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight"></h2>
        <div className="flex items-center space-x-2">
          {/* <Link href="/store/reservations/calendar">
            <Button>
              <CalendarIcon className="mr-2 h-4 w-4" />
              カレンダー表示
            </Button>
          </Link> */}
          <Link href="/store/reservations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規予約
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本日の予約</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayReservationsCount}</div>
            <p className="text-xs text-muted-foreground">
              前日比 +2
            </p>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今週の予約</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              前週比 +5
            </p>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の予約</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
            <p className="text-xs text-muted-foreground">
              前月比 +12
            </p>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">キャンセル率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancellationRate}%</div>
            <p className="text-xs text-muted-foreground">
              前月比 -0.5%
            </p>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>予約一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Popover
                  open={calendarOpen}
                  onOpenChange={setCalendarOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy-MM-dd", { locale: ja }) : "日付選択"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selected) => {
                        setDate(selected)
                        setCalendarOpen(false)
                      }}
                      locale={ja}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  placeholder="予約者名で検索"
                  value={nameFilter}
                  onChange={e => setNameFilter(e.target.value)}
                  className="w-[180px]"
                />
                <Input
                  placeholder="メールで検索"
                  className="w-[180px]"
                  value={emailFilter}
                  onChange={e => setEmailFilter(e.target.value)}
                />
                <Input
                  placeholder="電話で検索"
                  className="w-[180px]"
                  value={phoneFilter}
                  onChange={e => setPhoneFilter(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="0">予約中</SelectItem>
                    <SelectItem value="1">完了</SelectItem>
                    <SelectItem value="9">キャンセル</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => refreshReservationList()}>
                  <RefreshCcw className="mr-2 h-4 w-4"/>
                  更新
                </Button>
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日時</TableHead>
                  <TableHead>時間</TableHead>
                  <TableHead>予約者名</TableHead>
                  <TableHead>メール</TableHead>
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
                        if (!reservation.from_name.includes(nameFilter)) {
                          return false;
                        }
                      }
                      if (nameFilter && !reservation.from_name) {
                        return false;
                      }
                      // email filter
                      if (emailFilter && reservation.from_email) {
                        if (!reservation.from_email.includes(emailFilter)) {
                          return false;
                        }
                      }
                      if (emailFilter && !reservation.from_email) {
                        return false;
                      }
                      // phone filter
                      if (phoneFilter && reservation.from_phone) {
                        if (!reservation.from_phone.includes(phoneFilter)) {
                          return false;
                        }
                      }
                      if (phoneFilter && !reservation.from_phone) {
                        return false;
                      }
                      return true;
                    })
                    .map((reservation) => (
                      <TableRow key={reservation.res_no}>
                        <TableCell>
                          {format(reservation.res_date, 'yyyy-MM-dd')}
                        </TableCell>
                        <TableCell>
                          {reservation.res_time}
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
            </div>
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
            <DialogTitle>作業完了</DialogTitle>
            <DialogDescription>
              
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">作業を完了しますか？</div>
          <div className="flex justify-evenly gap-4 mt-6">
            <Button onClick={handleConfirmComplete}>
              確認
            </Button>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              キャンセル
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="w-[400px] max-w-[90vw]" onInteractOutside={e => e.preventDefault()}>
          <DialogHeader className="text-center">
            <DialogTitle>予約キャンセル</DialogTitle>
            <DialogDescription>
              
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">予約をキャンセルしますか？</div>
          <div className="flex justify-evenly gap-4 mt-6">
            <Button onClick={handleConfirmCancel}>
              確認
            </Button>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              キャンセル
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 