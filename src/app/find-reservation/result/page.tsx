"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface ReservationHistoryItem {
  res_no?: any;
  res_date?: any;
  res_time?: any;
  from_name?: any;
  from_email?: any;
  from_phone?: any;
  res_status?: any;
}

const sampleReservations = [
  {
    res_no: "1234",
    from_name: "タロウ",
    res_date: "2025-06-30",
    res_time: "12:00",
  },
  {
    res_no: "1235",
    from_name: "タロウ",
    res_date: "2025-06-30",
    res_time: "12:00",
  },
];

export default function FindReservationResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  // 각 예약별 Dialog 오픈 상태 관리
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  // 취소 완료 메시지 다이얼로그 상태
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");

  const handleCancel = async (id: string) => {
    setOpenDialogId(null);
    setCompleteMessage("キャンセルが完了しました");
    setCompleteDialogOpen(true);
  };

  const handleCompleteCancelOk = async () => {
    setCompleteDialogOpen(false);

    // TODO: 검색 결과를 재조회하는 것으로 변경할 수 있다.
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b py-4">
        <h1 className="text-center text-2xl font-semibold">検索結果</h1>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xl space-y-8">
          {sampleReservations.map((r) => (
            <Card key={r.res_no} className="mb-2">
              <CardContent className="py-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">予約番号</span>
                    <span className="font-medium">{r.res_no}</span>
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
                <div className="flex justify-center mt-6">
                  <Button className="w-40" onClick={() => setOpenDialogId(r.res_no)}>
                    予約キャンセル
                  </Button>
                  <Dialog open={openDialogId === r.res_no} onOpenChange={open => setOpenDialogId(open ? r.res_no : null)}>
                    <DialogContent>
                      <DialogHeader className="text-center text-base font-medium">
                        <DialogTitle>予約をキャンセルしますか？</DialogTitle>
                      </DialogHeader>
                      <DialogFooter className="flex justify-center gap-4 pt-2">
                        <Button onClick={() => handleCancel(r.res_no)}>確認</Button>
                        <Button variant="outline" onClick={() => setOpenDialogId(null)}>取消</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-center pt-4">
            <Link href="/">
              <Button className="w-72 text-lg">ホーム</Button>
            </Link>
          </div>
          {/* 취소 완료 메시지 다이얼로그 */}
          <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
            <DialogContent>
              <DialogHeader className="text-center text-base font-medium">
                <DialogTitle>{completeMessage}</DialogTitle>
              </DialogHeader>
              <DialogFooter className="flex justify-center pt-2">
                <Button onClick={() => handleCompleteCancelOk()}>OK</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
} 