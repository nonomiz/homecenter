"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, isToday, isBefore, setHours, setMinutes } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/inc/constants";

interface ReservationHistoryItem {
  res_no?: any;
  res_date?: any;
  res_time?: any;
  from_name?: any;
  from_email?: any;
  from_phone?: any;
  res_status?: any;
  shopName?: any;
  shopPhone?: any;
}

const sampleReservations: ReservationHistoryItem[] = [
  {
    res_no: "1234",
    from_name: "タロウ",
    res_date: "2025-06-30",
    res_time: "12:00",
    shopName: "店舗１",
    shopPhone: "03-1234-5678"
  },
  {
    res_no: "1235",
    from_name: "タロウ",
    res_date: "2025-06-30",
    res_time: "12:00",
    shopName: "店舗２",
    shopPhone: "090-1234-5678"
  },
];

export default function ResultList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");

  const [reservations, setReservations] = useState<ReservationHistoryItem[]>([]);

  const fetchSearchReservations = async () => {
    let today = new Date();
    const response = await fetch(`${API_URL}/search_reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({
        email : email,
        phone : phone,
        res_date: format(today, 'yyyy-MM-dd')
      })
    });

    if (response.ok) {
      const jsonBody = await response.json();
      console.log(jsonBody);
      
      setReservations(jsonBody.data);
    }
    else {
      console.log("結果がありません。")
    }
  };

  useEffect(() => {
    fetchSearchReservations();
  }, []);

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
        setCompleteMessage("予約がキャンセルされました。");
        setCompleteDialogOpen(true);
        await fetchSearchReservations();
      }
      else {
        setCompleteMessage("予約がキャンセルできませんでした。");
        setCompleteDialogOpen(true);
      }
    } catch (error) {
      console.error('予約キャンセル処理失敗:', error);
    }
  };


  const handleCancel = async (resNo: string) => {
    setOpenDialogId(null);
    // setCompleteMessage("予約がキャンセルされました。");
    // setCompleteDialogOpen(true);
    await handleCancelReservation(resNo);
  };

  const handleCompleteCancelOk = async () => {
    setCompleteDialogOpen(false);
    // router.push("/");
  };

  const showResult1 = () => {
    const count = reservations.length;
    if (count > 0) {
      return (
        <div>{count}件が検索されました。</div>
      )
    }

    return (
      <div>検索結果がありません。</div>
    );
  }

  const showResult = () => {
    
    // return (
      
    // )



    return (
      reservations.map((r) => (
        <Card key={r.res_no} className="mb-2">
          <CardContent className="py-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">予約番号</span>
                <span className="font-medium">{r.res_no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">店舗名</span>
                <span className="font-medium">{r.shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">店舗電話</span>
                <span className="font-medium">{r.shopPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">予約者</span>
                <span className="font-medium">{r.from_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">予約時間</span>
                <span className="font-medium">{`${r.res_date} ${r.res_time}`}</span>
              </div>
            </div>
            <div className="flex justify-evenly mt-6">
              <Button className="w-30" onClick={() => setOpenDialogId(r.res_no)}>
                予約キャンセル
              </Button>
              
              <Dialog open={openDialogId === r.res_no} onOpenChange={open => setOpenDialogId(open ? r.res_no : null)}>
                <DialogContent>
                  <DialogHeader className="text-center text-base font-medium sm:text-center">
                    <DialogTitle>予約をキャンセルしますか？</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                  </DialogDescription>
                  <DialogFooter className="flex justify-center gap-4 pt-2 sm:justify-evenly">
                    <Button onClick={() => handleCancel(r.res_no)}>確認</Button>
                    <Button variant="outline" onClick={() => setOpenDialogId(null)}>取消</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl space-y-8">
        {showResult1()}
        {showResult()}
        {/* 취소 완료 메시지 다이얼로그 */}
        <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
          <DialogContent>
            <DialogHeader className="text-center text-base font-medium">
              <DialogTitle>{completeMessage}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
            </DialogDescription>
            <DialogFooter className="flex justify-center pt-2">
              <Button onClick={() => handleCompleteCancelOk()}>確認</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex justify-center pt-4">
          <Link href="/">
            <Button className="w-72 text-lg">ホーム</Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 